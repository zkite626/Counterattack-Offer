import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientType, Prisma, User, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { jwtVerify, SignJWT } from 'jose';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import type { AppEnvironment } from '../../config/environment';
import { MailService } from '../mail/mail.service';
import type {
  ForgotPasswordDto,
  LoginDto,
  LoginResponse,
  MessageResponse,
  RefreshDto,
  RefreshResponse,
  RegisterDto,
  RegisterResponse,
  ResetPasswordDto,
  ValidatedLoginInput,
  ValidatedRefreshInput,
  ValidatedRegisterInput,
  VerifyEmailDto,
} from './dto/auth.dto';
import type {
  AuthClientType,
  AuthenticatedUser,
  AuthTokenPair,
  PublicUser,
  TokenRequestContext,
} from './auth.types';

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

@Injectable()
export class AuthService {
  private readonly accessSecret: Uint8Array;
  private readonly accessExpiresIn: number;
  private readonly refreshExpiresInDays: number;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    configService: ConfigService<AppEnvironment, true>,
  ) {
    this.accessSecret = new TextEncoder().encode(
      configService.get('JWT_ACCESS_SECRET', { infer: true }),
    );
    this.accessExpiresIn = configService.get('ACCESS_TOKEN_TTL_SECONDS', {
      infer: true,
    });
    this.refreshExpiresInDays = configService.get('REFRESH_TOKEN_TTL_DAYS', {
      infer: true,
    });
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    try {
      const input = this.validateRegisterDto(dto);
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: input.email },
        select: { id: true },
      });

      if (existingUser !== null) {
        throw new ConflictException({
          code: 'AUTH_EMAIL_ALREADY_REGISTERED',
          message: '该邮箱已注册',
        });
      }

      const passwordHash = await argon2.hash(input.password, {
        type: argon2.argon2id,
      });
      const user = await this.prismaService.user.create({
        data: {
          email: input.email,
          passwordHash,
          name: input.name,
          status: UserStatus.PENDING_EMAIL,
          role: UserRole.STUDENT,
        },
      });
      const rawToken = await this.createEmailVerificationToken(user);

      await this.sendVerificationEmailSafely(user, rawToken);

      return {
        user: this.toPublicUser(user),
        requiresEmailVerification: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(
    dto: LoginDto,
    context: TokenRequestContext,
  ): Promise<
    LoginResponse & { refreshToken: string; clientType: AuthClientType }
  > {
    try {
      const input = this.validateLoginDto(dto);
      const user = await this.prismaService.user.findUnique({
        where: { email: input.email },
      });

      if (user === null) {
        throw this.invalidCredentialsError();
      }

      if (
        user.status === UserStatus.DISABLED ||
        user.status === UserStatus.DELETED
      ) {
        throw new ForbiddenException({
          code: 'USER_DISABLED',
          message: '账号不可用，请联系管理员',
        });
      }

      const passwordMatched = await argon2.verify(
        user.passwordHash,
        input.password,
      );

      if (!passwordMatched) {
        throw this.invalidCredentialsError();
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
      const tokenPair = await this.issueSession(
        updatedUser,
        input.clientType,
        input.deviceName,
        context,
      );

      return {
        accessToken: tokenPair.accessToken,
        expiresIn: this.accessExpiresIn,
        refreshToken: tokenPair.refreshToken,
        user: this.toPublicUser(updatedUser),
        clientType: input.clientType,
      };
    } catch (error) {
      throw error;
    }
  }

  async refresh(
    dto: RefreshDto,
    context: TokenRequestContext,
  ): Promise<
    RefreshResponse & { refreshToken: string; clientType: AuthClientType }
  > {
    try {
      const input = this.validateRefreshDto(dto);
      const tokenHash = this.hashToken(input.refreshToken);
      const existingToken = await this.prismaService.refreshToken.findFirst({
        where: {
          tokenHash,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (existingToken === null) {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_INVALID',
          message: 'Refresh Token 无效',
        });
      }

      if (
        existingToken.user.status === UserStatus.DISABLED ||
        existingToken.user.status === UserStatus.DELETED
      ) {
        throw new ForbiddenException({
          code: 'USER_DISABLED',
          message: '账号不可用，请联系管理员',
        });
      }

      const tokenPair = await this.prismaService.$transaction(async (tx) => {
        await tx.refreshToken.update({
          where: { id: existingToken.id },
          data: { revokedAt: new Date() },
        });

        return this.issueSessionWithClient(
          tx,
          existingToken.user,
          input.clientType,
          input.deviceName,
          context,
        );
      });

      return {
        accessToken: tokenPair.accessToken,
        expiresIn: this.accessExpiresIn,
        refreshToken: tokenPair.refreshToken,
        clientType: input.clientType,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(refreshToken: string | null): Promise<MessageResponse> {
    try {
      if (refreshToken !== null) {
        await this.prismaService.refreshToken.updateMany({
          where: {
            tokenHash: this.hashToken(refreshToken),
            revokedAt: null,
          },
          data: { revokedAt: new Date() },
        });
      }

      return { message: '已退出登录' };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (user === null) {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_INVALID',
          message: '当前用户不存在',
        });
      }

      return this.toPublicUser(user);
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<MessageResponse> {
    try {
      const token = this.readRequiredString(dto.token, 'token');
      const tokenHash = this.hashToken(token);
      const existingToken =
        await this.prismaService.emailVerificationToken.findFirst({
          where: {
            tokenHash,
            usedAt: null,
            expiresAt: { gt: new Date() },
          },
          include: { user: true },
        });

      if (existingToken === null) {
        throw new BadRequestException({
          code: 'AUTH_TOKEN_INVALID',
          message: '邮箱验证链接无效或已过期',
        });
      }

      const verifiedUser = await this.prismaService.$transaction(async (tx) => {
        await tx.emailVerificationToken.update({
          where: { id: existingToken.id },
          data: { usedAt: new Date() },
        });

        return tx.user.update({
          where: { id: existingToken.userId },
          data: {
            emailVerifiedAt: new Date(),
            status: UserStatus.ACTIVE,
          },
        });
      });

      await this.sendWelcomeEmailSafely(verifiedUser);

      return { message: '邮箱验证成功' };
    } catch (error) {
      throw error;
    }
  }

  async resendVerification(userId: string): Promise<MessageResponse> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (user === null) {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_INVALID',
          message: '当前用户不存在',
        });
      }

      if (user.emailVerifiedAt !== null) {
        return { message: '邮箱已完成验证' };
      }

      const rawToken = await this.createEmailVerificationToken(user);
      await this.mailService.sendVerificationEmail(user, rawToken);

      return { message: '验证邮件已发送' };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponse> {
    try {
      const email = this.normalizeEmail(
        this.readRequiredString(dto.email, 'email'),
      );

      this.assertEmail(email);

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (
        user !== null &&
        user.status !== UserStatus.DELETED &&
        user.status !== UserStatus.DISABLED
      ) {
        const rawToken = await this.createPasswordResetToken(user);
        await this.sendPasswordResetEmailSafely(user, rawToken);
      }

      return { message: '如果邮箱存在，重置邮件将发送到该邮箱' };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
    try {
      const token = this.readRequiredString(dto.token, 'token');
      const newPassword = this.readRequiredString(
        dto.newPassword,
        'newPassword',
      );

      this.assertPassword(newPassword);

      const tokenHash = this.hashToken(token);
      const existingToken =
        await this.prismaService.passwordResetToken.findFirst({
          where: {
            tokenHash,
            usedAt: null,
            expiresAt: { gt: new Date() },
          },
          include: { user: true },
        });

      if (existingToken === null) {
        throw new BadRequestException({
          code: 'AUTH_TOKEN_INVALID',
          message: '密码重置链接无效或已过期',
        });
      }

      const passwordHash = await argon2.hash(newPassword, {
        type: argon2.argon2id,
      });
      const updatedUser = await this.prismaService.$transaction(async (tx) => {
        await tx.passwordResetToken.update({
          where: { id: existingToken.id },
          data: { usedAt: new Date() },
        });
        await tx.refreshToken.updateMany({
          where: { userId: existingToken.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });

        return tx.user.update({
          where: { id: existingToken.userId },
          data: { passwordHash },
        });
      });

      await this.sendPasswordChangedEmailSafely(updatedUser);

      return { message: '密码已重置，请重新登录' };
    } catch (error) {
      throw error;
    }
  }

  async verifyAccessToken(accessToken: string): Promise<AuthenticatedUser> {
    try {
      const result = await jwtVerify(accessToken, this.accessSecret);
      const userId = result.payload.sub;

      if (userId === undefined || result.payload.typ !== 'access') {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_INVALID',
          message: 'Access Token 无效',
        });
      }

      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (user === null) {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_INVALID',
          message: '当前用户不存在',
        });
      }

      if (
        user.status === UserStatus.DISABLED ||
        user.status === UserStatus.DELETED
      ) {
        throw new ForbiddenException({
          code: 'USER_DISABLED',
          message: '账号不可用，请联系管理员',
        });
      }

      return {
        id: user.id,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        name: user.name,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      if (error instanceof Error && error.name === 'JWTExpired') {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_EXPIRED',
          message: 'Access Token 已过期',
        });
      }

      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Access Token 无效',
      });
    }
  }

  extractRefreshTokenFromCookie(
    cookieHeader: string | undefined,
  ): string | null {
    if (cookieHeader === undefined) {
      return null;
    }

    const cookies = cookieHeader.split(';').map((part) => part.trim());
    const refreshCookie = cookies.find((part) =>
      part.startsWith('refresh_token='),
    );

    if (refreshCookie === undefined) {
      return null;
    }

    return decodeURIComponent(refreshCookie.slice('refresh_token='.length));
  }

  toPublicUser(user: User): PublicUser {
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

  private async issueSession(
    user: User,
    clientType: AuthClientType,
    deviceName: string | null,
    context: TokenRequestContext,
  ): Promise<AuthTokenPair> {
    return this.issueSessionWithClient(
      this.prismaService,
      user,
      clientType,
      deviceName,
      context,
    );
  }

  private async issueSessionWithClient(
    prismaClient: Prisma.TransactionClient | PrismaService,
    user: User,
    clientType: AuthClientType,
    deviceName: string | null,
    context: TokenRequestContext,
  ): Promise<AuthTokenPair> {
    const refreshToken = this.generateOpaqueToken();
    const refreshTokenExpiresAt = this.addDays(
      new Date(),
      this.refreshExpiresInDays,
    );

    await prismaClient.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        clientType: this.toClientTypeEnum(clientType),
        deviceName,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      accessToken: await this.signAccessToken(user),
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  private async signAccessToken(user: User): Promise<string> {
    return new SignJWT({
      typ: 'access',
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime(`${this.accessExpiresIn}s`)
      .sign(this.accessSecret);
  }

  private async createEmailVerificationToken(user: User): Promise<string> {
    const rawToken = this.generateOpaqueToken();
    const now = new Date();

    await this.prismaService.emailVerificationToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: now },
    });
    await this.prismaService.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(rawToken),
        email: user.email,
        expiresAt: this.addMinutes(now, 60),
      },
    });

    return rawToken;
  }

  private async createPasswordResetToken(user: User): Promise<string> {
    const rawToken = this.generateOpaqueToken();
    const now = new Date();

    await this.prismaService.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: now },
    });
    await this.prismaService.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(rawToken),
        expiresAt: this.addMinutes(now, 60),
      },
    });

    return rawToken;
  }

  private async sendVerificationEmailSafely(
    user: User,
    rawToken: string,
  ): Promise<void> {
    try {
      await this.mailService.sendVerificationEmail(user, rawToken);
    } catch (error) {
      // 注册主链路不能因为 SMTP 尚未配置而失败，失败详情已进入 mail_events。
    }
  }

  private async sendPasswordResetEmailSafely(
    user: User,
    rawToken: string,
  ): Promise<void> {
    try {
      await this.mailService.sendPasswordResetEmail(user, rawToken);
    } catch (error) {
      // 找回密码接口不能因为邮件失败暴露邮箱是否存在。
    }
  }

  private async sendWelcomeEmailSafely(user: User): Promise<void> {
    try {
      await this.mailService.sendWelcomeEmail(user);
    } catch (error) {
      // 欢迎邮件失败不影响邮箱验证结果。
    }
  }

  private async sendPasswordChangedEmailSafely(user: User): Promise<void> {
    try {
      await this.mailService.sendPasswordChangedEmail(user);
    } catch (error) {
      // 安全提醒失败已进入 mail_events，不回滚已经完成的密码重置。
    }
  }

  private validateRegisterDto(dto: RegisterDto): ValidatedRegisterInput {
    const email = this.normalizeEmail(
      this.readRequiredString(dto.email, 'email'),
    );
    const password = this.readRequiredString(dto.password, 'password');
    const name = this.readRequiredString(dto.name, 'name');

    this.assertEmail(email);
    this.assertPassword(password);

    if (name.length > 100) {
      throw this.validationError('name', '姓名长度不能超过 100 个字符');
    }

    return { email, password, name };
  }

  private validateLoginDto(dto: LoginDto): ValidatedLoginInput {
    const email = this.normalizeEmail(
      this.readRequiredString(dto.email, 'email'),
    );
    const password = this.readRequiredString(dto.password, 'password');

    this.assertEmail(email);

    return {
      email,
      password,
      clientType: this.readClientType(dto.clientType),
      deviceName: this.readOptionalString(dto.deviceName),
    };
  }

  private validateRefreshDto(dto: RefreshDto): ValidatedRefreshInput {
    return {
      refreshToken: this.readRequiredString(dto.refreshToken, 'refreshToken'),
      clientType: this.readClientType(dto.clientType),
      deviceName: this.readOptionalString(dto.deviceName),
    };
  }

  private readClientType(value: unknown): AuthClientType {
    if (value === undefined || value === null || value === 'web') {
      return 'web';
    }

    if (value === 'mobile') {
      return 'mobile';
    }

    throw this.validationError('clientType', 'clientType 必须是 web 或 mobile');
  }

  private toClientTypeEnum(clientType: AuthClientType): ClientType {
    return clientType === 'web' ? ClientType.WEB : ClientType.MOBILE;
  }

  private readRequiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw this.validationError(field, `${field} 不能为空`);
    }

    return value.trim();
  }

  private readOptionalString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed.slice(0, 120) : null;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private assertEmail(email: string): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      throw this.validationError('email', '邮箱格式不正确');
    }
  }

  private assertPassword(password: string): void {
    if (password.length < 8) {
      throw this.validationError('password', '密码至少需要 8 位');
    }
  }

  private validationError(field: string, message: string): BadRequestException {
    return new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: '参数校验失败',
      details: { [field]: [message] },
    });
  }

  private invalidCredentialsError(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'AUTH_INVALID_CREDENTIALS',
      message: '邮箱或密码错误',
    });
  }

  private generateOpaqueToken(): string {
    return randomBytes(32).toString('base64url');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }

  private addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}
