import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import type { RequestWithContext } from '../../../common/types/request-context.type';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const user = request.user;

    if (
      user !== undefined &&
      user.emailVerifiedAt !== null &&
      user.status === UserStatus.ACTIVE
    ) {
      return true;
    }

    throw new ForbiddenException({
      code: 'AUTH_EMAIL_NOT_VERIFIED',
      message: '请先完成邮箱验证',
    });
  }
}
