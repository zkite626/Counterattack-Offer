import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { ApiResponse } from '../types/api-response.type';
import type { RequestWithContext } from '../types/request-context.type';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithContext>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        requestId: request.requestId,
      })),
    );
  }
}
