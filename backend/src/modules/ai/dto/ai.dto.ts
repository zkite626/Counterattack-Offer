import type { ChatMessage } from '../ai-client';

export interface AIInvokeOptions {
  module: string;
  modelConfigId?: string | null;
  messages: ChatMessage[];
  jsonMode?: boolean;
  temperature?: number | null;
  maxTokens?: number | null;
}

export interface AIInvokeResult {
  content: string;
  modelConfigId: string;
  provider: string;
  model: string;
  promptTokens: number | null;
  completionTokens: number | null;
  latencyMs: number;
}
