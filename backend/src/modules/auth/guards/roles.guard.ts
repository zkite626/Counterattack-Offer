import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { REQUIRED_ROLES_KEY } from '../decorators/require-roles.decorator';
import type { RequestWithContext } from '../../../common/types/request-context.type';

type RequiredRole = UserRole | 'student' | 'admin';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RequiredRole[]>(
      REQUIRED_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (roles === undefined || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const userRole = request.user?.role;

    if (
      userRole !== undefined &&
      roles.some((role) => this.normalizeRole(role) === userRole)
    ) {
      return true;
    }

    throw new ForbiddenException({
      code: 'AUTH_FORBIDDEN',
      message: '当前账号无权访问该资源',
    });
  }

  private normalizeRole(role: RequiredRole): UserRole {
    if (role === 'admin') {
      return UserRole.ADMIN;
    }

    if (role === 'student') {
      return UserRole.STUDENT;
    }

    return role;
  }
}
