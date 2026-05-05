# Wave 10 开发提示词 — NestJS 后端基础设施 + PostgreSQL

```
你是一个资深 NestJS 后端工程师，正在为《逆袭Offer》平台升级搭建独立后端服务。

## 必读文档

- AGENTS.md
- docs/00_PROJECT_OVERVIEW.md
- docs/01_TECH_ARCHITECTURE.md
- docs/02_DATA_MODELS.md
- docs/11_SSD_WAVE_DEVELOPMENT.md
- docs/12_UPGRADE_SCOPE_ROADMAP.md

## 前置条件

旧 Next.js 全栈 MVP 文档已归档到 `docs/archive/frontend-mvp/`。本 Wave 不迁移前端业务页面，只搭建后端基础设施。

## 目标

1. 新增 NestJS API 服务
2. 接入 PostgreSQL 和 Prisma
3. 建立统一响应、异常处理、RequestId、日志和 Swagger
4. 配置 CORS，支持 Vercel 前端和本地前端访问独立后端

## 任务

### 10.1 创建后端项目

- 在目标结构中新增 `apps/api`
- 使用 TypeScript 严格模式
- 建立模块目录：auth/users/ai/model-config/career-flow/resume/mail/admin/audit

### 10.2 接入 PostgreSQL + Prisma

- 配置 `DATABASE_URL`
- 创建初始 Prisma Schema
- 先建立基础表：users, refresh_tokens, app_settings, audit_logs

### 10.3 API 基础设施

- 全局前缀 `/api/v1`
- 统一响应 `{ success, data?, error?, requestId? }`
- 全局异常过滤器
- 请求日志和 RequestId
- 健康检查 `/api/v1/health`

### 10.4 Swagger/OpenAPI

- 启用 Swagger
- DTO 使用明确类型
- 不使用 `any`

### 10.5 CORS

- 从 `CORS_ORIGINS` 读取白名单
- `credentials: true`
- 支持 `Authorization`, `Content-Type`, `X-Request-Id`, `X-Client-Version`
- 禁止生产环境 `origin: "*"`

## 验收标准

- 后端本地可启动
- `GET /api/v1/health` 正常
- Prisma migration 成功
- Swagger 页面可访问
- `localhost:3000` 预检请求通过
- 配置的 Vercel 域名预检请求通过
```

