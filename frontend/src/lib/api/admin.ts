import { apiClient } from "@/lib/api/client";
import type { BackendAIModelConfig, ModelTestResult, SaveModelPayload } from "@/lib/api/ai";
import type { User } from "@/types/auth";

export interface AdminListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminUser extends User {
  aiCallsToday?: number;
  aiCallsTotal?: number;
}

export interface SmtpSetting {
  id: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  passwordHint: string;
  fromName: string;
  fromEmail: string;
  isEnabled: boolean;
  lastTestedAt: string | null;
  lastTestStatus: "success" | "failed" | null;
  updatedAt: string;
}

export interface SaveSmtpSettingPayload {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password?: string;
  fromName: string;
  fromEmail: string;
  isEnabled: boolean;
}

export interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AdminStats {
  todayRegistrations: number;
  emailVerificationRate: number;
  todayAiCalls: number;
  aiSuccessRate: number;
  aiLatencyP50: number;
  aiLatencyP95: number;
  estimatedModelCost: number;
  mailSuccessRate: number;
}

export const adminApi = {
  async listUsers(query?: Record<string, string | number | boolean | null | undefined>): Promise<AdminListResponse<AdminUser>> {
    const result = await apiClient.get<AdminListResponse<AdminUser> | { users: AdminUser[]; total?: number }>("/admin/users", { query });
    if ("items" in result) return result;
    return { items: result.users, total: result.total ?? result.users.length, page: 1, pageSize: result.users.length };
  },

  async updateUser(id: string, payload: Partial<Pick<AdminUser, "role" | "status" | "name">>): Promise<AdminUser> {
    const result = await apiClient.patch<{ user: AdminUser }>(`/admin/users/${id}`, payload);
    return result.user;
  },

  async disableUser(id: string): Promise<void> {
    await apiClient.post<{ message: string }>(`/admin/users/${id}/disable`);
  },

  async enableUser(id: string): Promise<void> {
    await apiClient.post<{ message: string }>(`/admin/users/${id}/enable`);
  },

  async listGlobalModels(): Promise<BackendAIModelConfig[]> {
    const result = await apiClient.get<{ models: BackendAIModelConfig[] }>("/admin/ai/models");
    return result.models;
  },

  async createGlobalModel(payload: SaveModelPayload): Promise<BackendAIModelConfig> {
    const result = await apiClient.post<{ model: BackendAIModelConfig }>("/admin/ai/models", payload);
    return result.model;
  },

  async updateGlobalModel(id: string, payload: Partial<SaveModelPayload>): Promise<BackendAIModelConfig> {
    const result = await apiClient.patch<{ model: BackendAIModelConfig }>(`/admin/ai/models/${id}`, payload);
    return result.model;
  },

  async setGlobalDefault(id: string): Promise<BackendAIModelConfig> {
    const result = await apiClient.post<{ model: BackendAIModelConfig }>(`/admin/ai/models/${id}/set-default`);
    return result.model;
  },

  async testGlobalModel(id: string): Promise<ModelTestResult> {
    return apiClient.post<ModelTestResult>(`/admin/ai/models/${id}/test`);
  },

  async getSmtp(): Promise<SmtpSetting | null> {
    const result = await apiClient.get<{ setting: SmtpSetting | null }>("/admin/smtp");
    return result.setting;
  },

  async saveSmtp(payload: SaveSmtpSettingPayload): Promise<SmtpSetting> {
    const result = await apiClient.put<{ setting: SmtpSetting }>("/admin/smtp", payload);
    return result.setting;
  },

  async testSmtp(toEmail: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>("/admin/smtp/test", { toEmail });
  },

  async listAuditLogs(query?: Record<string, string | number | boolean | null | undefined>): Promise<AdminListResponse<AuditLog>> {
    const result = await apiClient.get<AdminListResponse<AuditLog> | { logs: AuditLog[]; total?: number }>("/admin/audit-logs", { query });
    if ("items" in result) return result;
    return { items: result.logs, total: result.total ?? result.logs.length, page: 1, pageSize: result.logs.length };
  },

  async getStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>("/admin/stats");
  },
};
