import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
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
  constructor(private readonly modelConfigService: ModelConfigService) {}

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
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      return {
        model: await this.modelConfigService.createUserModel(user.id, dto),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateModel(
    @Param('id') id: string,
    @Body() dto: UpdateAIModelDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      return {
        model: await this.modelConfigService.updateUserModel(user.id, id, dto),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteModel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    try {
      return await this.modelConfigService.deleteUserModel(user.id, id);
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
      return await this.modelConfigService.testUserModel(user.id, id);
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/set-default')
  async setDefault(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ model: AIModelConfigResponse }> {
    try {
      return {
        model: await this.modelConfigService.setUserDefault(user.id, id),
      };
    } catch (error) {
      throw error;
    }
  }
}
