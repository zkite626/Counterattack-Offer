import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { SecretService } from '../security/secret.service';
import type { RequestWithContext } from '../types/request-context.type';

const sensitiveQueryPattern =
  /([?&](?:apiKey|api_key|password|token|secret|authorization)=)[^&]+/gi;

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  constructor(private readonly secretService: SecretService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestWithContext = req as RequestWithContext;

    res.on('finish', () => {
      const latencyMs = Date.now() - requestWithContext.startedAt;
      const redactedHeaders = this.redactHeaders(req.headers);

      this.logger.log(
        JSON.stringify({
          requestId: requestWithContext.requestId,
          method: req.method,
          path: this.redactPath(req.originalUrl),
          statusCode: res.statusCode,
          latencyMs,
          ip: req.ip,
          userId: requestWithContext.user?.id ?? null,
          errorCode: requestWithContext.errorCode ?? null,
          headers: redactedHeaders,
        }),
      );
    });

    next();
  }

  private redactPath(path: string): string {
    return this.secretService.redactLogText(path).replace(
      sensitiveQueryPattern,
      '$1***',
    );
  }

  private redactHeaders(
    headers: Request['headers'],
  ): Record<string, string | string[]> {
    const safeHeaders: Record<string, string | string[]> = {};

    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'undefined') {
        continue;
      }

      if (this.isSensitiveHeader(key)) {
        safeHeaders[key] = '***';
        continue;
      }

      const headerValue = Array.isArray(value) ? value.join(', ') : value;
      safeHeaders[key] = this.secretService.redactLogText(headerValue);
    }

    return safeHeaders;
  }

  private isSensitiveHeader(key: string): boolean {
    return /authorization|cookie|token|api[-_]?key|secret/i.test(key);
  }
}
