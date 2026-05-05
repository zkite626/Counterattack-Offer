import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RateLimitService } from '../../common/rate-limit/rate-limit.service';
import { AuditService } from '../audit/audit.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import type { RequestWithContext } from '../../common/types/request-context.type';
import type {
  AIModelConfigResponse,
  ModelTestResponse,
  SaveAIModelDto,
  UpdateAIModelDto,
  UserAIModelsResponse,
} from './dto/model-config.dto';
import { ModelConfigService } from './model-config.service';

@Controller('ai/models')
@UseGuards(JwtAuthGuard)
export class ModelConfigController {
  constructor(
    private readonly modelConfigService: ModelConfigService,
    private readonly rateLimitService: RateLimitService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  async listModels(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserAIModelsResponse> {
    try {
      return await this.modelConfigService.listUserModels(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createModel(
    @Body() dto: SaveAIModelDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      const model = await this.modelConfigService.createUserModel(user.id, dto);
      await this.recordModelAudit(
        user.id,
        request,
        'ai.model.create',
        model,
        dto,
      );
      return { model };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateModel(
    @Param('id') id: string,
    @Body() dto: UpdateAIModelDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      const model = await this.modelConfigService.updateUserModel(
        user.id,
        id,
        dto,
      );
      await this.recordModelAudit(
        user.id,
        request,
        'ai.model.update',
        model,
        dto,
      );
      return { model };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteModel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ message: string }> {
    try {
      const result = await this.modelConfigService.deleteUserModel(user.id, id);
      await this.auditService.record({
        actorUserId: user.id,
        action: 'ai.model.delete',
        targetType: 'ai_model_configs',
        targetId: id,
        metadata: { userId: user.id },
        ipAddress: request.ip ?? null,
        userAgent: request.header('user-agent') ?? null,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/test')
  async testModel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ModelTestResponse> {
    try {
      await this.rateLimitService.consumeModelTest(user.id);
      return await this.modelConfigService.testUserModel(user.id, id);
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/set-default')
  async setDefault(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      const model = await this.modelConfigService.setUserDefault(user.id, id);
      await this.auditService.record({
        actorUserId: user.id,
        action: 'ai.model.set_default',
        targetType: 'ai_model_configs',
        targetId: model.id,
        metadata: this.buildModelMetadata(model),
        ipAddress: request.ip ?? null,
        userAgent: request.header('user-agent') ?? null,
      });
      return { model };
    } catch (error) {
      throw error;
    }
  }

  private async recordModelAudit(
    userId: string,
    request: RequestWithContext,
    action: string,
    model: AIModelConfigResponse,
    dto: SaveAIModelDto | UpdateAIModelDto,
  ): Promise<void> {
    await this.auditService.record({
      actorUserId: userId,
      action,
      targetType: 'ai_model_configs',
      targetId: model.id,
      metadata: {
        ...this.buildModelMetadata(model),
        apiKeyUpdated: typeof dto.apiKey === 'string' && dto.apiKey.trim().length > 0,
      },
      ipAddress: request.ip ?? null,
      userAgent: request.header('user-agent') ?? null,
    });
  }

  private buildModelMetadata(
    model: AIModelConfigResponse,
    apiKeyHint?: string,
  ): Record<string, string | boolean | number | null> {
    return {
      displayName: model.displayName,
      provider: model.provider,
      baseUrl: model.baseUrl,
      model: model.model,
      apiKeyHint: apiKeyHint ?? model.apiKeyHint,
      isDefault: model.isDefault,
      isEnabled: model.isEnabled,
    };
  }
}
