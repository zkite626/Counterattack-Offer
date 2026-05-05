import { BadRequestException, Body, ConflictException, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AICallStatus, MailStatus, Prisma, User, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthService } from '../auth/auth.service';
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

interface CreateAdminUserDto {
  email?: unknown;
  name?: unknown;
  password?: unknown;
  role?: unknown;
  status?: unknown;
}

interface ResetAdminUserPasswordDto {
  password?: unknown;
}

interface CreateAdminUserResponse {
  user: AdminUserResponse;
  message: string;
  verificationEmailSent: boolean;
}

interface DeleteAdminUserResponse {
  message: string;
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
  smtpSuccessRate: number;
  mailSuccessRate: number;
  loginFailureCount: number;
  apiErrorCodeDistribution: Array<{ errorCode: string; count: number }>;
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
    private readonly authService: AuthService,
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

  @Post('users')
  async createUser(
    @Body() dto: CreateAdminUserDto,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<CreateAdminUserResponse> {
    const email = this.readEmail(dto.email);
    const name = this.readName(dto.name);
    const password = this.readPassword(dto.password);
    const role = this.readCreateUserRole(dto.role);
    const status = this.readCreateUserStatus(dto.status);
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser !== null) {
      throw new ConflictException({
        code: 'AUTH_EMAIL_ALREADY_REGISTERED',
        message: '该邮箱已注册',
      });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        status,
        emailVerifiedAt: status === UserStatus.ACTIVE ? new Date() : null,
      },
    });

    await this.recordUserAudit(
      actor,
      request,
      'admin.user.create',
      user,
      null,
    );

    let verificationEmailSent = false;
    if (status === UserStatus.PENDING_EMAIL) {
      try {
        await this.authService.resendVerification(user.id);
        verificationEmailSent = true;
      } catch {
        verificationEmailSent = false;
      }
    }

    return {
      user: { ...this.toPublicUser(user), aiCallsToday: 0, aiCallsTotal: 0 },
      message: verificationEmailSent
        ? '用户已创建，验证邮件已发送'
        : '用户已创建',
      verificationEmailSent,
    };
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ user: AdminUserResponse }> {
    const previousUser = await this.findUserOrThrow(id);
    const data: Prisma.UserUpdateInput = {};
    let nextRole = previousUser.role;
    let nextStatus = previousUser.status;
    if (typeof dto.name === 'string' && dto.name.trim().length > 0) {
      data.name = dto.name.trim();
    }
    if (this.isUserRole(dto.role)) {
      data.role = roleToPrisma[dto.role];
      nextRole = roleToPrisma[dto.role];
    }
    if (this.isUserStatus(dto.status)) {
      data.status = statusToPrisma[dto.status];
      nextStatus = statusToPrisma[dto.status];
    }

    await this.ensureAdminSafety(previousUser, nextRole, nextStatus);

    const user = await this.prismaService.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({ where: { id }, data });

      if (
        previousUser.status !== UserStatus.DELETED &&
        nextStatus === UserStatus.DELETED
      ) {
        await this.revokeUserCredentials(tx, id);
      }

      return updatedUser;
    });
    await this.recordUserAudit(
      actor,
      request,
      'admin.user.update',
      user,
      previousUser,
    );
    return { user: { ...this.toPublicUser(user), aiCallsToday: 0, aiCallsTotal: 0 } };
  }

  @Post('users/:id/disable')
  async disableUser(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ message: string }> {
    const previousUser = await this.findUserOrThrow(id);
    await this.ensureAdminSafety(previousUser, previousUser.role, UserStatus.DISABLED);
    const user = await this.prismaService.user.update({
      where: { id },
      data: { status: UserStatus.DISABLED },
    });
    await this.recordUserAudit(
      actor,
      request,
      'admin.user.disable',
      user,
      previousUser,
    );
    return { message: '用户已禁用' };
  }

  @Post('users/:id/enable')
  async enableUser(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ message: string }> {
    const previousUser = await this.findUserOrThrow(id);
    const user = await this.prismaService.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
    });
    await this.recordUserAudit(
      actor,
      request,
      'admin.user.enable',
      user,
      previousUser,
    );
    return { message: '用户已启用' };
  }

  @Delete('users/:id')
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<DeleteAdminUserResponse> {
    const previousUser = await this.findUserOrThrow(id);
    if (previousUser.id === actor.id) {
      throw new ForbiddenException({
        code: 'ADMIN_CANNOT_DELETE_SELF',
        message: '不能删除当前登录的管理员账号',
      });
    }

    if (previousUser.status === UserStatus.DELETED) {
      return { message: '用户已删除' };
    }

    await this.ensureAdminSafety(previousUser, previousUser.role, UserStatus.DELETED);

    const user = await this.prismaService.$transaction(async (tx) => {
      const deletedUser = await tx.user.update({
        where: { id },
        data: { status: UserStatus.DELETED },
      });
      await this.revokeUserCredentials(tx, id);
      return deletedUser;
    });

    await this.recordUserAudit(
      actor,
      request,
      'admin.user.delete',
      user,
      previousUser,
    );

    return { message: '用户已删除，旧会话已失效' };
  }

  @Post('users/:id/reset-password')
  async resetUserPassword(
    @Param('id') id: string,
    @Body() dto: ResetAdminUserPasswordDto,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ message: string }> {
    const password = this.readPassword(dto.password);
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const user = await this.prismaService.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id },
        data: { passwordHash },
      });
      await tx.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await tx.passwordResetToken.updateMany({
        where: { userId: id, usedAt: null },
        data: { usedAt: new Date() },
      });

      return updatedUser;
    });

    await this.auditService.record({
      actorUserId: actor.id,
      action: 'admin.user.password_reset',
      targetType: 'users',
      targetId: user.id,
      metadata: {
        email: user.email,
        passwordUpdated: true,
      },
      ipAddress: request.ip ?? null,
      userAgent: request.header('user-agent') ?? null,
    });

    return { message: '用户密码已重置，旧会话已失效' };
  }

  @Post('users/:id/resend-verification')
  async resendUserVerification(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ message: string }> {
    const result = await this.authService.resendVerification(id);
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { email: true },
    });

    await this.auditService.record({
      actorUserId: actor.id,
      action: 'admin.user.resend_verification',
      targetType: 'users',
      targetId: id,
      metadata: {
        email: user?.email ?? null,
      },
      ipAddress: request.ip ?? null,
      userAgent: request.header('user-agent') ?? null,
    });

    return result;
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
      loginFailureCount,
      apiErrorCodeDistribution,
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
      this.prismaService.apiErrorLog.count({
        where: {
          createdAt: { gte: today },
          path: { contains: '/auth/login' },
          statusCode: { gte: 400 },
        },
      }),
      this.prismaService.apiErrorLog.groupBy({
        by: ['errorCode'],
        where: { createdAt: { gte: today } },
        _count: { _all: true },
      }),
    ]);
    const smtpSuccessRate = mailTotal === 0 ? 0 : mailSent / mailTotal;

    return {
      todayRegistrations,
      emailVerificationRate: totalUsers === 0 ? 0 : verifiedUsers / totalUsers,
      todayAiCalls,
      aiSuccessRate: todayAiCalls === 0 ? 0 : successfulAiCalls / todayAiCalls,
      aiLatencyP50: this.percentile(aiLatencies.map((item) => item.latencyMs), 0.5),
      aiLatencyP95: this.percentile(aiLatencies.map((item) => item.latencyMs), 0.95),
      estimatedModelCost: 0,
      smtpSuccessRate,
      mailSuccessRate: smtpSuccessRate,
      loginFailureCount,
      apiErrorCodeDistribution: apiErrorCodeDistribution
        .map((item) => ({
          errorCode: item.errorCode,
          count: item._count._all,
        }))
        .sort((left, right) => right.count - left.count)
        .slice(0, 8),
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

  private async revokeUserCredentials(
    tx: Prisma.TransactionClient,
    userId: string,
  ): Promise<void> {
    const now = new Date();
    await tx.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: now },
    });
    await tx.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: now },
    });
    await tx.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: now },
    });
  }

  private async ensureAdminSafety(
    targetUser: User,
    nextRole: UserRole,
    nextStatus: UserStatus,
  ): Promise<void> {
    if (targetUser.role !== UserRole.ADMIN) return;

    const willRemainUsableAdmin =
      nextRole === UserRole.ADMIN &&
      nextStatus !== UserStatus.DISABLED &&
      nextStatus !== UserStatus.DELETED;

    if (willRemainUsableAdmin) return;

    const remainingAdmins = await this.prismaService.user.count({
      where: {
        id: { not: targetUser.id },
        role: UserRole.ADMIN,
        status: { in: [UserStatus.ACTIVE, UserStatus.PENDING_EMAIL] },
      },
    });

    if (remainingAdmins === 0) {
      throw new BadRequestException({
        code: 'ADMIN_LAST_ACCOUNT',
        message: '至少保留一个可用管理员',
      });
    }
  }

  private async findUserOrThrow(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (user === null) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: '用户不存在',
      });
    }

    return user;
  }

  private isUserRole(value: unknown): value is PublicUser['role'] {
    return value === 'student' || value === 'admin';
  }

  private isUserStatus(value: unknown): value is PublicUser['status'] {
    return value === 'active' || value === 'pending_email' || value === 'disabled' || value === 'deleted';
  }

  private readCreateUserRole(value: unknown): UserRole {
    if (this.isUserRole(value)) {
      return roleToPrisma[value];
    }

    return UserRole.STUDENT;
  }

  private readCreateUserStatus(value: unknown): UserStatus {
    if (
      value === 'active' ||
      value === 'pending_email' ||
      value === 'disabled'
    ) {
      return statusToPrisma[value];
    }

    return UserStatus.PENDING_EMAIL;
  }

  private readEmail(value: unknown): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '参数校验失败',
        details: { email: ['邮箱不能为空'] },
      });
    }

    const email = value.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length > 255 || !emailPattern.test(email)) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '参数校验失败',
        details: { email: ['邮箱格式不正确'] },
      });
    }

    return email;
  }

  private readName(value: unknown): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '参数校验失败',
        details: { name: ['姓名不能为空'] },
      });
    }

    const name = value.trim();

    if (name.length > 100) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '参数校验失败',
        details: { name: ['姓名不能超过 100 个字符'] },
      });
    }

    return name;
  }

  private readPassword(value: unknown): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '参数校验失败',
        details: { password: ['密码不能为空'] },
      });
    }

    const password = value.trim();

    if (password.length < 8) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '参数校验失败',
        details: { password: ['密码至少需要 8 位'] },
      });
    }

    return password;
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
    previousUser: User | null = null,
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
        previousRole:
          previousUser === null ? null : userRoleMap[previousUser.role],
        previousStatus:
          previousUser === null ? null : userStatusMap[previousUser.status],
      },
      ipAddress: request.ip ?? null,
      userAgent: request.header('user-agent') ?? null,
    });
  }
}
