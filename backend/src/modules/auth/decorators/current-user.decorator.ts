import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth.types';
import type { RequestWithContext } from '../../../common/types/request-context.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    if (request.user === undefined) {
      throw new Error('CurrentUser 必须配合 JwtAuthGuard 使用');
    }

    return request.user;
  },
);
