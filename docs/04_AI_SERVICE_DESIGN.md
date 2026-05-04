# 04 — AI 服务设计文档

## 4.1 架构概览

```
用户选择模型 → 前端传递 modelConfig → API Route 构造请求
  → OpenAI Chat Completions API → 解析响应 → 返回类型化数据
```

### 核心原则

1. **OpenAI 兼容协议**：所有模型统一使用 Chat Completions API
2. **服务端代理**：API Key 不暴露在前端，由 API Route 代理调用
3. **Prompt 模板化**：每个模块有独立 Prompt 模板，支持变量注入
4. **结构化输出**：要求 AI 输出 JSON，使用 `response_format: { type: "json_object" }`
5. **JSON 容错解析**：使用 `parseAIJson()` 自动去除 Markdown 代码围栏、提取 JSON 边界
6. **流式支持**：面试对话模块支持 SSE 流式响应

---

## 4.2 统一 AI 客户端 (`lib/ai/client.ts`)

```typescript
interface AIClientConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;         // 默认 60s
  retryCount?: number;      // 默认 2
}

class AIClient {
  constructor(config: AIClientConfig);

  // 非流式调用：返回完整JSON
  async chat(messages: ChatMessage[], jsonMode?: boolean): Promise<string>;

  // 流式调用：返回 ReadableStream
  async chatStream(messages: ChatMessage[]): Promise<ReadableStream>;

  // 带重试的调用
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response>;
}
```

### 调用示例

```typescript
const client = new AIClient({
  baseUrl: 'https://api.deepseek.com',
  apiKey: 'sk-xxx',
  model: 'deepseek-chat',
  temperature: 0.7,
});

const result = await client.chat([
  { role: 'system', content: systemPrompt },
  { role: 'user', content: userPrompt }
], true); // jsonMode = true

const parsed = parseAIJson<CareerDiagnosis>(result);
// parseAIJson 自动去除 ```json ... ``` 围栏，提取 JSON 对象边界
```

---

## 4.3 内置模型配置 (`lib/ai/models.ts`)

```typescript
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
```

> 内置仅提供 2 个 DeepSeek 模型。用户可通过设置页面添加任何 OpenAI 兼容 API 的自定义模型（如 OpenAI / 智谱 / 阿里云等）。

### 用户添加自定义模型

用户可通过设置页面添加任何 OpenAI 兼容 API 的模型：

```typescript
interface CustomModelInput {
  name: string;           // 自定义名称
  baseUrl: string;        // API 地址
  model: string;          // 模型ID
  apiKey: string;         // API Key
}
```

---

## 4.4 模型管理存储

### MVP 阶段：localStorage

```typescript
const STORAGE_KEY = 'nixi-offer-ai-models';

// 存储结构
interface AIModelStorage {
  models: AIModelConfig[];      // 所有模型（内置+自定义）
  activeModelId: string;         // 当前激活模型ID
}

// API Key 加密存储（简单 AES 加密）
function encryptApiKey(key: string): string;
function decryptApiKey(encrypted: string): string;
```

### 未来：数据库存储

通过 Repository Pattern 迁移，API Key 存储在服务端加密。

---

## 4.5 Prompt 模板系统 (`prompts/`)

### 模板结构

每个模块的 Prompt 由两部分组成：

1. **System Prompt**：角色定义 + 输出规则 + JSON Schema
2. **User Prompt**：用户数据注入

### 变量注入 (`lib/ai/prompts.ts`)

```typescript
// lib/ai/prompts.ts
function buildPrompt(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
}
```

> `lib/ai/` 目录文件：`client.ts`（AIClient 类）、`models.ts`（内置模型）、`prompts.ts`（模板工具）、`stream.ts`（SSE 解析 + useStreamResponse Hook）。`lib/auth/get-auth-user.ts` 提供 `getAuthUserId()` 函数，供所有 AI API Route 使用。

