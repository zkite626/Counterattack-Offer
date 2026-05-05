import { apiClient } from "@/lib/api/client";
import type { AIModelConfig } from "@/types/ai";

export interface BackendAIModelConfig {
  id: string;
  scope: "user" | "global";
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
  lastTestStatus: "success" | "failed" | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserModelsPayload {
  userModels: BackendAIModelConfig[];
  globalModels: BackendAIModelConfig[];
  activeModelId: string | null;
  fallbackToGlobal: boolean;
}

export interface SaveModelPayload {
  displayName: string;
  provider: string;
  baseUrl: string;
  model: string;
  apiKey?: string;
  temperature?: number | null;
  maxTokens?: number | null;
  isEnabled?: boolean;
}

export interface ModelTestResult {
  success: boolean;
  latencyMs: number;
  errorCode?: string;
  model: BackendAIModelConfig;
}

export function normalizeModel(model: BackendAIModelConfig, activeModelId: string | null): AIModelConfig {
  return {
    ...model,
    name: model.displayName,
    isBuiltin: model.scope === "global",
    isActive: model.id === activeModelId,
  };
}

export const aiApi = {
  async listModels(): Promise<UserModelsPayload> {
    return apiClient.get<UserModelsPayload>("/ai/models");
  },

  async createModel(payload: SaveModelPayload): Promise<BackendAIModelConfig> {
    const result = await apiClient.post<{ model: BackendAIModelConfig }>("/ai/models", payload);
    return result.model;
  },

  async updateModel(id: string, payload: Partial<SaveModelPayload>): Promise<BackendAIModelConfig> {
    const result = await apiClient.patch<{ model: BackendAIModelConfig }>(`/ai/models/${id}`, payload);
    return result.model;
  },

  async deleteModel(id: string): Promise<void> {
    await apiClient.delete<{ message: string }>(`/ai/models/${id}`);
  },

  async testModel(id: string): Promise<ModelTestResult> {
    return apiClient.post<ModelTestResult>(`/ai/models/${id}/test`);
  },

  async setDefault(id: string): Promise<BackendAIModelConfig> {
    const result = await apiClient.post<{ model: BackendAIModelConfig }>(`/ai/models/${id}/set-default`);
    return result.model;
  },

  async run<T>(modulePath: string, input: Record<string, unknown>, runId?: string | null, modelConfigId?: string | null): Promise<T> {
    return apiClient.post<T>(`/ai/${modulePath}`, {
      runId: runId ?? undefined,
      modelConfigId: modelConfigId ?? undefined,
      input,
    });
  },
};
