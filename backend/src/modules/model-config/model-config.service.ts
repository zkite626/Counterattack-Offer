import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AICallStatus,
  AIModelConfig,
  AIModelScope,
  Prisma,
  TestStatus,
} from '@prisma/client';
import { SecretService } from '../../common/security/secret.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenAICompatibleClient } from '../ai/ai-client';
import type {
  AIModelConfigResponse,
  ModelTestResponse,
  SaveAIModelDto,
  UpdateAIModelDto,
  UserAIModelsResponse,
  ValidatedAIModelInput,
  ValidatedAIModelPatch,
} from './dto/model-config.dto';

export interface ResolvedAIModelConfig {
  id: string;
  scope: AIModelScope;
  ownerUserId: string | null;
  provider: string;
  baseUrl: string;
  model: string;
  encryptedApiKey: string;
  temperature: number | null;
  maxTokens: number | null;
}

const scopeMap: Record<AIModelScope, 'user' | 'global'> = {
  [AIModelScope.USER]: 'user',
  [AIModelScope.GLOBAL]: 'global',
};

const testStatusMap: Record<TestStatus, 'success' | 'failed'> = {
  [TestStatus.SUCCESS]: 'success',
  [TestStatus.FAILED]: 'failed',
};

@Injectable()
export class ModelConfigService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly secretService: SecretService,
  ) {}

  async listUserModels(userId: string): Promise<UserAIModelsResponse> {
    try {
      const [userModels, globalModels] = await Promise.all([
        this.prismaService.aIModelConfig.findMany({
          where: { scope: AIModelScope.USER, ownerUserId: userId },
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        }),
        this.prismaService.aIModelConfig.findMany({
          where: { scope: AIModelScope.GLOBAL, isEnabled: true },
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        }),
      ]);
      const userDefault = userModels.find(
        (model) => model.isDefault && model.isEnabled,
      );
      const globalDefault = globalModels.find((model) => model.isDefault);

      return {
        userModels: userModels.map((model) => this.toResponse(model)),
        globalModels: globalModels.map((model) => this.toResponse(model)),
        activeModelId: userDefault?.id ?? globalDefault?.id ?? null,
        fallbackToGlobal:
          userDefault === undefined && globalDefault !== undefined,
      };
    } catch (error) {
      throw error;
    }
  }

  async listGlobalModels(): Promise<{ models: AIModelConfigResponse[] }> {
    try {
      const models = await this.prismaService.aIModelConfig.findMany({
        where: { scope: AIModelScope.GLOBAL },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });

      return { models: models.map((model) => this.toResponse(model)) };
    } catch (error) {
      throw error;
    }
  }

  async createUserModel(
    userId: string,
    dto: SaveAIModelDto,
  ): Promise<AIModelConfigResponse> {
    try {
      const input = this.validateCreateDto(dto);
      const shouldDefault = await this.shouldCreateAsDefault(
        AIModelScope.USER,
        userId,
      );

      return this.toResponse(
        await this.createModel(
          AIModelScope.USER,
          userId,
          userId,
          input,
          shouldDefault,
        ),
      );
    } catch (error) {
      this.throwIfUniqueConflict(error);
      throw error;
    }
  }

  async createGlobalModel(
    actorUserId: string,
    dto: SaveAIModelDto,
  ): Promise<AIModelConfigResponse> {
    try {
      const input = this.validateCreateDto(dto);
      const shouldDefault = await this.shouldCreateAsDefault(
        AIModelScope.GLOBAL,
        null,
      );

      return this.toResponse(
        await this.createModel(
          AIModelScope.GLOBAL,
          null,
          actorUserId,
          input,
          shouldDefault,
        ),
      );
    } catch (error) {
      this.throwIfUniqueConflict(error);
      throw error;
    }
  }

  async updateUserModel(
    userId: string,
    modelId: string,
    dto: UpdateAIModelDto,
  ): Promise<AIModelConfigResponse> {
    try {
      const existing = await this.getOwnedUserModel(modelId, userId);
      const input = this.validatePatchDto(dto);

      return this.toResponse(await this.updateModel(existing, input));
    } catch (error) {
      this.throwIfUniqueConflict(error);
      throw error;
    }
  }

  async updateGlobalModel(
    modelId: string,
    dto: UpdateAIModelDto,
  ): Promise<AIModelConfigResponse> {
    try {
      const existing = await this.getGlobalModel(modelId);
      const input = this.validatePatchDto(dto);

      return this.toResponse(await this.updateModel(existing, input));
    } catch (error) {
      this.throwIfUniqueConflict(error);
      throw error;
    }
  }

  async deleteUserModel(
    userId: string,
    modelId: string,
  ): Promise<{ message: string }> {
    try {
      await this.getOwnedUserModel(modelId, userId);
      await this.prismaService.aIModelConfig.delete({ where: { id: modelId } });

      return { message: '模型配置已删除' };
    } catch (error) {
      throw error;
    }
  }

  async setUserDefault(
    userId: string,
    modelId: string,
  ): Promise<AIModelConfigResponse> {
    try {
      const model = await this.getOwnedUserModel(modelId, userId);

      if (!model.isEnabled) {
        throw new BadRequestException({
          code: 'AI_MODEL_DISABLED',
          message: '停用的模型不能设为默认',
        });
      }

      return this.toResponse(
        await this.setDefault(AIModelScope.USER, modelId, userId),
      );
    } catch (error) {
      throw error;
    }
  }

  async setGlobalDefault(modelId: string): Promise<AIModelConfigResponse> {
    try {
      const model = await this.getGlobalModel(modelId);

      if (!model.isEnabled) {
        throw new BadRequestException({
          code: 'AI_MODEL_DISABLED',
          message: '停用的模型不能设为默认',
        });
      }

      return this.toResponse(
        await this.setDefault(AIModelScope.GLOBAL, modelId, null),
      );
    } catch (error) {
      throw error;
    }
  }

  async testUserModel(
    userId: string,
    modelId: string,
  ): Promise<ModelTestResponse> {
    try {
      const model = await this.getOwnedUserModel(modelId, userId);

      return this.testModel(model, userId);
    } catch (error) {
      throw error;
    }
  }

  async testGlobalModel(
    actorUserId: string,
    modelId: string,
  ): Promise<ModelTestResponse> {
    try {
      const model = await this.getGlobalModel(modelId);

      return this.testModel(model, actorUserId);
    } catch (error) {
      throw error;
    }
  }

  async resolveModelForUser(
    userId: string,
    requestedModelConfigId?: string | null,
  ): Promise<ResolvedAIModelConfig> {
    try {
      if (
        typeof requestedModelConfigId === 'string' &&
        requestedModelConfigId.length > 0
      ) {
        const requested = await this.prismaService.aIModelConfig.findFirst({
          where: {
            id: requestedModelConfigId,
            isEnabled: true,
            OR: [
              { scope: AIModelScope.USER, ownerUserId: userId },
              { scope: AIModelScope.GLOBAL },
            ],
          },
        });

        if (requested === null) {
          throw new ForbiddenException({
            code: 'AI_MODEL_NOT_ACCESSIBLE',
            message: '无权使用该模型配置',
          });
        }

        return this.toResolved(requested);
      }

      const userDefault = await this.prismaService.aIModelConfig.findFirst({
        where: {
          scope: AIModelScope.USER,
          ownerUserId: userId,
          isDefault: true,
          isEnabled: true,
        },
      });

      if (userDefault !== null) {
        return this.toResolved(userDefault);
      }

      const globalDefault = await this.prismaService.aIModelConfig.findFirst({
        where: {
          scope: AIModelScope.GLOBAL,
          isDefault: true,
          isEnabled: true,
        },
      });

      if (globalDefault !== null) {
        return this.toResolved(globalDefault);
      }

      throw new BadRequestException({
        code: 'AI_MODEL_NOT_CONFIGURED',
        message: '尚未配置可用 AI 模型',
      });
    } catch (error) {
      throw error;
    }
  }

  decryptApiKey(model: ResolvedAIModelConfig): string {
    try {
      return this.secretService.decrypt(model.encryptedApiKey);
    } catch (error) {
      throw error;
    }
  }

  private async createModel(
    scope: AIModelScope,
    ownerUserId: string | null,
    createdBy: string,
    input: ValidatedAIModelInput,
    isDefault: boolean,
  ): Promise<AIModelConfig> {
    return this.prismaService.aIModelConfig.create({
      data: {
        scope,
        ownerUserId,
        createdBy,
        displayName: input.displayName,
        provider: input.provider,
        baseUrl: input.baseUrl,
        model: input.model,
        encryptedApiKey: this.secretService.encrypt(input.apiKey),
        apiKeyHint: this.secretService.mask(input.apiKey),
        apiKeyFingerprint: this.secretService.fingerprint(input.apiKey),
        temperature: input.temperature,
        maxTokens: input.maxTokens,
        isEnabled: input.isEnabled,
        isDefault,
      },
    });
  }

  private async updateModel(
    existing: AIModelConfig,
    input: ValidatedAIModelPatch,
  ): Promise<AIModelConfig> {
    const data: Prisma.AIModelConfigUpdateInput = {};

    if (input.displayName !== undefined) {
      data.displayName = input.displayName;
    }

    if (input.provider !== undefined) {
      data.provider = input.provider;
    }

    if (input.baseUrl !== undefined) {
      data.baseUrl = input.baseUrl;
    }

    if (input.model !== undefined) {
      data.model = input.model;
    }

    if (input.temperature !== undefined) {
      data.temperature = input.temperature;
    }

    if (input.maxTokens !== undefined) {
      data.maxTokens = input.maxTokens;
    }

    if (input.isEnabled !== undefined) {
      data.isEnabled = input.isEnabled;
      if (!input.isEnabled && existing.isDefault) {
        data.isDefault = false;
      }
    }

    if (input.apiKey !== undefined) {
      data.encryptedApiKey = this.secretService.encrypt(input.apiKey);
      data.apiKeyHint = this.secretService.mask(input.apiKey);
      data.apiKeyFingerprint = this.secretService.fingerprint(input.apiKey);
      data.lastTestStatus = null;
      data.lastTestedAt = null;
    }

    return this.prismaService.aIModelConfig.update({
      where: { id: existing.id },
      data,
    });
  }

  private async setDefault(
    scope: AIModelScope,
    modelId: string,
    ownerUserId: string | null,
  ): Promise<AIModelConfig> {
    return this.prismaService.$transaction(async (tx) => {
      await tx.aIModelConfig.updateMany({
        where:
          scope === AIModelScope.USER
            ? { scope, ownerUserId }
            : { scope: AIModelScope.GLOBAL },
        data: { isDefault: false },
      });

      return tx.aIModelConfig.update({
        where: { id: modelId },
        data: { isDefault: true },
      });
    });
  }

  private async testModel(
    model: AIModelConfig,
    userId: string,
  ): Promise<ModelTestResponse> {
    const client = new OpenAICompatibleClient({
      baseUrl: model.baseUrl,
      apiKey: this.secretService.decrypt(model.encryptedApiKey),
      model: model.model,
      temperature:
        model.temperature === null ? null : Number(model.temperature),
      maxTokens: model.maxTokens,
      timeoutMs: 15000,
      retryCount: 0,
    });
    const result = await client.testConnection();
    const status = result.success ? TestStatus.SUCCESS : TestStatus.FAILED;
    const saved = await this.prismaService.aIModelConfig.update({
      where: { id: model.id },
      data: {
        lastTestedAt: new Date(),
        lastTestStatus: status,
      },
    });

    await this.prismaService.aICallLog.create({
      data: {
        userId,
        modelConfigId: model.id,
        module: 'model_test',
        provider: model.provider,
        model: model.model,
        status: result.success ? AICallStatus.SUCCESS : AICallStatus.FAILED,
        promptTokens: null,
        completionTokens: null,
        latencyMs: result.latencyMs,
        errorCode: result.errorCode ?? null,
      },
    });

    return {
      success: result.success,
      latencyMs: result.latencyMs,
      errorCode: result.errorCode,
      model: this.toResponse(saved),
    };
  }

  private async shouldCreateAsDefault(
    scope: AIModelScope,
    ownerUserId: string | null,
  ): Promise<boolean> {
    const existingDefault = await this.prismaService.aIModelConfig.findFirst({
      where:
        scope === AIModelScope.USER
          ? { scope, ownerUserId, isDefault: true }
          : { scope: AIModelScope.GLOBAL, isDefault: true },
    });

    return existingDefault === null;
  }

  private async getOwnedUserModel(
    modelId: string,
    userId: string,
  ): Promise<AIModelConfig> {
    const model = await this.prismaService.aIModelConfig.findFirst({
      where: { id: modelId, scope: AIModelScope.USER, ownerUserId: userId },
    });

    if (model === null) {
      throw new NotFoundException({
        code: 'AI_MODEL_NOT_FOUND',
        message: '模型配置不存在',
      });
    }

    return model;
  }

  private async getGlobalModel(modelId: string): Promise<AIModelConfig> {
    const model = await this.prismaService.aIModelConfig.findFirst({
      where: { id: modelId, scope: AIModelScope.GLOBAL },
    });

    if (model === null) {
      throw new NotFoundException({
        code: 'AI_MODEL_NOT_FOUND',
        message: '全局模型配置不存在',
      });
    }

    return model;
  }

  private toResolved(model: AIModelConfig): ResolvedAIModelConfig {
    return {
      id: model.id,
      scope: model.scope,
      ownerUserId: model.ownerUserId,
      provider: model.provider,
      baseUrl: model.baseUrl,
      model: model.model,
      encryptedApiKey: model.encryptedApiKey,
      temperature:
        model.temperature === null ? null : Number(model.temperature),
      maxTokens: model.maxTokens,
    };
  }

  private toResponse(model: AIModelConfig): AIModelConfigResponse {
    return {
      id: model.id,
      scope: scopeMap[model.scope],
      ownerUserId: model.ownerUserId,
      displayName: model.displayName,
      provider: model.provider,
      baseUrl: model.baseUrl,
      model: model.model,
      apiKeyHint: model.apiKeyHint,
      temperature:
        model.temperature === null ? null : Number(model.temperature),
      maxTokens: model.maxTokens,
      isDefault: model.isDefault,
      isEnabled: model.isEnabled,
      lastTestedAt: model.lastTestedAt?.toISOString() ?? null,
      lastTestStatus:
        model.lastTestStatus === null
          ? null
          : testStatusMap[model.lastTestStatus],
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    };
  }

  private validateCreateDto(dto: SaveAIModelDto): ValidatedAIModelInput {
    const displayName = this.readRequiredString(
      dto.displayName,
      'displayName',
      120,
    );
    const provider = this.readProvider(dto.provider);
    const baseUrl = this.readBaseUrl(dto.baseUrl);
    const model = this.readRequiredString(dto.model, 'model', 120);
    const apiKey = this.readRequiredString(dto.apiKey, 'apiKey', 4096);
    const temperature = this.readNullableNumber(
      dto.temperature,
      'temperature',
      0,
      2,
    );
    const maxTokens = this.readNullableInteger(
      dto.maxTokens,
      'maxTokens',
      1,
      200000,
    );
    const isEnabled = this.readOptionalBoolean(
      dto.isEnabled,
      true,
      'isEnabled',
    );

    return {
      displayName,
      provider,
      baseUrl,
      model,
      apiKey,
      temperature,
      maxTokens,
      isEnabled,
    };
  }

  private validatePatchDto(dto: UpdateAIModelDto): ValidatedAIModelPatch {
    const input: ValidatedAIModelPatch = {};

    if (dto.displayName !== undefined) {
      input.displayName = this.readRequiredString(
        dto.displayName,
        'displayName',
        120,
      );
    }

    if (dto.provider !== undefined) {
      input.provider = this.readProvider(dto.provider);
    }

    if (dto.baseUrl !== undefined) {
      input.baseUrl = this.readBaseUrl(dto.baseUrl);
    }

    if (dto.model !== undefined) {
      input.model = this.readRequiredString(dto.model, 'model', 120);
    }

    if (dto.apiKey !== undefined && dto.apiKey !== null && dto.apiKey !== '') {
      input.apiKey = this.readRequiredString(dto.apiKey, 'apiKey', 4096);
    }

    if (dto.temperature !== undefined) {
      input.temperature = this.readNullableNumber(
        dto.temperature,
        'temperature',
        0,
        2,
      );
    }

    if (dto.maxTokens !== undefined) {
      input.maxTokens = this.readNullableInteger(
        dto.maxTokens,
        'maxTokens',
        1,
        200000,
      );
    }

    if (dto.isEnabled !== undefined) {
      input.isEnabled = this.readOptionalBoolean(
        dto.isEnabled,
        true,
        'isEnabled',
      );
    }

    if (Object.keys(input).length === 0) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '至少提供一个要更新的字段',
      });
    }

    return input;
  }

  private readProvider(value: unknown): string {
    const provider = this.readRequiredString(
      value,
      'provider',
      60,
    ).toLowerCase();

    if (!/^[a-z0-9_-]+$/.test(provider)) {
      throw this.validationError(
        'provider',
        'Provider 只能包含小写字母、数字、下划线或连字符',
      );
    }

    return provider;
  }

  private readBaseUrl(value: unknown): string {
    const baseUrl = this.readRequiredString(value, 'baseUrl', 2048).replace(
      /\/+$/,
      '',
    );

    try {
      const url = new URL(baseUrl);

      if (
        url.protocol !== 'https:' &&
        url.hostname !== 'localhost' &&
        url.hostname !== '127.0.0.1'
      ) {
        throw this.validationError('baseUrl', 'Base URL 必须使用 https');
      }

      return url.toString().replace(/\/+$/, '');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw this.validationError('baseUrl', 'Base URL 格式无效');
    }
  }

  private readRequiredString(
    value: unknown,
    field: string,
    maxLength: number,
  ): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw this.validationError(field, `${field} 不能为空`);
    }

    const result = value.trim();

    if (result.length > maxLength) {
      throw this.validationError(field, `${field} 长度不能超过 ${maxLength}`);
    }

    return result;
  }

  private readNullableNumber(
    value: unknown,
    field: string,
    min: number,
    max: number,
  ): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const parsed =
      typeof value === 'number' ? value : Number.parseFloat(`${value}`);

    if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
      throw this.validationError(field, `${field} 必须在 ${min}-${max} 之间`);
    }

    return parsed;
  }

  private readNullableInteger(
    value: unknown,
    field: string,
    min: number,
    max: number,
  ): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const parsed =
      typeof value === 'number' ? value : Number.parseInt(`${value}`, 10);

    if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
      throw this.validationError(field, `${field} 必须在 ${min}-${max} 之间`);
    }

    return parsed;
  }

  private readOptionalBoolean(
    value: unknown,
    fallback: boolean,
    field: string,
  ): boolean {
    if (value === undefined) {
      return fallback;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    throw this.validationError(field, `${field} 必须是布尔值`);
  }

  private validationError(field: string, message: string): BadRequestException {
    return new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: '参数校验失败',
      details: { [field]: [message] },
    });
  }

  private throwIfUniqueConflict(error: unknown): never | void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException({
        code: 'AI_MODEL_DUPLICATE_SECRET',
        message: '该 API Key 已保存过，请使用已有模型配置',
      });
    }
  }
}