### 模块 Prompt 映射

| 模块 | 文件 | System Prompt 要点 |
|------|------|-------------------|
| 画像诊断 | `diagnose.ts` | 就业指导顾问角色，输出JSON |
| 经历转译 | `translate-experience.ts` | 经历挖掘专家，不编造经历 |
| JD解析 | `analyze-job.ts` | JD解析专家，结构化拆解 |
| 人岗匹配 | `match-report.ts` | 匹配分析智能体，客观评分 |
| 简历优化 | `optimize-resume.ts` | 可信简历专家，保留来源 |
| 面试追问 | `interview.ts` | 面试教练，STAR法则 |
| 能力计划 | `improvement-plan.ts` | 行动规划顾问，具体可执行 |
| 汇总报告 | `final-report.ts` | 报告助手，Markdown输出 |

---

## 4.6 API Route 实现模式

每个 AI API Route 遵循统一模式：

```typescript
// /api/ai/diagnose/route.ts
export async function POST(request: Request) {
  // 1. 验证JWT
  const user = await verifyAuth(request);
  if (!user) return unauthorized();

  // 2. 解析请求
  const { studentProfile, modelConfig } = await request.json();

  // 3. 参数校验
  if (!studentProfile || !modelConfig) return badRequest('缺少必要参数');

  // 4. 构造AI客户端
  const client = new AIClient({
    baseUrl: modelConfig.baseUrl,
    apiKey: modelConfig.apiKey,
    model: modelConfig.model,
    temperature: 0.7,
  });

  // 5. 加载Prompt模板
  const systemPrompt = getDiagnoseSystemPrompt();
  const userPrompt = buildPrompt(getDiagnoseUserPrompt(), {
    studentProfile: JSON.stringify(studentProfile, null, 2),
  });

  // 6. 调用AI
  try {
    const result = await client.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], true);

    // 7. 解析并验证（自动去除 Markdown 围栏）
    const diagnosis = parseAIJson<CareerDiagnosis>(result);
    return Response.json({ success: true, data: diagnosis });
  } catch (error) {
    return handleAIError(error);
  }
}
```

---

## 4.7 流式响应（SSE）

SSE 解析和前端消费由 `lib/ai/stream.ts` 提供：

- `createSSEStream(response)` — 将 fetch Response 转为 ReadableStream 文本
- `useStreamResponse()` — React Hook，提供 `startStream/stopStream/content/error` 状态

面试对话模块支持流式响应：

```typescript
export async function POST(request: Request) {
  // ... 验证和准备 ...

  const stream = await client.chatStream(messages);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

前端消费：

```typescript
const response = await fetch('/api/ai/chat', { method: 'POST', body: JSON.stringify(data) });
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  // 解析 SSE data 并更新UI
}
```

---

## 4.8 错误处理与重试

```typescript
class AIClient {
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    for (let i = 0; i <= this.retryCount; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.status === 429) {
          // 速率限制，等待后重试
          await sleep(Math.pow(2, i) * 1000);
          continue;
        }

        if (!response.ok) {
          throw new AIServiceError(response.status, await response.text());
        }

        return response;
      } catch (error) {
        if (i === this.retryCount) throw error;
        await sleep(Math.pow(2, i) * 1000);
      }
    }
    throw new Error('Max retries exceeded');
  }
}
```

---

## 4.9 模型连接测试

设置页面提供"测试连接"功能：

```typescript
// /api/ai/test-connection/route.ts
export async function POST(request: Request) {
  const { baseUrl, model, apiKey } = await request.json();

  const client = new AIClient({ baseUrl, apiKey, model, timeout: 10000 });

  try {
    const result = await client.chat([
      { role: 'user', content: '请回复"连接成功"' }
    ]);
    return Response.json({ success: true, message: '模型连接成功', response: result });
  } catch (error) {
    return Response.json({ success: false, message: '连接失败: ' + error.message });
  }
}
```
