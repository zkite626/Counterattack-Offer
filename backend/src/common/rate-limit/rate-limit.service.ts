import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import type { RequestWithContext } from '../types/request-context.type';

interface RateLimitPolicy {
  name: string;
  limit: number;
  windowMs: number;
  subject: string;
}

interface RateLimitBucketRow {
  count: number;
  reset_at: Date;
}

@Injectable()
export class RateLimitService {
  constructor(private readonly prismaService: PrismaService) {}

  async consumeLogin(request: RequestWithContext, email: unknown): Promise<void> {
    await this.consumeMany([
      {
        name: 'auth.login',
        limit: 5,
        windowMs: 60 * 1000,
        subject: `ip:${this.ipSubject(request)}`,
      },
      {
        name: 'auth.login',
        limit: 5,
        windowMs: 60 * 1000,
        subject: `email:${this.emailSubject(email)}`,
      },
    ]);
  }

  async consumeRegister(request: RequestWithContext): Promise<void> {
    await this.consume({
      name: 'auth.register',
      limit: 3,
      windowMs: 60 * 60 * 1000,
      subject: this.ipSubject(request),
    });
  }

  async consumeForgotPassword(email: unknown): Promise<void> {
    await this.consume({
      name: 'auth.forgot_password',
      limit: 3,
      windowMs: 60 * 60 * 1000,
      subject: this.emailSubject(email),
    });
  }

  async consumeResendVerification(userId: string): Promise<void> {
    await this.consume({
      name: 'mail.resend_verification',
      limit: 3,
      windowMs: 60 * 60 * 1000,
      subject: userId,
    });
  }

  async consumeModelTest(userId: string): Promise<void> {
    await this.consume({
      name: 'ai.model_test',
      limit: 10,
      windowMs: 60 * 60 * 1000,
      subject: userId,
    });
  }

  async consumeAiCall(userId: string): Promise<void> {
    await this.consume({
      name: 'ai.call',
      limit: 60,
      windowMs: 60 * 60 * 1000,
      subject: userId,
    });
  }

  async consumeSmtpTest(userId: string): Promise<void> {
    await this.consume({
      name: 'mail.smtp_test',
      limit: 10,
      windowMs: 60 * 60 * 1000,
      subject: userId,
    });
  }

  private async consume(policy: RateLimitPolicy): Promise<void> {
    await this.consumeWithinClient(this.prismaService, policy);
  }

  private async consumeMany(policies: RateLimitPolicy[]): Promise<void> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        for (const policy of policies) {
          await this.consumeWithinClient(tx, policy);
        }
      });
    } catch (error) {
      throw error;
    }
  }

  private async consumeWithinClient(
    client: PrismaService | Prisma.TransactionClient,
    policy: RateLimitPolicy,
  ): Promise<void> {
    try {
      const key = this.bucketKey(policy.name, policy.subject);
      const resetAt = new Date(Date.now() + policy.windowMs);
      const rows = await client.$queryRaw<RateLimitBucketRow[]>`
        INSERT INTO "rate_limit_buckets" ("key", "count", "reset_at", "updated_at")
        VALUES (${key}, 1, ${resetAt}, NOW())
        ON CONFLICT ("key") DO UPDATE
        SET
          "count" = CASE
            WHEN "rate_limit_buckets"."reset_at" <= NOW() THEN 1
            ELSE "rate_limit_buckets"."count" + 1
          END,
          "reset_at" = CASE
            WHEN "rate_limit_buckets"."reset_at" <= NOW() THEN EXCLUDED."reset_at"
            ELSE "rate_limit_buckets"."reset_at"
          END,
          "updated_at" = NOW()
        RETURNING "count", "reset_at"
      `;
      const bucket = rows[0];

      if (bucket === undefined) {
        return;
      }

      if (bucket.count > policy.limit) {
        throw this.rateLimitedError(bucket.reset_at);
      }
    } catch (error) {
      throw error;
    }
  }

  private rateLimitedError(resetAt: Date): HttpException {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((resetAt.getTime() - Date.now()) / 1000),
    );

    return new HttpException(
      {
        code: 'RATE_LIMITED',
        message: '请求过于频繁，请稍后重试',
        details: {
          retryAfterSeconds: [String(retryAfterSeconds)],
        },
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  private bucketKey(policyName: string, subject: string): string {
    return `${policyName}:${this.digest(subject)}`;
  }

  private ipSubject(request: RequestWithContext): string {
    const forwardedFor = request.header('x-forwarded-for');
    const forwardedIp = forwardedFor?.split(',')[0]?.trim();
    const realIp = request.header('x-real-ip')?.trim();

    return forwardedIp ?? realIp ?? request.ip ?? 'unknown_ip';
  }

  private emailSubject(value: unknown): string {
    if (typeof value !== 'string') {
      return 'unknown_email';
    }

    const normalized = value.trim().toLowerCase();

    return normalized.length > 0 ? normalized : 'unknown_email';
  }

  private digest(value: string): string {
    return createHash('sha256').update(value, 'utf8').digest('hex').slice(0, 48);
  }
}
