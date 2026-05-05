import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AICallStatus, MailStatus, Prisma, User, UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireRoles } from '../auth/decorators/require-roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser, PublicUser } from '../auth/auth.types';
import type { RequestWithContext } from '../../common/types/request-context.type';

interface AdminUserResponse extends PublicUser {
  aiCallsToday: number;
  aiCallsTotal: number;
}

interface AdminListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface UpdateAdminUserDto {
  name?: unknown;
  role?: unknown;
  status?: unknown;
}

interface AuditLogResponse {
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: Prisma.JsonValue;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface AdminStatsResponse {
  todayRegistrations: number;
  emailVerificationRate: number;
  todayAiCalls: number;
  aiSuccessRate: number;
  aiLatencyP50: number;
  aiLatencyP95: number;
  estimatedModelCost: number;
  mailSuccessRate: number;
}

const userRoleMap: Record<UserRole, PublicUser['role']> = {
  [UserRole.STUDENT]: 'student',
  [UserRole.ADMIN]: 'admin',
};

const userStatusMap: Record<UserStatus, PublicUser['status']> = {
  [UserStatus.ACTIVE]: 'active',
  [UserStatus.PENDING_EMAIL]: 'pending_email',
  [UserStatus.DISABLED]: 'disabled',
  [UserStatus.DELETED]: 'deleted',
};

const roleToPrisma: Record<PublicUser['role'], UserRole> = {
  student: UserRole.STUDENT,
  admin: UserRole.ADMIN,
};

const statusToPrisma: Record<PublicUser['status'], UserStatus> = {
  active: UserStatus.ACTIVE,
  pending_email: UserStatus.PENDING_EMAIL,
  disabled: UserStatus.DISABLED,
  deleted: UserStatus.DELETED,
};

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin')
export class AdminOpsController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  @Get('users')
  async listUsers(
    @Query('page') pageQuery?: string,
    @Query('pageSize') pageSizeQuery?: string,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
  ): Promise<AdminListResponse<AdminUserResponse>> {
    const page = this.readPositiveInt(pageQuery, 1);
    const pageSize = Math.min(this.readPositiveInt(pageSizeQuery, 20), 100);
    const where: Prisma.UserWhereInput = {};

    if (this.isUserStatus(status)) {
      where.status = statusToPrisma[status];
    }
    if (keyword && keyword.trim().length > 0) {
      where.OR = [
        { email: { contains: keyword.trim(), mode: 'insensitive' } },
        { name: { contains: keyword.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    const today = this.startOfToday();
    const userIds = users.map((user) => user.id);
    const [todayCalls, totalCalls] = await Promise.all([
      this.groupAiCalls(userIds, today),
      this.groupAiCalls(userIds),
    ]);

    return {
      items: users.map((user) => ({
        ...this.toPublicUser(user),
        aiCallsToday: todayCalls.get(user.id) ?? 0,
        aiCallsTotal: totalCalls.get(user.id) ?? 0,
      })),
      total,
      page,
      pageSize,
    };
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ user: AdminUserResponse }> {
    const data: Prisma.UserUpdateInput = {};
    if (typeof dto.name === 'string' && dto.name.trim().length > 0) {
      data.name = dto.name.trim();
    }
    if (this.isUserRole(dto.role)) {
      data.role = roleToPrisma[dto.role];
    }
    if (this.isUserStatus(dto.status)) {
      data.status = statusToPrisma[dto.status];
    }

    const user = await this.prismaService.user.update({ where: { id }, data });
    await this.recordUserAudit(actor, request, 'admin.user.update', user);
    return { user: { ...this.toPublicUser(user), aiCallsToday: 0, aiCallsTotal: 0 } };
  }

  @Post('users/:id/disable')
  async disableUser(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ message: string }> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: { status: UserStatus.DISABLED },
    });
    await this.recordUserAudit(actor, request, 'admin.user.disable', user);
    return { message: '用户已禁用' };
  }

  @Post('users/:id/enable')
  async enableUser(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ message: string }> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
    });
    await this.recordUserAudit(actor, request, 'admin.user.enable', user);
    return { message: '用户已启用' };
  }

  @Get('audit-logs')
  async listAuditLogs(
    @Query('page') pageQuery?: string,
    @Query('pageSize') pageSizeQuery?: string,
  ): Promise<AdminListResponse<AuditLogResponse>> {
    const page = this.readPositiveInt(pageQuery, 1);
    const pageSize = Math.min(this.readPositiveInt(pageSizeQuery, 20), 100);
    const [total, logs] = await Promise.all([
      this.prismaService.auditLog.count(),
      this.prismaService.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: logs.map((log) => ({
        id: log.id,
        actorUserId: log.actorUserId,
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        metadata: log.metadata,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }

  @Get('stats')
  async getStats(): Promise<AdminStatsResponse> {
    const today = this.startOfToday();
    const [
      todayRegistrations,
      totalUsers,
      verifiedUsers,
      todayAiCalls,
      successfulAiCalls,
      aiLatencies,
      mailTotal,
      mailSent,
    ] = await Promise.all([
      this.prismaService.user.count({ where: { createdAt: { gte: today } } }),
      this.prismaService.user.count(),
      this.prismaService.user.count({ where: { emailVerifiedAt: { not: null } } }),
      this.prismaService.aICallLog.count({ where: { createdAt: { gte: today } } }),
      this.prismaService.aICallLog.count({ where: { createdAt: { gte: today }, status: AICallStatus.SUCCESS } }),
      this.prismaService.aICallLog.findMany({
        where: { createdAt: { gte: today } },
        select: { latencyMs: true },
        orderBy: { latencyMs: 'asc' },
      }),
      this.prismaService.mailEvent.count({ where: { createdAt: { gte: today } } }),
      this.prismaService.mailEvent.count({ where: { createdAt: { gte: today }, status: MailStatus.SENT } }),
    ]);

    return {
      todayRegistrations,
      emailVerificationRate: totalUsers === 0 ? 0 : verifiedUsers / totalUsers,
      todayAiCalls,
      aiSuccessRate: todayAiCalls === 0 ? 0 : successfulAiCalls / todayAiCalls,
      aiLatencyP50: this.percentile(aiLatencies.map((item) => item.latencyMs), 0.5),
      aiLatencyP95: this.percentile(aiLatencies.map((item) => item.latencyMs), 0.95),
      estimatedModelCost: 0,
      mailSuccessRate: mailTotal === 0 ? 0 : mailSent / mailTotal,
    };
  }

  private readPositiveInt(value: string | undefined, fallback: number): number {
    const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  private startOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private percentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const index = Math.min(values.length - 1, Math.floor((values.length - 1) * percentile));
    return values[index];
  }

  private async groupAiCalls(userIds: string[], since?: Date): Promise<Map<string, number>> {
    if (userIds.length === 0) return new Map();
    const groups = await this.prismaService.aICallLog.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        createdAt: since ? { gte: since } : undefined,
      },
      _count: { _all: true },
    });
    return new Map(groups.map((group) => [group.userId, group._count._all]));
  }

  private isUserRole(value: unknown): value is PublicUser['role'] {
    return value === 'student' || value === 'admin';
  }

  private isUserStatus(value: unknown): value is PublicUser['status'] {
    return value === 'active' || value === 'pending_email' || value === 'disabled' || value === 'deleted';
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: userRoleMap[user.role],
      status: userStatusMap[user.status],
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private async recordUserAudit(
    actor: AuthenticatedUser,
    request: RequestWithContext,
    action: string,
    user: User,
  ): Promise<void> {
    await this.auditService.record({
      actorUserId: actor.id,
      action,
      targetType: 'users',
      targetId: user.id,
      metadata: {
        email: user.email,
        role: userRoleMap[user.role],
        status: userStatusMap[user.status],
      },
      ipAddress: request.ip ?? null,
      userAgent: request.header('user-agent') ?? null,
    });
  }
}
