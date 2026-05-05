# Wave 12 开发提示词 — AI 模型管理 + API Key 加密

```
你是一个资深 AI 平台后端工程师，正在为《逆袭Offer》实现用户级模型配置和管理员全局模型。

## 必读文档

- AGENTS.md
- docs/02_DATA_MODELS.md
- docs/03_API_SPECIFICATION.md
- docs/04_AI_SERVICE_DESIGN.md
- docs/07_ADMIN_CONSOLE_DESIGN.md
- docs/16_SECURITY_NOTES.md

## 目标

1. 用户可管理自己的 OpenAI 兼容模型
2. 管理员可配置全局默认模型和全局 API Key
3. API Key 服务端加密存储，前端只展示掩码
4. 所有 AI 调用写入调用日志

## 任务

### 12.1 数据库迁移

- `ai_model_configs`
- `ai_call_logs`
- 必要索引和唯一约束

### 12.2 SecretService

- AES-256-GCM 加密/解密
- HMAC 指纹
- 掩码生成
- 日志脱敏

### 12.3 用户模型 API

- `GET /ai/models`
- `POST /ai/models`
- `PATCH /ai/models/{id}`
- `DELETE /ai/models/{id}`
- `POST /ai/models/{id}/test`
- `POST /ai/models/{id}/set-default`

### 12.4 管理员全局模型 API

- `GET /admin/ai/models`
- `POST /admin/ai/models`
- `PATCH /admin/ai/models/{id}`
- `POST /admin/ai/models/{id}/set-default`
- `POST /admin/ai/models/{id}/test`

### 12.5 AIClient

- OpenAI 兼容 Chat Completions
- JSON Mode
- 流式 SSE
- 超时和重试
- 连接测试

### 12.6 模型解析策略

请求指定模型 → 用户默认模型 → 全局默认模型 → `AI_MODEL_NOT_CONFIGURED`

## 验收标准

- 数据库无 API Key 明文
- 用户只能管理自己的模型
- 管理员可管理全局模型
- 用户无模型时可 fallback 到全局模型
- 模型测试成功/失败状态正确
- AI 调用日志记录耗时、状态、Token 用量
```

