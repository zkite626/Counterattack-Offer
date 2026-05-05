# 13 — 开发任务拆分

## Wave 10 — NestJS 后端基础设施 + PostgreSQL

### TASK-10.1 创建后端应用

| 字段 | 内容 |
|------|------|
| 目标 | 新增 NestJS API 服务 |
| 输出 | `backend/` |
| 验收 | `npm run start:dev` 可启动，`GET /api/v1/health` 返回成功 |

### TASK-10.2 数据库与 Prisma

| 字段 | 内容 |
|------|------|
| 目标 | 接入 PostgreSQL 和 Prisma |
| 输出 | `backend/prisma/schema.prisma` |
| 验收 | 本地数据库迁移成功，Prisma Client 可查询 |

### TASK-10.3 统一 API 基建

| 字段 | 内容 |
|------|------|
| 目标 | 统一响应、异常、RequestId、日志 |
| 输出 | `common/filters`, `common/interceptors`, `common/middleware` |
| 验收 | 错误响应符合 `ApiResponse<T>` |

### TASK-10.4 Swagger/OpenAPI

| 字段 | 内容 |
|------|------|
| 目标 | 输出 API 文档 |
| 输出 | `/api-docs` 或 `/docs` |
| 验收 | 本地可打开 Swagger 页面 |

### TASK-10.5 CORS 白名单

| 字段 | 内容 |
|------|------|
| 目标 | 支持 Vercel 前端访问独立后端 |
| 输出 | `main.ts` CORS 配置 |
| 验收 | `http://localhost:3000` 和配置的 Vercel 域名通过预检请求 |

---

## Wave 11 — 认证权限 + SMTP

### TASK-11.1 用户与 Token 表

| 字段 | 内容 |
|------|------|
| 目标 | 创建 `users`, `refresh_tokens`, `email_verification_tokens`, `password_reset_tokens` |
| 验收 | 迁移成功，唯一邮箱约束生效 |

### TASK-11.2 注册登录刷新登出

| 字段 | 内容 |
|------|------|
| 目标 | 实现 `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` |
| 验收 | Web Cookie 与移动端 Bearer 两种模式可用 |

### TASK-11.3 邮箱验证

| 字段 | 内容 |
|------|------|
| 目标 | 注册后发送验证邮件，验证后激活账号 |
| 验收 | Token 单次使用，过期后不可用 |

### TASK-11.4 找回密码

| 字段 | 内容 |
|------|------|
| 目标 | 申请找回、重置密码、撤销会话 |
| 验收 | 不暴露邮箱是否存在，重置后旧会话失效 |

### TASK-11.5 SMTP 管理

| 字段 | 内容 |
|------|------|
| 目标 | 管理员保存 SMTP、测试邮件 |
| 验收 | SMTP 密码加密存储，测试结果入审计 |

---

## Wave 12 — AI 模型管理 + 加密密钥

### TASK-12.1 SecretService

| 字段 | 内容 |
|------|------|
| 目标 | AES-256-GCM 加密/解密服务 |
| 验收 | API Key 和 SMTP 密码均可复用，不输出明文 |

### TASK-12.2 用户模型 API

| 字段 | 内容 |
|------|------|
| 目标 | 用户模型 CRUD、测试、设默认 |
| 验收 | 前端只看到 Key 掩码 |

### TASK-12.3 管理员全局模型 API

| 字段 | 内容 |
|------|------|
| 目标 | 管理员配置全局默认模型和 API Key |
| 验收 | 学生无模型时可按策略 fallback |

### TASK-12.4 AIClient 和调用日志

| 字段 | 内容 |
|------|------|
| 目标 | OpenAI 兼容调用、JSON 解析、日志记录 |
| 验收 | 成功/失败调用均写入 `ai_call_logs` |

---

## Wave 13 — 求职业务 API 迁移

### TASK-13.1 学生档案 API

| 字段 | 内容 |
|------|------|
| 目标 | 个人档案和经历持久化 |
| 验收 | 刷新页面和换设备后数据可恢复 |

