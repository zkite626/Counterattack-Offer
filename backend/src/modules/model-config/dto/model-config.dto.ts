export type AIModelScopeResponse = 'user' | 'global';
export type AIModelTestStatusResponse = 'success' | 'failed';

export interface SaveAIModelDto {
  displayName?: unknown;
  provider?: unknown;
  baseUrl?: unknown;
  model?: unknown;
  apiKey?: unknown;
  temperature?: unknown;
  maxTokens?: unknown;
  isEnabled?: unknown;
}

export interface UpdateAIModelDto {
  displayName?: unknown;
  provider?: unknown;
  baseUrl?: unknown;
  model?: unknown;
  apiKey?: unknown;
  temperature?: unknown;
  maxTokens?: unknown;
  isEnabled?: unknown;
}

export interface AIModelConfigResponse {
  id: string;
  scope: AIModelScopeResponse;
  ownerUserId: string | null;
  displayName: string;
  provider: string;
  baseUrl: string;
  model: string;
  apiKeyHint: string;
  temperature: number | null;
  maxTokens: number | null;
  isDefault: boolean;
  isEnabled: boolean;
  lastTestedAt: string | null;
  lastTestStatus: AIModelTestStatusResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserAIModelsResponse {
  userModels: AIModelConfigResponse[];
  globalModels: AIModelConfigResponse[];
  activeModelId: string | null;
  fallbackToGlobal: boolean;
}

export interface ModelTestResponse {
  success: boolean;
  latencyMs: number;
  errorCode?: string;
  model: AIModelConfigResponse;
}

export interface ValidatedAIModelInput {
  displayName: string;
  provider: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  temperature: number | null;
  maxTokens: number | null;
  isEnabled: boolean;
}

export interface ValidatedAIModelPatch {
  displayName?: string;
  provider?: string;
  baseUrl?: string;
  model?: string;
  apiKey?: string;
  temperature?: number | null;
  maxTokens?: number | null;
  isEnabled?: boolean;
}
