# 03 — API 规格文档

## 概述

升级后所有后端接口由 NestJS 提供，基础路径为：

```
https://api.offer.example.com/api/v1
```

所有响应使用统一格式：

```json
{
  "success": true,
  "data": {},
  "requestId": "req_..."
}
```

错误响应：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数校验失败",
    "details": {
      "email": ["邮箱格式不正确"]
    }
  },
  "requestId": "req_..."
}
```

---

## 3.1 认证 API

### POST `/auth/register`

注册新用户。默认状态为 `pending_email`，若系统关闭邮箱验证，可直接为 `active`。

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "min8chars",
  "name": "李同学"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "name": "李同学",
      "role": "student",
      "status": "pending_email"
    },
    "requiresEmailVerification": true
  }
}
```

### POST `/auth/login`

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "password123",
  "clientType": "web"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-access-token",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "name": "李同学",
      "role": "student"
    }
  }
}
```

Web 端同时设置 HttpOnly Refresh Cookie：

```text
refresh_token=...; HttpOnly; Secure; SameSite=None; Path=/api/v1/auth; Max-Age=2592000
```

> 前端部署在 Vercel、后端独立域名时，生产环境 Cookie 必须使用 `Secure` 和 `SameSite=None`。本地开发可使用 Bearer Token 或同源代理降低 Cookie 调试复杂度。

### POST `/auth/refresh`

刷新 Access Token。Web 端通过 HttpOnly Cookie 传递 Refresh Token；移动端通过 Body 或 Authorization 传递 Refresh Token。

### POST `/auth/logout`

撤销当前 Refresh Token。

### GET `/auth/me`

获取当前用户。

### POST `/auth/verify-email`

```json
{
  "token": "email-verification-token"
}
```

### POST `/auth/resend-verification`

重新发送验证邮件。

### POST `/auth/forgot-password`

```json
{
  "email": "student@example.com"
}
```

无论邮箱是否存在，都返回成功，避免枚举用户。

### POST `/auth/reset-password`

```json
{
  "token": "reset-token",
  "newPassword": "new-password"
}
```

---

## 3.2 用户 API

### GET `/users/me`

获取个人资料。

### PATCH `/users/me`

更新个人基础资料。

### GET `/users/me/security`

查看账号安全状态：邮箱验证、登录设备、最近登录时间。

### DELETE `/users/me/sessions/{sessionId}`

撤销指定登录会话。

---

## 3.3 AI 模型配置 API

### GET `/ai/models`

返回当前用户可用模型，包含用户模型和可见的全局模型。

**Response 200:**

```json
{
  "success": true,
  "data": {
    "userModels": [],
    "globalModels": [],
    "activeModelId": "uuid",
    "fallbackToGlobal": true
  }
}
```

### POST `/ai/models`

创建用户模型。

```json
{
  "displayName": "DeepSeek Chat",
  "provider": "deepseek",
  "baseUrl": "https://api.deepseek.com",
  "model": "deepseek-chat",
  "apiKey": "sk-xxx",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

### PATCH `/ai/models/{id}`

更新用户自己的模型配置。若不传 `apiKey`，保持原密钥。

### DELETE `/ai/models/{id}`

删除用户模型。

### POST `/ai/models/{id}/test`

测试模型连接。

### POST `/ai/models/{id}/set-default`

设置用户默认模型。

---

## 3.4 AI 业务 API

所有 AI 业务接口需要认证。后端自动选择模型：

1. 请求中指定 `modelConfigId`
2. 用户默认模型
3. 管理员全局默认模型
4. 无可用模型则返回 `AI_MODEL_NOT_CONFIGURED`

### POST `/ai/diagnose`

生成低经验求职画像。

### POST `/ai/translate`

经历能力转译。

### POST `/ai/analyze-job`

岗位 JD 解析。

### POST `/ai/match`

人岗匹配报告。

### POST `/ai/optimize-resume`

简历可信优化。

### POST `/ai/interview`

面试追问生成，支持 `stream: true`。

### POST `/ai/plan`

能力补齐计划。

### POST `/ai/report`

汇总求职报告。

### POST `/ai/generate-jd`

根据岗位标题生成 JD。

**通用 Request 示例：**

```json
{
  "runId": "uuid",
  "modelConfigId": "uuid-optional",
  "input": {
    "studentProfile": {},
    "jobDescription": "岗位职责..."
  },
  "stream": false
}
```

---

## 3.5 求职流程 API

### GET `/career-flows`

获取当前用户的流程列表。

### POST `/career-flows`

创建一次求职流程。

### GET `/career-flows/{id}`

获取流程详情和各步骤结果。

### PATCH `/career-flows/{id}`

更新目标岗位、JD、当前步骤等元数据。

### DELETE `/career-flows/{id}`

删除流程。

### GET `/career-flows/{id}/results`

获取流程步骤结果。

---

## 3.6 简历 API

### GET `/resumes`

简历列表。

### POST `/resumes`

新建简历，可从 AI 结果生成。

### GET `/resumes/{id}`

简历详情。

### PATCH `/resumes/{id}`

保存简历内容。

### POST `/resumes/{id}/versions`

创建版本快照。

### GET `/resumes/{id}/versions`

查看版本历史。

### POST `/resumes/{id}/duplicate`

复制简历。

---

## 3.7 管理员 API

所有 `/admin/*` 接口需要 `admin` 角色。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/users` | 用户列表 |
| GET | `/admin/users/{id}` | 用户详情 |
| PATCH | `/admin/users/{id}` | 更新用户状态/角色/基础信息 |
| POST | `/admin/users/{id}/disable` | 禁用用户 |
| POST | `/admin/users/{id}/enable` | 启用用户 |
| GET | `/admin/ai/models` | 全局模型列表 |
| POST | `/admin/ai/models` | 创建全局模型 |
| PATCH | `/admin/ai/models/{id}` | 更新全局模型 |
| POST | `/admin/ai/models/{id}/set-default` | 设置全局默认模型 |
| POST | `/admin/ai/models/{id}/test` | 测试全局模型 |
| GET | `/admin/smtp` | SMTP 配置 |
| PUT | `/admin/smtp` | 保存 SMTP 配置 |
| POST | `/admin/smtp/test` | 发送测试邮件 |
| GET | `/admin/audit-logs` | 审计日志 |
| GET | `/admin/stats` | 平台统计 |

---

## 3.8 跨域与客户端要求

### Web 前端

```typescript
fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

### 移动端

```http
Authorization: Bearer <accessToken>
X-Client-Type: mobile
X-Client-Version: 1.0.0
```

### 必须支持的预检请求

NestJS 需要正确响应 `OPTIONS`：

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Methods`

---

## 3.9 错误码清单

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| `AUTH_INVALID_CREDENTIALS` | 401 | 邮箱或密码错误 |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | 邮箱未验证 |
| `AUTH_TOKEN_EXPIRED` | 401 | Token 过期 |
| `AUTH_TOKEN_INVALID` | 401 | Token 无效 |
| `AUTH_FORBIDDEN` | 403 | 无权限 |
| `USER_DISABLED` | 403 | 用户已禁用 |
| `VALIDATION_ERROR` | 400 | 参数校验失败 |
| `RESOURCE_NOT_FOUND` | 404 | 资源不存在 |
| `AI_MODEL_NOT_CONFIGURED` | 400 | 未配置可用模型 |
| `AI_KEY_INVALID` | 401 | 模型 API Key 无效 |
| `AI_MODEL_ERROR` | 502 | 模型服务错误 |
| `AI_PARSE_ERROR` | 422 | AI 返回解析失败 |
| `AI_TIMEOUT` | 504 | AI 调用超时 |
| `SMTP_NOT_CONFIGURED` | 400 | SMTP 未配置 |
| `SMTP_TEST_FAILED` | 502 | SMTP 测试失败 |
| `RATE_LIMITED` | 429 | 请求过于频繁 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

