import type { Request } from 'express';
import type { AuthenticatedUser } from '../../modules/auth/auth.types';

export interface RequestContextFields {
  requestId: string;
  startedAt: number;
  user?: AuthenticatedUser;
}

export type RequestWithContext = Request & RequestContextFields;
