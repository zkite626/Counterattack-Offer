import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { RequestWithContext } from '../../../common/types/request-context.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<RequestWithContext>();
      const accessToken = this.extractBearerToken(request);

      request.user = await this.authService.verifyAccessToken(accessToken);

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Access Token 无效',
      });
    }
  }

  private extractBearerToken(request: RequestWithContext): string {
    const authorization = request.header('authorization');

    if (authorization === undefined) {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: '缺少 Authorization Bearer Token',
      });
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || token === undefined || token.length === 0) {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Authorization Bearer Token 格式无效',
      });
    }

    return token;
  }
}
