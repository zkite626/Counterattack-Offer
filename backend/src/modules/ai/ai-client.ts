import { BadGatewayException, GatewayTimeoutException } from '@nestjs/common';

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface AIClientConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature?: number | null;
  maxTokens?: number | null;
  timeoutMs?: number;
  retryCount?: number;
}

export interface AIChatOptions {
  jsonMode?: boolean;
  temperature?: number | null;
  maxTokens?: number | null;
}

export interface AIUsage {
  promptTokens: number | null;
  completionTokens: number | null;
}

export interface AIChatResult {
  content: string;
  usage: AIUsage;
}

export interface AIConnectionTestResult {
  success: boolean;
  latencyMs: number;
  errorCode?: string;
}

interface ChatCompletionChoice {
  message?: {
    content?: string | null;
  };
}

interface ChatCompletionUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
}

interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[];
  usage?: ChatCompletionUsage;
}

interface ErrorResponse {
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
}

export class OpenAICompatibleClient {
  private readonly timeoutMs: number;
  private readonly retryCount: number;

  constructor(private readonly config: AIClientConfig) {
    this.timeoutMs = config.timeoutMs ?? 30000;
    this.retryCount = config.retryCount ?? 1;
  }

  async chat(
    messages: ChatMessage[],
    options: AIChatOptions = {},
  ): Promise<AIChatResult> {
    try {
      const response = await this.requestJson(messages, options, false);
      const content = response.choices?.[0]?.message?.content;

      if (typeof content !== 'string' || content.length === 0) {
        throw new BadGatewayException({
          code: 'AI_EMPTY_RESPONSE',
          message: 'AI 返回内容为空',
        });
      }

      return {
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? null,
          completionTokens: response.usage?.completion_tokens ?? null,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async chatJson<T>(
    messages: ChatMessage[],
    schemaName: string,
    options: AIChatOptions = {},
  ): Promise<{ data: T; raw: AIChatResult }> {
    try {
      const raw = await this.chat(
        [
          ...messages,
          {
            role: 'system',
            content: `请只输出一个合法 JSON 对象，schema 名称：${schemaName}。`,
          },
        ],
        { ...options, jsonMode: true },
      );
      const parsed: unknown = JSON.parse(raw.content);

      return { data: parsed as T, raw };
    } catch (error) {
      throw error;
    }
  }

  async chatStream(
    messages: ChatMessage[],
    options: AIChatOptions = {},
  ): Promise<ReadableStream<Uint8Array>> {
    try {
      const response = await this.request(messages, options, true);

      if (response.body === null) {
        throw new BadGatewayException({
          code: 'AI_EMPTY_STREAM',
          message: 'AI 流式响应为空',
        });
      }

      return response.body;
    } catch (error) {
      throw error;
    }
  }

  async testConnection(): Promise<AIConnectionTestResult> {
    const startedAt = Date.now();

    try {
      await this.chat(
        [
          {
            role: 'user',
            content: 'Reply with the single word ok.',
          },
        ],
        { maxTokens: 8, temperature: 0 },
      );

      return {
        success: true,
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      return {
        success: false,
        latencyMs: Date.now() - startedAt,
        errorCode: this.errorCodeFromUnknown(error),
      };
    }
  }

  private async requestJson(
    messages: ChatMessage[],
    options: AIChatOptions,
    stream: false,
  ): Promise<ChatCompletionResponse> {
    const response = await this.request(messages, options, stream);
    const payload: unknown = await response.json();

    if (this.isChatCompletionResponse(payload)) {
      return payload;
    }

    if (this.isErrorResponse(payload)) {
      throw new BadGatewayException({
        code:
          payload.error?.code ??
          payload.error?.type ??
          'AI_PROVIDER_ERROR',
        message: payload.error?.message ?? 'AI 服务返回错误',
      });
    }

    if (this.isProviderStatusErrorResponse(payload)) {
      throw new BadGatewayException({
        code: payload.code,
        message: payload.message,
      });
    }

    throw new BadGatewayException({
      code: 'AI_RESPONSE_FORMAT_ERROR',
      message: 'AI 响应格式不符合 OpenAI 兼容协议',
    });
  }

  private async request(
    messages: ChatMessage[],
    options: AIChatOptions,
    stream: boolean,
  ): Promise<Response> {
    const url = this.buildChatCompletionsUrl();
    const body = this.buildRequestBody(messages, options, stream);
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= this.retryCount; attempt += 1) {
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), this.timeoutMs);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          signal: abortController.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          return response;
        }

        const errorPayload = await this.readErrorPayload(response);

        if (!this.shouldRetry(response.status) || attempt === this.retryCount) {
          throw new BadGatewayException({
            code: errorPayload.code,
            message: errorPayload.message,
          });
        }

        lastError = errorPayload;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;

        if (error instanceof BadGatewayException) {
          throw error;
        }

        if (this.isAbortError(error)) {
          if (attempt === this.retryCount) {
            throw new GatewayTimeoutException({
              code: 'AI_REQUEST_TIMEOUT',
              message: 'AI 请求超时',
            });
          }
        } else if (attempt === this.retryCount) {
          throw new BadGatewayException({
            code: 'AI_REQUEST_FAILED',
            message: 'AI 请求失败',
          });
        }
      }

      await this.delay(300 * (attempt + 1));
    }