### TASK-13.2 求职流程 API

| 字段 | 内容 |
|------|------|
| 目标 | `career_flow_runs` 和 `career_flow_results` |
| 验收 | 每个 AI 步骤结果可查询 |

### TASK-13.3 AI 业务接口迁移

| 字段 | 内容 |
|------|------|
| 目标 | 迁移旧 Next.js `/api/ai/*` 到 NestJS |
| 验收 | 画像到报告全流程使用后端 API |

### TASK-13.4 简历持久化

| 字段 | 内容 |
|------|------|
| 目标 | 简历 CRUD、版本、复制 |
| 验收 | 简历编辑器刷新不丢数据 |

---

## Wave 14 — 前端接入后端 + 管理员 UI

### TASK-14.0 前端目录迁移

| 字段 | 内容 |
|------|------|
| 目标 | 将当前 Next.js 前端代码整体迁移到 `frontend/` |
| 输出 | `frontend/package.json`, `frontend/src`, `frontend/public`, `frontend/next.config.ts` |
| 验收 | 在 `frontend/` 内运行构建通过，Vercel Root Directory 指向 `frontend` |

### TASK-14.1 API Client

| 字段 | 内容 |
|------|------|
| 目标 | 新增 `src/lib/api` 封装 |
| 验收 | 自动携带 Token、处理 refresh、统一错误 |

### TASK-14.2 AuthContext 迁移

| 字段 | 内容 |
|------|------|
| 目标 | 改接 NestJS `/auth/*` |
| 验收 | Vercel 前端可登录独立后端 |

### TASK-14.3 AI 设置页迁移

| 字段 | 内容 |
|------|------|
| 目标 | localStorage 模型迁移为后端模型 |
| 验收 | API Key 不再进入前端持久化 |

### TASK-14.4 业务页面迁移

| 字段 | 内容 |
|------|------|
| 目标 | Dashboard 各页面改接后端 API |
| 验收 | 页面刷新后流程状态可恢复 |

### TASK-14.5 管理员后台

| 字段 | 内容 |
|------|------|
| 目标 | 用户、全局模型、SMTP、审计日志页面 |
| 验收 | 非管理员不可访问 |

---

## Wave 15 — 移动端 API 契约 + 部署

### TASK-15.1 后端服务器部署

| 字段 | 内容 |
|------|------|
| 目标 | Docker/PM2 + Nginx + HTTPS |
| 验收 | `https://api.offer.example.com/api/v1/health` 可访问 |

### TASK-15.2 前端 Vercel 部署

| 字段 | 内容 |
|------|------|
| 目标 | Vercel 连接生产 API |
| 验收 | 生产域名登录、刷新、AI 调用正常 |

### TASK-15.3 OpenAPI 导出

| 字段 | 内容 |
|------|------|
| 目标 | 冻结移动端 v1 API 契约 |
| 验收 | 移动端可基于 OpenAPI 生成客户端 |

### TASK-15.4 CORS 生产验证

| 字段 | 内容 |
|------|------|
| 目标 | 验证 Vercel 域名和自定义域名 |
| 验收 | OPTIONS 预检和 credentials 请求均通过 |

---

## Wave 16 — 安全与运维

### TASK-16.1 限流

| 字段 | 内容 |
|------|------|
| 目标 | 登录、注册、AI、邮件接口限流 |
| 验收 | 超限返回 `RATE_LIMITED` |

### TASK-16.2 审计日志完善

| 字段 | 内容 |
|------|------|
| 目标 | 敏感操作全记录 |
| 验收 | 管理员后台可筛选查询 |

### TASK-16.3 日志与监控

| 字段 | 内容 |
|------|------|
| 目标 | 结构化日志、错误告警、慢请求 |
| 验收 | 可定位 requestId 对应错误 |

### TASK-16.4 备份与恢复

| 字段 | 内容 |
|------|------|
| 目标 | PostgreSQL 定时备份 |
| 验收 | 有恢复演练记录 |
