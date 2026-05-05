import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
    } catch (error) {
      throw error;
    }
  }

  async checkConnection(): Promise<'ok'> {
    try {
      await this.$queryRaw`SELECT 1`;
      return 'ok';
    } catch (error) {
      throw error;
    }
  }
}