    throw new BadGatewayException({
      code: this.errorCodeFromUnknown(lastError),
      message: 'AI 请求失败',
    });
  }

  private buildRequestBody(
    messages: ChatMessage[],
    options: AIChatOptions,
    stream: boolean,
  ): Record<string, unknown> {
    const temperature = options.temperature ?? this.config.temperature;
    const maxTokens = options.maxTokens ?? this.config.maxTokens;
    const normalizedMessages =
      options.jsonMode === true ? this.withJsonInstruction(messages) : messages;
    const body: Record<string, unknown> = {
      model: this.config.model,
      messages: normalizedMessages,
      stream,
    };

    if (temperature !== null && temperature !== undefined) {
      body.temperature = temperature;
    }

    if (maxTokens !== null && maxTokens !== undefined) {
      body.max_tokens = maxTokens;
    }

    if (options.jsonMode === true) {
      body.response_format = { type: 'json_object' };
    }

    if (stream) {
      body.stream_options = { include_usage: true };
    }

    return body;
  }

  private buildChatCompletionsUrl(): string {
    const baseUrl = this.config.baseUrl.trim().replace(/\/+$/, '');

    if (baseUrl.endsWith('/chat/completions')) {
      return baseUrl;
    }

    if (baseUrl.endsWith('/v1')) {
      return `${baseUrl}/chat/completions`;
    }

    return `${baseUrl}/v1/chat/completions`;
  }

  private async readErrorPayload(
    response: Response,
  ): Promise<{ code: string; message: string }> {
    try {
      const payload: unknown = await response.json();

      if (this.isErrorResponse(payload)) {
        return {
          code:
            payload.error?.code ??
            payload.error?.type ??
            `AI_HTTP_${response.status}`,
          message: payload.error?.message ?? 'AI 服务返回错误',
        };
      }
    } catch (error) {
      return {
        code: `AI_HTTP_${response.status}`,
        message: 'AI 服务返回错误',
      };
    }

    return {
      code: `AI_HTTP_${response.status}`,
      message: 'AI 服务返回错误',
    };
  }

  private shouldRetry(statusCode: number): boolean {
    return statusCode === 429 || statusCode >= 500;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === 'AbortError';
  }

  private errorCodeFromUnknown(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'code' in error.response &&
      typeof error.response.code === 'string'
    ) {
      return error.response.code;
    }

    return 'AI_REQUEST_FAILED';
  }

  private isChatCompletionResponse(
    value: unknown,
  ): value is ChatCompletionResponse {
    return typeof value === 'object' && value !== null && 'choices' in value;
  }

  private isErrorResponse(value: unknown): value is ErrorResponse {
    return typeof value === 'object' && value !== null && 'error' in value;
  }

  private isProviderStatusErrorResponse(
    value: unknown,
  ): value is { code: string; message: string } {
    if (
      typeof value !== 'object' ||
      value === null ||
      !('code' in value) ||
      !('message' in value)
    ) {
      return false;
    }

    const payload = value as Record<string, unknown>;
    const code =
      typeof payload.code === 'string'
        ? payload.code
        : typeof payload.code === 'number'
          ? `${payload.code}`
          : null;

    if (
      code === null ||
      code === '0' ||
      code.toLowerCase() === 'success' ||
      typeof payload.message !== 'string'
    ) {
      return false;
    }

    payload.code = code;

    return true;
  }

  private withJsonInstruction(messages: ChatMessage[]): ChatMessage[] {
    if (messages.some((message) => /\bjson\b/i.test(message.content))) {
      return messages;
    }

    const instruction = '请以 JSON 格式输出，不要输出 Markdown 或额外说明。';
    const firstSystemIndex = messages.findIndex(
      (message) => message.role === 'system',
    );

    if (firstSystemIndex >= 0) {
      return messages.map((message, index) =>
        index === firstSystemIndex
          ? { ...message, content: `${message.content}\n\n${instruction}` }
          : message,
      );
    }

    return [{ role: 'system', content: instruction }, ...messages];
  }
}
