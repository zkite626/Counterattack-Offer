import type { User } from "@/types/auth";

export const PROVIDER_OPTIONS = [
  { value: "deepseek", label: "DeepSeek（深度求索）" },
  { value: "openai", label: "OpenAI" },
  { value: "zhipu", label: "智谱 AI" },
  { value: "alibaba", label: "通义千问" },
  { value: "moonshot", label: "Kimi（月之暗面）" },
  { value: "custom", label: "其他兼容服务" },
] as const;

export const PROVIDER_LABELS: Record<string, string> = {
  deepseek: "DeepSeek（深度求索）",
  openai: "OpenAI",
  zhipu: "智谱 AI",
  alibaba: "通义千问",
  moonshot: "Kimi（月之暗面）",
  custom: "其他兼容服务",
};

export const PROVIDER_ICON: Record<string, string> = {
  deepseek: "深",
  openai: "O",
  zhipu: "智",
  alibaba: "通",
  moonshot: "K",
  custom: "兼",
};

export const PROVIDER_BASE_URLS: Record<string, string> = {
  deepseek: "https://api.deepseek.com",
  openai: "https://api.openai.com/v1",
  zhipu: "https://open.bigmodel.cn/api/paas/v4",
  alibaba: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  moonshot: "https://api.moonshot.ai/v1",
  custom: "",
};

export const USER_ROLE_LABELS: Record<User["role"], string> = {
  student: "学生用户",
  admin: "管理员",
};

export const USER_STATUS_LABELS: Record<User["status"], string> = {
  active: "正常",
  pending_email: "待验证",
  disabled: "已禁用",
  deleted: "已删除",
};

export function getProviderLabel(provider: string): string {
  return PROVIDER_LABELS[provider] ?? provider;
}

export function getProviderIcon(provider: string, fallback: string): string {
  return PROVIDER_ICON[provider] ?? fallback.charAt(0).toUpperCase();
}

export function getProviderBaseUrl(provider: string): string {
  return PROVIDER_BASE_URLS[provider] ?? "";
}
