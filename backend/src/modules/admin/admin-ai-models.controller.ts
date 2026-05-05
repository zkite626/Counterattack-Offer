import {
  Body,
  Controller,
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
import { RequireRoles } from '../auth/decorators/require-roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import type { RequestWithContext } from '../../common/types/request-context.type';
import type {
  AIModelConfigResponse,
  ModelTestResponse,
  SaveAIModelDto,
  UpdateAIModelDto,
} from '../model-config/dto/model-config.dto';
import { ModelConfigService } from '../model-config/model-config.service';

@Controller('admin/ai/models')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin')
export class AdminAIModelsController {
  constructor(
    private readonly modelConfigService: ModelConfigService,
    private readonly auditService: AuditService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Get()
  async listGlobalModels(): Promise<{ models: AIModelConfigResponse[] }> {
    try {
      return await this.modelConfigService.listGlobalModels();
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createGlobalModel(
    @Body() dto: SaveAIModelDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      const model = await this.modelConfigService.createGlobalModel(
        user.id,
        dto,
      );

      await this.recordAudit(user, request, 'admin.ai_model.create', model, dto);

      return { model };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateGlobalModel(
    @Param('id') id: string,
    @Body() dto: UpdateAIModelDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      const model = await this.modelConfigService.updateGlobalModel(id, dto);

      await this.recordAudit(user, request, 'admin.ai_model.update', model, dto);

      return { model };
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/set-default')
  async setGlobalDefault(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      const model = await this.modelConfigService.setGlobalDefault(id);

      await this.recordAudit(
        user,
        request,
        'admin.ai_model.set_default',
        model,
      );

      return { model };
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/test')
  async testGlobalModel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<ModelTestResponse> {
    try {
      await this.rateLimitService.consumeModelTest(user.id);
      const result = await this.modelConfigService.testGlobalModel(user.id, id);

      await this.auditService.record({
        actorUserId: user.id,
        action: 'admin.ai_model.test',
        targetType: 'ai_model_configs',
        targetId: id,
        metadata: {
          status: result.success ? 'success' : 'failed',
          latencyMs: result.latencyMs,
          errorCode: result.errorCode ?? null,
        },
        ipAddress: request.ip ?? null,
        userAgent: request.header('user-agent') ?? null,
      });

      return result;
    } catch (error) {
      await this.auditService.record({
        actorUserId: user.id,
        action: 'admin.ai_model.test',
        targetType: 'ai_model_configs',
        targetId: id,
        metadata: { status: 'failed' },
        ipAddress: request.ip ?? null,
        userAgent: request.header('user-agent') ?? null,
      });

      throw error;
    }
  }

  private async recordAudit(
    user: AuthenticatedUser,
    request: RequestWithContext,
    action: string,
    model: AIModelConfigResponse,
    dto?: SaveAIModelDto | UpdateAIModelDto,
  ): Promise<void> {
    await this.auditService.record({
      actorUserId: user.id,
      action,
      targetType: 'ai_model_configs',
      targetId: model.id,
      metadata: {
        displayName: model.displayName,
        provider: model.provider,
        baseUrl: model.baseUrl,
        model: model.model,
        apiKeyHint: model.apiKeyHint,
        apiKeyUpdated:
          dto === undefined
            ? false
            : typeof dto.apiKey === 'string' && dto.apiKey.trim().length > 0,
        isDefault: model.isDefault,
        isEnabled: model.isEnabled,
      },
      ipAddress: request.ip ?? null,
      userAgent: request.header('user-agent') ?? null,
    });
  }
}
