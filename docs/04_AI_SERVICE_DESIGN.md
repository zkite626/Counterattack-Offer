# 04 — AI 服务设计文档

## 4.1 设计目标

AI 服务升级后由后端统一代理，目标是：

1. 用户可安全保存自己的模型配置和 API Key
2. 管理员可配置全局默认模型和全局 API Key
3. Web 和移动端都不接触第三方模型明文密钥
4. 所有 AI 调用可记录、可限流、可排查
5. OpenAI 兼容协议保持为统一适配层

---

## 4.2 模型选择优先级

每次 AI 调用按以下顺序解析模型：

```
请求 modelConfigId
  → 用户默认模型
  → 管理员全局默认模型
  → 返回 AI_MODEL_NOT_CONFIGURED
```

管理员可设置平台策略：

| 策略 | 说明 |
|------|------|
| `allow_user_models` | 是否允许用户添加自定义模型 |
| `allow_global_fallback` | 用户无模型时是否允许使用全局模型 |
| `require_model_test_before_use` | 模型必须测试成功后才能使用 |
| `max_user_models` | 每个用户最多保存模型数 |
| `daily_ai_call_limit` | 用户每日 AI 调用上限 |

---

## 4.3 API Key 加密存储

### 存储原则

- 数据库永不保存 API Key 明文
- 前端永不接收 API Key 明文
- 后端日志、审计日志、错误栈不得包含 API Key
- API Key 更新后只展示掩码，如 `sk-***abcd`

### 加密方案

使用 AES-256-GCM：

```typescript
export interface EncryptedSecret {
  ciphertext: string;
  iv: string;
  authTag: string;
  version: number;
}
```

主密钥来自环境变量：

```env
APP_KEY_ENCRYPTION_SECRET=base64-32-byte-secret
```

加密字段以 JSON 字符串存入数据库：

```json
{
  "ciphertext": "...",
  "iv": "...",
  "authTag": "...",
  "version": 1
}
```

### 指纹与重复检测

为避免重复保存同一个 Key，可保存不可逆指纹：

```text
api_key_fingerprint = HMAC_SHA256(APP_KEY_ENCRYPTION_SECRET, apiKey)
```

指纹仅用于重复检测，不用于还原。

---

## 4.4 AIClient 统一接口

```typescript
export interface AIClientConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  retryCount?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIClient {
  chat(messages: ChatMessage[], options?: AIChatOptions): Promise<string>;
  chatJson<T>(messages: ChatMessage[], schemaName: string): Promise<T>;
  chatStream(messages: ChatMessage[], options?: AIChatOptions): Promise<ReadableStream>;
  testConnection(): Promise<AIConnectionTestResult>;
}
```

### OpenAI 兼容请求

```json
{
  "model": "deepseek-chat",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "temperature": 0.7,
  "max_tokens": 4096,
  "response_format": { "type": "json_object" }
}
```

---

## 4.5 Prompt 管理

Prompt 模板从旧前端迁移到共享包或后端：

```
packages/prompts/
├── diagnose.ts
├── translate-experience.ts
├── analyze-job.ts
├── match-report.ts
├── optimize-resume.ts
├── interview.ts
├── improvement-plan.ts
└── final-report.ts
```

每个 Prompt 输出必须包含：

- System Prompt
- User Prompt 构造函数
- 期望 JSON Schema 说明
- 解析后的 TypeScript 类型

---

## 4.6 AI 业务模块映射

| 模块 | API | Prompt | 输出 |
|------|-----|--------|------|
| 画像诊断 | `/ai/diagnose` | `diagnose.ts` | `CareerDiagnosis` |
| 经历转译 | `/ai/translate` | `translate-experience.ts` | `ExperienceTranslation[]` |
| JD 解析 | `/ai/analyze-job` | `analyze-job.ts` | `JobAnalysis` |
| 人岗匹配 | `/ai/match` | `match-report.ts` | `MatchReport` |
| 简历优化 | `/ai/optimize-resume` | `optimize-resume.ts` | `ResumeOptimizationResult` |
| 面试追问 | `/ai/interview` | `interview.ts` | `InterviewSimulation[]` |
| 能力计划 | `/ai/plan` | `improvement-plan.ts` | `ImprovementPlan` |
| 汇总报告 | `/ai/report` | `final-report.ts` | Markdown 报告 |

---

## 4.7 JSON 容错解析

后端保留旧版 `parseAIJson()` 能力，并统一在 AI 服务层使用：

1. 去除 Markdown 代码围栏
2. 提取最外层 JSON 对象或数组
3. 解析失败时记录原始响应摘要，不记录敏感输入
4. 使用 DTO 或 schema 校验输出结构

错误返回：

```json
{
  "success": false,
  "error": {
    "code": "AI_PARSE_ERROR",
    "message": "AI 返回格式无法解析，请稍后重试或切换模型"
  }
}
```

---

## 4.8 调用日志

每次 AI 调用记录到 `ai_call_logs`：

| 字段 | 是否记录 | 说明 |
|------|----------|------|
| 用户 ID | 是 | 用于配额和排查 |
| 模型配置 ID | 是 | 用户模型或全局模型 |
| Prompt 明文 | 默认否 | 可选只记录模板版本 |
| API Key | 永不记录 | 禁止 |
| Token 用量 | 是 | 若模型返回 usage |
| 延迟 | 是 | 监控性能 |
| 错误码 | 是 | 统计故障 |

---

## 4.9 限流与配额

基础限流建议：

| 接口 | 限制 |
|------|------|
| 模型测试 | 10 次/小时/用户 |
| AI 业务调用 | 60 次/小时/用户 |
| 全局模型调用 | 可按管理员策略设置每日上限 |
| 未验证邮箱用户 | 禁止 AI 调用或低配额 |

管理员后台应显示：

- 今日调用次数
- 今日失败率
- Token 用量估算
- Top 模型和 Top 用户

