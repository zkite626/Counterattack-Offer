import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface HealthStatus {
  status: 'ok';
  database: 'ok';
  uptime: number;
}

@Injectable()
export class HealthService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHealth(): Promise<HealthStatus> {
    try {
      const database = await this.prismaService.checkConnection();

      return {
        status: 'ok',
        database,
        uptime: Math.floor(process.uptime()),
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        code: 'DATABASE_UNAVAILABLE',
        message: '数据库连接不可用',
      });
    }
  }
}
