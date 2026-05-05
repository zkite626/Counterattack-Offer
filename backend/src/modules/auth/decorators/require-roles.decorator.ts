import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@prisma/client';

export const REQUIRED_ROLES_KEY = 'requiredRoles';

export type RoleMetadata = UserRole | 'student' | 'admin';

export const RequireRoles = (
  ...roles: RoleMetadata[]
): MethodDecorator & ClassDecorator => SetMetadata(REQUIRED_ROLES_KEY, roles);
