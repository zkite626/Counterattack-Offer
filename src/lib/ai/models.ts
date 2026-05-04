import type { BuiltinModel } from '@/types/ai';

// 内置模型配置列表
export const BUILTIN_MODELS: BuiltinModel[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    description: '高性价比中文大模型，推荐使用',
    icon: '/images/models/deepseek.svg',
    requiresApiKey: true,
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-reasoner',
    description: '深度推理模型，适合复杂分析',
    icon: '/images/models/deepseek.svg',
    requiresApiKey: true,
  },
];
