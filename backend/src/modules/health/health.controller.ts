import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFailureResponseDto } from '../../common/dto/api-response.dto';
import { HealthSuccessResponseDto } from '../../common/dto/health-response.dto';
import { HealthService, HealthStatus } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({
    description: '服务和数据库健康状态',
    type: HealthSuccessResponseDto,
  })
  @ApiServiceUnavailableResponse({
    description: '数据库不可用',
    type: ApiFailureResponseDto,
  })
  async getHealth(): Promise<HealthStatus> {
    try {
      return await this.healthService.getHealth();
    } catch (error) {
      throw error;
    }
  }
}
