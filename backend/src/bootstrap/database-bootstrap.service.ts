import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import type { AppEnvironment } from '../config/environment';
import { PrismaService } from '../prisma/prisma.service';

interface BootstrapResult {
  initialized: boolean;
  adminEmail?: string;
}

@Injectable()
export class DatabaseBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseBootstrapService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<AppEnvironment, true>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const result = await this.bootstrapIfDatabaseIsEmpty();

      if (result.initialized && result.adminEmail !== undefined) {
        this.logger.log(
          `数据库空库初始化完成，默认管理员已创建：${result.adminEmail}`,
        );
        return;
      }

      this.logger.log('检测到数据库已有内容，跳过初始化');
    } catch (error) {
      this.logger.error(
        '数据库空库初始化失败',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private async bootstrapIfDatabaseIsEmpty(): Promise<BootstrapResult> {
    const usersCount = await this.prismaService.user.count();

    if (usersCount > 0) {
      return { initialized: false };
    }

    const adminEmail = this.requireBootstrapEmail();
    const adminPassword = this.requireBootstrapPassword();
    const bootstrapCompletedAt = new Date();
    const passwordHash = await argon2.hash(adminPassword, {
      type: argon2.argon2id,
    });

    const result = await this.prismaService.$transaction<BootstrapResult>(
      async (tx) => {
        // 使用事务级 advisory lock 避免多实例同时启动时重复初始化。
        // 这里必须用 executeRaw，因为 pg_advisory_xact_lock 返回 void，
        // Prisma 的 queryRaw 会尝试把结果集反序列化成记录。
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(hashtext('counterattack-offer-database-bootstrap'))
        `;

        const currentUsersCount = await tx.user.count();

        if (currentUsersCount > 0) {
          return { initialized: false };
        }

        const adminUser = await tx.user.create({
          data: {
            email: adminEmail,
            passwordHash,
            name: '系统管理员',
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            emailVerifiedAt: bootstrapCompletedAt,
          },
        });

        await tx.appSetting.upsert({
          where: { key: 'system.bootstrap' },
          update: {
            value: this.buildBootstrapSettingValue(
              adminUser.id,
              adminEmail,
              bootstrapCompletedAt,
            ) as Prisma.InputJsonValue,
            updatedBy: adminUser.id,
          },
          create: {
            key: 'system.bootstrap',
            value: this.buildBootstrapSettingValue(
              adminUser.id,
              adminEmail,
              bootstrapCompletedAt,
            ) as Prisma.InputJsonValue,
            isSecret: false,
            updatedBy: adminUser.id,
          },
        });

        await tx.auditLog.create({
          data: {
            actorUserId: adminUser.id,
            action: 'system.admin.bootstrap',
            targetType: 'users',
            targetId: adminUser.id,
            metadata: {
              adminEmail,
              bootstrapCompletedAt: bootstrapCompletedAt.toISOString(),
              bootstrapSource: 'empty_database',
              createdRecords: ['users', 'app_settings', 'audit_logs'],
            },
            ipAddress: null,
            userAgent: null,
          },
        });

        return {
          initialized: true,
          adminEmail,
        };
      },
    );

    return result;
  }

  private buildBootstrapSettingValue(
    adminUserId: string,
    adminEmail: string,
    bootstrapCompletedAt: Date,
  ): Prisma.JsonObject {
    return {
      version: 1,
      adminUserId,
      adminEmail,
      initializedAt: bootstrapCompletedAt.toISOString(),
      source: 'empty_database',
    };
  }

  private requireBootstrapEmail(): string {
    const email = this.configService.get('ADMIN_EMAIL', { infer: true }).trim();

    if (email.length === 0) {
      throw new Error('数据库为空时必须配置 ADMIN_EMAIL 以完成默认管理员初始化');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('ADMIN_EMAIL 格式不正确');
    }

    return email.toLowerCase();
  }

  private requireBootstrapPassword(): string {
    const password = this.configService
      .get('ADMIN_PASSWORD', { infer: true })
      .trim();

    if (password.length === 0) {
      throw new Error('数据库为空时必须配置 ADMIN_PASSWORD 以完成默认管理员初始化');
    }

    if (password.length < 8) {
      throw new Error('ADMIN_PASSWORD 至少需要 8 位');
    }

    return password;
  }
}
