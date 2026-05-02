// AI 模型相关类型定义

export interface AIModelConfig {
  id: string;
  name: string;              // 显示名称，如 "DeepSeek Chat"
  provider: string;          // 提供商标识，如 "deepseek"
  baseUrl: string;           // API Base URL
  model: string;             // 模型ID，如 "deepseek-chat"
  apiKey: string;            // 用户输入的API Key（加密存储）
  isBuiltin: boolean;        // 是否内置模型
  isActive: boolean;         // 是否为当前激活模型
  maxTokens?: number;
  temperature?: number;
  createdAt: string;
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
