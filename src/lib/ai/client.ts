import type {
  ChatMessage,
  ChatCompletionRequest,
  ChatCompletionResponse,
} from '@/types/ai';

// 统一 AI 客户端配置
interface AIClientConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;         // 默认 60s
  retryCount?: number;      // 默认 2
}

// AI 服务错误类
export class AIServiceError extends Error {
  code: string;
  statusCode?: number;
  provider?: string;

  constructor(code: string, message: string, statusCode?: number, provider?: string) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.statusCode = statusCode;
    this.provider = provider;
  }
}

// 延时工具函数
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class AIClient {
  private baseUrl: string;
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private timeout: number;
  private retryCount: number;

  constructor(config: AIClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.maxTokens = config.maxTokens ?? 4096;
    this.temperature = config.temperature ?? 0.7;
    this.timeout = config.timeout ?? 60000;
    this.retryCount = config.retryCount ?? 2;
  }

  /**
   * 非流式调用：返回完整响应文本
   */
  async chat(messages: ChatMessage[], jsonMode?: boolean): Promise<string> {
    const body: ChatCompletionRequest = {
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      stream: false,
    };

    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const response = await this.fetchWithRetry(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as ChatCompletionResponse;

    if (!data.choices || data.choices.length === 0) {
      throw new AIServiceError('AI_PARSE_ERROR', 'AI 返回结果为空');
    }

    return data.choices[0].message.content;
  }

  /**
   * 流式调用：返回 ReadableStream
   */
  async chatStream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    const body: ChatCompletionRequest = {
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      stream: true,
    };

    const response = await this.fetchWithRetry(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.body) {
      throw new AIServiceError('AI_STREAM_ERROR', '流式响应 body 为空');
    }

    return response.body;
  }

  /**
   * 带重试和超时的 fetch 封装
   */
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | undefined;

    for (let i = 0; i <= this.retryCount; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        // 速率限制：等待后重试
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitMs = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : Math.pow(2, i) * 1000;
          await sleep(waitMs);
          lastError = new AIServiceError('AI_RATE_LIMIT', '请求过于频繁，正在重试');
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text().catch(() => '未知错误');
          throw new AIServiceError(
            'AI_MODEL_ERROR',
            `AI 服务返回错误 (${response.status}): ${errorText}`,
            response.status
          );
        }

        return response;
      } catch (error) {
        if (error instanceof AIServiceError && error.code === 'AI_MODEL_ERROR') {
          throw error;
        }

        lastError = error instanceof Error ? error : new Error(String(error));

        // 超时错误
        if (lastError.name === 'AbortError') {
          lastError = new AIServiceError('AI_TIMEOUT', 'AI 服务请求超时');
        }

        // 最后一次重试仍失败
        if (i === this.retryCount) {
          throw lastError instanceof AIServiceError
            ? lastError
            : new AIServiceError('AI_MODEL_ERROR', `AI 请求失败: ${lastError.message}`);
        }

        // 指数退避
        await sleep(Math.pow(2, i) * 1000);
      }
    }

    throw lastError instanceof AIServiceError
      ? lastError
      : new AIServiceError('AI_MODEL_ERROR', '超过最大重试次数');
  }
}
