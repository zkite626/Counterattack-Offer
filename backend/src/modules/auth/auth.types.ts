import type { UserRole, UserStatus } from '@prisma/client';

export type AuthClientType = 'web' | 'mobile';

export interface PublicUser {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  name: string;
  avatarUrl: string | null;
  role: 'student' | 'admin';
  status: 'active' | 'pending_email' | 'disabled' | 'deleted';
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export interface TokenRequestContext {
  ipAddress: string | null;
  userAgent: string | null;
}
