// AI 模型相关类型定义

export interface AIModelConfig {
  id: string;
  name: string;              // 前端显示名称，等同于 displayName
  displayName: string;       // 后端模型名称
  scope: "user" | "global";
  ownerUserId: string | null;
  provider: string;          // 提供商标识，如 "deepseek"
  baseUrl: string;           // API Base URL
  model: string;             // 模型ID，如 "deepseek-chat"
  apiKeyHint: string;        // 后端返回的 Key 掩码，前端不保存明文
  isBuiltin: boolean;        // 是否全局/内置模型
  isActive: boolean;         // 是否为当前激活模型
  isDefault: boolean;
  isEnabled: boolean;
  lastTestedAt: string | null;
  lastTestStatus: "success" | "failed" | null;
  maxTokens: number | null;
  temperature: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BuiltinModel {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  model: string;
  description: string;
  icon: string;              // 模型图标路径
  requiresApiKey: true;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  response_format?: { type: 'json_object' };
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIServiceError {
  code: string;
  message: string;
  provider?: string;
  statusCode?: number;
}
