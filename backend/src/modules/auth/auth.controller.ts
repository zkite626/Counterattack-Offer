import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';
import type { AppEnvironment } from '../../config/environment';
import type { RequestWithContext } from '../../common/types/request-context.type';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
  VerifyEmailDto,
} from './dto/auth.dto';
import type {
  AuthClientType,
  AuthenticatedUser,
  PublicUser,
} from './auth.types';

@Controller('auth')
export class AuthController {
  private readonly nodeEnv: AppEnvironment['NODE_ENV'];
  private readonly refreshTokenTtlDays: number;

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService<AppEnvironment, true>,
  ) {
    this.nodeEnv = configService.get('NODE_ENV', { infer: true });
    this.refreshTokenTtlDays = configService.get('REFRESH_TOKEN_TTL_DAYS', {
      infer: true,
    });
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: RequestWithContext,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    try {
      const result = await this.authService.login(
        dto,
        this.getTokenContext(request),
      );

      if (result.clientType === 'web') {
        this.setRefreshCookie(response, result.refreshToken);

        return {
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
          user: result.user,
        };
      }

      return {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        refreshToken: result.refreshToken,
        user: result.user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Req() request: RequestWithContext,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponse> {
    try {
      const refreshDto = this.mergeRefreshToken(dto, request);
      const result = await this.authService.refresh(
        refreshDto,
        this.getTokenContext(request),
      );

      if (result.clientType === 'web') {
        this.setRefreshCookie(response, result.refreshToken);

        return {
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        };
      }

      return {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        refreshToken: result.refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  async logout(
    @Body() dto: RefreshDto,
    @Req() request: RequestWithContext,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MessageResponse> {
    try {
      const refreshToken = this.readRefreshToken(dto, request);

      this.clearRefreshCookie(response);

      return await this.authService.logout(refreshToken);
    } catch (error) {
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ user: PublicUser }> {
    try {
      return { user: await this.authService.getCurrentUser(user.id) };
    } catch (error) {
      throw error;
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<MessageResponse> {
    try {
      return await this.authService.verifyEmail(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  async resendVerification(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MessageResponse> {
    try {
      return await this.authService.resendVerification(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<MessageResponse> {
    try {
      return await this.authService.forgotPassword(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponse> {
    try {
      return await this.authService.resetPassword(dto);
    } catch (error) {
      throw error;
    }
  }

  private mergeRefreshToken(
    dto: RefreshDto,
    request: RequestWithContext,
  ): RefreshDto {
    const tokenSource = this.readRefreshTokenWithSource(dto, request);
    const clientType =
      dto.clientType ??
      this.readClientTypeHeader(request) ??
      (tokenSource.source === 'cookie' ? 'web' : 'mobile');

    return {
      ...dto,
      clientType,
      refreshToken: tokenSource.token ?? dto.refreshToken,
    };
  }

  private readRefreshToken(
    dto: RefreshDto,
    request: RequestWithContext,
  ): string | null {
    return this.readRefreshTokenWithSource(dto, request).token;
  }

  private readRefreshTokenWithSource(
    dto: RefreshDto,
    request: RequestWithContext,
  ): { token: string | null; source: 'body' | 'bearer' | 'cookie' | 'none' } {
    if (typeof dto.refreshToken === 'string' && dto.refreshToken.length > 0) {
      return { token: dto.refreshToken, source: 'body' };
    }

    const authorization = request.header('authorization');

    if (authorization !== undefined) {
      const [scheme, token] = authorization.split(' ');

      if (scheme === 'Bearer' && token !== undefined && token.length > 0) {
        return { token, source: 'bearer' };
      }
    }

    const cookieToken = this.authService.extractRefreshTokenFromCookie(
      request.header('cookie'),
    );

    return cookieToken === null
      ? { token: null, source: 'none' }
      : { token: cookieToken, source: 'cookie' };
  }

  private readClientTypeHeader(request: Request): AuthClientType | undefined {
    const clientTypeHeader = request.header('x-client-type');

    if (clientTypeHeader === 'mobile') {
      return 'mobile';
    }

    if (clientTypeHeader === 'web') {
      return 'web';
    }

    return undefined;
  }

  private getTokenContext(request: Request): {
    ipAddress: string | null;
    userAgent: string | null;
  } {
    return {
      ipAddress: request.ip ?? null,
      userAgent: request.header('user-agent') ?? null,
    };
  }

  private setRefreshCookie(response: Response, refreshToken: string): void {
    response.cookie('refresh_token', refreshToken, this.refreshCookieOptions());
  }

  private clearRefreshCookie(response: Response): void {
    response.clearCookie('refresh_token', {
      path: '/api/v1/auth',
      sameSite: this.nodeEnv === 'production' ? 'none' : 'lax',
      secure: this.nodeEnv === 'production',
    });
  }

  private refreshCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: this.nodeEnv === 'production' ? 'none' : 'lax',
      path: '/api/v1/auth',
      maxAge: this.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
    };
  }
}
