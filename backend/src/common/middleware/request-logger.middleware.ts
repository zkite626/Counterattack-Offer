import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import type { RequestWithContext } from '../types/request-context.type';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const requestWithContext = req as RequestWithContext;

    res.on('finish', () => {
      const latencyMs = Date.now() - requestWithContext.startedAt;

      this.logger.log(
        JSON.stringify({
          requestId: requestWithContext.requestId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          latencyMs,
          ip: req.ip,
        }),
      );
    });

    next();
  }
}
