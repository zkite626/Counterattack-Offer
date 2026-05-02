# 03 — API 规格文档

## 概述

所有 API 均为 Next.js API Routes，基础路径 `/api/`。认证 API 无需 Token，AI API 需要有效 JWT。

---

## 3.1 认证 API

### POST `/api/auth/register`

注册新用户。

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
    "user": { "id": "uuid", "email": "...", "name": "...", "createdAt": "..." },
    "token": "jwt-token-string"
  }
}
```

**Response 400:** 参数校验失败
**Response 409:** 邮箱已注册

---

### POST `/api/auth/login`

用户登录，返回 JWT Token 并设置 HttpOnly Cookie。

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "..." },
    "token": "jwt-token-string"
  }
}
```

**Cookie 设置:** `token=jwt-string; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`

**Response 401:** 邮箱或密码错误

---

### GET `/api/auth/me`

获取当前登录用户信息。需要 JWT Cookie。

**Headers:** Cookie 中携带 `token`

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "email": "...", "name": "...", "createdAt": "..." }
}
```

**Response 401:** Token 无效或过期

---

### POST `/api/auth/logout`

登出，清除 Cookie。

**Response 200:**
```json
{ "success": true }
```

---

## 3.2 AI API

所有 AI API 需要 JWT 认证。模型配置通过请求 Header 传递：

```
X-AI-Base-URL: https://api.deepseek.com
X-AI-Model: deepseek-chat
X-AI-API-Key: sk-xxx (加密后)
```

或通过请求 Body 中的 `modelConfig` 字段传递。

---

### POST `/api/ai/diagnose`

生成低经验求职画像。

**Request Body:**
```json
{
  "studentProfile": {
    "name": "李同学",
    "schoolType": "普通本科",
    "major": "市场营销",
    "grade": "大四",
    "targetRoles": ["运营助理", "用户运营"],
    "rawExperiences": ["..."],
    "skills": ["Excel", "PPT"],
    "weaknesses": ["没有正式实习"]
  },
  "modelConfig": {
    "baseUrl": "https://api.deepseek.com",
    "model": "deepseek-chat",
    "apiKey": "sk-xxx"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "studentType": "低经验但具备运营潜力型学生",
    "summary": "...",
    "coreStrengths": ["..."],
    "mainWeaknesses": ["..."],
    "recommendedRoles": [
      { "role": "运营助理", "reason": "...", "fitScore": 86, "priority": "recommended" }
    ],
    "careerAdvice": "..."
  }
}
```

---

### POST `/api/ai/translate`

经历能力转译。

**Request Body:**
```json
{
  "rawExperiences": ["社团公众号排版", "..."],
  "targetRoles": ["运营助理", "用户运营"],
  "modelConfig": { "baseUrl": "...", "model": "...", "apiKey": "..." }
}
```

**Response 200:** `ExperienceTranslation[]`

---

### POST `/api/ai/analyze-job`

岗位 JD 解析。

**Request Body:**
```json
{
  "jobDescription": "岗位名称：用户运营实习生\n岗位职责：...",
  "modelConfig": { ... }
}
```

**Response 200:** `JobAnalysis`

---

### POST `/api/ai/match`

人岗匹配报告。

**Request Body:**
```json
{
  "careerDiagnosis": { ... },
  "experienceTranslations": [ ... ],
  "jobAnalysis": { ... },
  "modelConfig": { ... }
}
```

**Response 200:** `MatchReport`

---

### POST `/api/ai/optimize-resume`

简历可信优化。

**Request Body:**
```json
{
  "rawExperiences": [ ... ],
  "experienceTranslations": [ ... ],
  "jobAnalysis": { ... },
  "matchReport": { ... },
  "modelConfig": { ... }
}
```

**Response 200:** `ResumeOptimizationResult`

---

### POST `/api/ai/interview`

面试追问生成。

**Request Body:**
```json
{
  "careerDiagnosis": { ... },
  "resumeOptimization": { ... },
  "jobAnalysis": { ... },
  "modelConfig": { ... },
  "stream": false
}
```

**Response 200:** `InterviewSimulation[]`

当 `stream: true` 时，返回 SSE 流式响应。

---

### POST `/api/ai/plan`

能力补齐计划。

**Request Body:**
```json
{
  "careerDiagnosis": { ... },
  "jobAnalysis": { ... },
  "matchReport": { ... },
  "modelConfig": { ... }
}
```

**Response 200:** `ImprovementPlan`

---

### POST `/api/ai/report`

汇总求职报告。

**Request Body:**
```json
{
  "careerDiagnosis": { ... },
  "experienceTranslations": [ ... ],
  "jobAnalysis": { ... },
  "matchReport": { ... },
  "resumeOptimization": { ... },
  "interviewSimulation": [ ... ],
  "improvementPlan": { ... },
  "modelConfig": { ... }
}
```

**Response 200:** `{ report: string }` (Markdown 格式报告)

---

### POST `/api/ai/chat`

通用 AI 对话接口（面试实时对话用）。

**Request Body:**
```json
{
  "messages": [
    { "role": "system", "content": "你是面试官..." },
    { "role": "user", "content": "学生回答..." }
  ],
  "modelConfig": { ... },
  "stream": true
}
```

**Response:** SSE 流式响应

---

## 3.3 错误响应格式

所有 API 错误统一格式：

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "邮箱或密码错误"
  }
}
```

### 错误码清单

| 错误码 | HTTP状态 | 说明 |
|--------|---------|------|
| `AUTH_INVALID_CREDENTIALS` | 401 | 登录凭证错误 |
| `AUTH_TOKEN_EXPIRED` | 401 | Token过期 |
| `AUTH_TOKEN_INVALID` | 401 | Token无效 |
| `AUTH_EMAIL_EXISTS` | 409 | 邮箱已注册 |
| `VALIDATION_ERROR` | 400 | 参数校验失败 |
| `AI_MODEL_ERROR` | 502 | AI模型调用失败 |
| `AI_PARSE_ERROR` | 422 | AI返回格式解析失败 |
| `AI_TIMEOUT` | 504 | AI调用超时 |
| `AI_KEY_INVALID` | 401 | API Key无效 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |
