import { Injectable } from '@nestjs/common';
import { AICallStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ModelConfigService } from '../model-config/model-config.service';
import { OpenAICompatibleClient } from './ai-client';
import type { AIInvokeOptions, AIInvokeResult } from './dto/ai.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly modelConfigService: ModelConfigService,
  ) {}

  async chat(
    userId: string,
    options: AIInvokeOptions,
  ): Promise<AIInvokeResult> {
    const startedAt = Date.now();
    const modelConfig = await this.modelConfigService.resolveModelForUser(
      userId,
      options.modelConfigId,
    );
    const client = new OpenAICompatibleClient({
      baseUrl: modelConfig.baseUrl,
      apiKey: this.modelConfigService.decryptApiKey(modelConfig),
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
      timeoutMs: 30000,
      retryCount: 1,
    });

    try {
      const result = await client.chat(options.messages, {
        jsonMode: options.jsonMode,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });
      const latencyMs = Date.now() - startedAt;

      await this.recordCallLog({
        userId,
        modelConfigId: modelConfig.id,
        module: options.module,
        provider: modelConfig.provider,
        model: modelConfig.model,
        status: AICallStatus.SUCCESS,
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        latencyMs,
        errorCode: null,
      });

      return {
        content: result.content,
        modelConfigId: modelConfig.id,
        provider: modelConfig.provider,
        model: modelConfig.model,
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        latencyMs,
      };
    } catch (error) {
      await this.recordCallLog({
        userId,
        modelConfigId: modelConfig.id,
        module: options.module,
        provider: modelConfig.provider,
        model: modelConfig.model,
        status: AICallStatus.FAILED,
        promptTokens: null,
        completionTokens: null,
        latencyMs: Date.now() - startedAt,
        errorCode: this.errorCodeFromUnknown(error),
      });

      throw error;
    }
  }

  async chatJson<T>(
    userId: string,
    options: AIInvokeOptions,
  ): Promise<AIInvokeResult & { data: T }> {
    try {
      const result = await this.chat(userId, { ...options, jsonMode: true });
      const parsed: unknown = JSON.parse(result.content);

      return { ...result, data: parsed as T };
    } catch (error) {
      throw error;
    }
  }

  async chatStream(
    userId: string,
    options: AIInvokeOptions,
  ): Promise<ReadableStream<Uint8Array>> {
    const startedAt = Date.now();
    const modelConfig = await this.modelConfigService.resolveModelForUser(
      userId,
      options.modelConfigId,
    );
    const client = new OpenAICompatibleClient({
      baseUrl: modelConfig.baseUrl,
      apiKey: this.modelConfigService.decryptApiKey(modelConfig),
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
      timeoutMs: 30000,
      retryCount: 1,
    });

    try {
      const stream = await client.chatStream(options.messages, {
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });

      await this.recordCallLog({
        userId,
        modelConfigId: modelConfig.id,
        module: options.module,
        provider: modelConfig.provider,
        model: modelConfig.model,
        status: AICallStatus.SUCCESS,
        promptTokens: null,
        completionTokens: null,
        latencyMs: Date.now() - startedAt,
        errorCode: null,
      });

      return stream;
    } catch (error) {
      await this.recordCallLog({
        userId,
        modelConfigId: modelConfig.id,
        module: options.module,
        provider: modelConfig.provider,
        model: modelConfig.model,
        status: AICallStatus.FAILED,
        promptTokens: null,
        completionTokens: null,
        latencyMs: Date.now() - startedAt,
        errorCode: this.errorCodeFromUnknown(error),
      });

      throw error;
    }
  }

  private async recordCallLog(input: {
    userId: string;
    modelConfigId: string;
    module: string;
    provider: string;
    model: string;
    status: AICallStatus;
    promptTokens: number | null;
    completionTokens: number | null;
    latencyMs: number;
    errorCode: string | null;
  }): Promise<void> {
    try {
      await this.prismaService.aICallLog.create({
        data: {
          userId: input.userId,
          modelConfigId: input.modelConfigId,
          module: input.module,
          provider: input.provider,
          model: input.model,
          status: input.status,
          promptTokens: input.promptTokens,
          completionTokens: input.completionTokens,
          latencyMs: input.latencyMs,
          errorCode: input.errorCode,
        },
      });
    } catch (error) {
      throw error;
    }
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
}
