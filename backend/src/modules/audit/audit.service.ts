import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SecretService } from '../../common/security/secret.service';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditLogInput {
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Prisma.InputJsonObject;
  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly secretService: SecretService,
  ) {}

  async record(input: AuditLogInput): Promise<void> {
    try {
      const safeMetadata = this.secretService.redactUnknown(
        input.metadata ?? {},
      );
      await this.prismaService.auditLog.create({
        data: {
          actorUserId: input.actorUserId,
          action: input.action,
          targetType: input.targetType,
          targetId: input.targetId ?? null,
          metadata: safeMetadata as Prisma.InputJsonObject,
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
        },
      });
    } catch (error) {
      this.logger.warn(
        JSON.stringify({
          action: input.action,
          targetType: input.targetType,
          targetId: input.targetId ?? null,
          auditWriteFailed: true,
        }),
      );
    }
  }
}
