import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import type { RequestWithContext } from '../types/request-context.type';

const requestIdHeader = 'x-request-id';

function normalizeRequestId(value: string | string[] | undefined): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== 'string') {
    return null;
  }

  const normalized = candidate.trim();

  if (normalized.length === 0 || normalized.length > 128) {
    return null;
  }

  return normalized;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId =
      normalizeRequestId(req.headers[requestIdHeader]) ?? `req_${randomUUID()}`;
    const requestWithContext = req as RequestWithContext;

    requestWithContext.requestId = requestId;
    requestWithContext.startedAt = Date.now();
    res.setHeader('X-Request-Id', requestId);

    next();
  }
}
