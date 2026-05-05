import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiError, ApiResponse } from '../types/api-response.type';
import type { RequestWithContext } from '../types/request-context.type';

interface HttpExceptionPayload {
  code?: string;
  error?: string;
  message?: string | string[];
  details?: Record<string, string[]>;
  statusCode?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toHttpExceptionPayload(value: unknown): HttpExceptionPayload {
  if (typeof value === 'string') {
    return { message: value };
  }

  if (!isRecord(value)) {
    return {};
  }

  const payload: HttpExceptionPayload = {};

  if (typeof value.code === 'string') {
    payload.code = value.code;
  }

  if (typeof value.error === 'string') {
    payload.error = value.error;
  }

  if (typeof value.statusCode === 'number') {
    payload.statusCode = value.statusCode;
  }

  if (typeof value.message === 'string' || Array.isArray(value.message)) {
    payload.message = value.message;
  }

  if (isValidationDetails(value.details)) {
    payload.details = value.details;
  }

  return payload;
}

function isValidationDetails(
  value: unknown,
): value is Record<string, string[]> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (messages) =>
      Array.isArray(messages) &&
      messages.every((message) => typeof message === 'string'),
  );
}

function codeFromStatus(statusCode: number): string {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'BAD_REQUEST';
    case HttpStatus.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case HttpStatus.FORBIDDEN:
      return 'FORBIDDEN';
    case HttpStatus.NOT_FOUND:
      return 'NOT_FOUND';
    case HttpStatus.SERVICE_UNAVAILABLE:
      return 'SERVICE_UNAVAILABLE';
    default:
      return statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR';
  }
}

function messageFromPayload(
  payload: HttpExceptionPayload,
  fallback: string,
): string {
  if (typeof payload.message === 'string') {
    return payload.message;
  }

  if (Array.isArray(payload.message) && payload.message.length > 0) {
    return payload.message.join('; ');
  }

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  return fallback;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<RequestWithContext>();
    const response = http.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload =
      exception instanceof HttpException
        ? toHttpExceptionPayload(exception.getResponse())
        : {};
    const error: ApiError = {
      code: payload.code ?? codeFromStatus(statusCode),
      message: messageFromPayload(payload, '服务器内部错误'),
      details: payload.details,
    };
    // 统一错误体在过滤器兜底，保证业务异常和未知异常都有 requestId。
    const body: ApiResponse<never> = {
      success: false,
      error,
      requestId: request.requestId,
    };

    if (statusCode >= 500) {
      this.logger.error(
        JSON.stringify({
          requestId: request.requestId,
          method: request.method,
          path: request.originalUrl,
          statusCode,
          errorCode: error.code,
        }),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(statusCode).json(body);
  }
}
