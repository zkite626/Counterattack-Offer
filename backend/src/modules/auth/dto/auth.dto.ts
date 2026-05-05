import type { AuthClientType, PublicUser } from '../auth.types';

export interface RegisterDto {
  email?: unknown;
  password?: unknown;
  name?: unknown;
}

export interface LoginDto {
  email?: unknown;
  password?: unknown;
  clientType?: unknown;
  deviceName?: unknown;
}

export interface RefreshDto {
  refreshToken?: unknown;
  clientType?: unknown;
  deviceName?: unknown;
}

export interface VerifyEmailDto {
  token?: unknown;
}

export interface ForgotPasswordDto {
  email?: unknown;
}

export interface ResetPasswordDto {
  token?: unknown;
  newPassword?: unknown;
}

export interface RegisterResponse {
  user: PublicUser;
  requiresEmailVerification: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: PublicUser;
  refreshToken?: string;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}

export interface MessageResponse {
  message: string;
}

export interface ValidatedRegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface ValidatedLoginInput {
  email: string;
  password: string;
  clientType: AuthClientType;
  deviceName: string | null;
}

export interface ValidatedRefreshInput {
  refreshToken: string;
  clientType: AuthClientType;
  deviceName: string | null;
}
