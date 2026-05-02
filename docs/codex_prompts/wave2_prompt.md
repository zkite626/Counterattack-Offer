# Wave 2 开发提示词 — AI 服务层 + 模型管理

```
你是一个资深全栈工程师，正在为《逆袭Offer》Web MVP 开发 AI 服务层。

## 必读文档

- AGENTS.md（开发规则）
- docs/01_TECH_ARCHITECTURE.md（技术架构）
- docs/02_DATA_MODELS.md（数据模型 — AI 相关类型）
- docs/03_API_SPECIFICATION.md（API 规格）
- docs/04_AI_SERVICE_DESIGN.md（AI 服务设计 — 核心参考）
- docs/06_UI_UX_DESIGN_SYSTEM.md（设计系统）
- docs/08_COMPONENT_SPECIFICATION.md（ModelManager 组件）

## 前置条件

Wave 1 已完成：项目初始化、设计系统、JWT 认证、基础 UI 组件均已就绪。

## Wave 2 任务

### 任务 2.1：AI 类型定义

在 `src/types/ai.ts` 中定义所有 AI 相关类型：
- AIModelConfig, BuiltinModel, ChatMessage, ChatCompletionRequest/Response, AIServiceError

参考 `docs/02_DATA_MODELS.md` §2.2。

### 任务 2.2：AIClient 统一封装

创建 `src/lib/ai/client.ts`：
- 接受 baseUrl, apiKey, model, temperature, timeout, retryCount 配置
- `chat(messages, jsonMode?)` — 非流式调用，返回字符串
- `chatStream(messages)` — 流式调用，返回 ReadableStream
- 内置重试机制（指数退避），超时处理
- 统一错误包装

实现 OpenAI Chat Completions API 调用：
```
POST {baseUrl}/chat/completions
Headers: Authorization: Bearer {apiKey}
Body: { model, messages, temperature, max_tokens, response_format?, stream? }
```

### 任务 2.3：内置模型配置

创建 `src/lib/ai/models.ts`：
- 导出 BUILTIN_MODELS 数组
- 包含 DeepSeek Chat, DeepSeek Reasoner, GPT-4o Mini, GLM-4 Flash, 通义千问 Turbo
- 每个模型有 id, name, provider, baseUrl, model, description, icon, requiresApiKey

### 任务 2.4：Prompt 模板系统

创建 `src/lib/ai/prompts.ts`：
- `buildPrompt(template, variables)` — 替换 {{variable}} 占位符

创建 `src/prompts/` 目录下的 8 个 Prompt 文件（导出 getSystemPrompt 和 getUserPrompt）：
- diagnose.ts, translate-experience.ts, analyze-job.ts, match-report.ts
- optimize-resume.ts, interview.ts, improvement-plan.ts, final-report.ts

Prompt 内容参考 `docs/09_PROMPT_TEMPLATES.md`。

### 任务 2.5：API Key 加密

创建 `src/lib/utils/crypto.ts`：
- `encryptApiKey(key)` — 简单加密（Base64 + 字符偏移，MVP 阶段足够）
- `decryptApiKey(encrypted)` — 解密

### 任务 2.6：SSE 流式处理

创建 `src/lib/ai/stream.ts`：
- `createSSEStream(response)` — 将 fetch Response 转换为可消费的文本流
- 前端消费 SSE 的 hook: `useStreamResponse(url, body)`

### 任务 2.7：AIContext + useAI

创建 `src/contexts/AIContext.tsx`：
- 管理 models 数组、activeModelId
- 初始化时加载 localStorage + 合并内置模型
- 提供 addModel, updateModel, removeModel, setActiveModel, getModelConfig 方法
- 每次变更自动持久化到 localStorage

创建 `src/hooks/useAI.ts`。

### 任务 2.8：AI 代理 API Route

创建 `src/app/api/ai/chat/route.ts`：
- 验证 JWT
- 接收 messages + modelConfig
- 创建 AIClient 实例
- 支持 stream: true 返回 SSE
- 支持 stream: false 返回完整 JSON

### 任务 2.9：连接测试 API

创建 `src/app/api/ai/test-connection/route.ts`：
- 接收 baseUrl, model, apiKey
- 发送简单测试请求
- 返回成功/失败

### 任务 2.10：模型管理页面

创建 `src/app/(dashboard)/settings/page.tsx`：
- 内置模型卡片列表（显示名称、描述、提供商图标）
- 自定义模型列表
- "添加模型"按钮 → Modal 表单（名称、Base URL、Model ID、API Key）
- 每个模型卡片：编辑、删除、测试连接、设为激活
- 当前激活模型高亮标记
- 未配置 API Key 时显示提示

使用已有的 Card, Button, Input, Modal, Tag 组件。

## 验收标准

1. 设置页正确显示 5 个内置模型
2. 可添加自定义模型并保存
3. 输入有效 DeepSeek API Key 后测试连接成功
4. 切换激活模型状态正确
5. 刷新后模型配置保持
6. 暗色模式下设置页正常显示
```
