import type { Request } from 'express';

export interface RequestContextFields {
  requestId: string;
  startedAt: number;
}

export type RequestWithContext = Request & RequestContextFields;
