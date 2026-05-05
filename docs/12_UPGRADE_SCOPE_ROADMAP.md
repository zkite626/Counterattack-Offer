# 12 — 升级范围与 Wave 路线图

## 12.1 升级总览

| Wave | 名称 | 核心目标 | 验收标准 |
|------|------|----------|----------|
| Wave 10 | 后端基础设施 | NestJS + PostgreSQL + Prisma + Swagger | 后端可启动，数据库迁移成功 |
| Wave 11 | 认证与邮箱 | 登录注册、邮箱验证、找回密码、SMTP | Web/移动端认证链路可用 |
| Wave 12 | AI 模型平台化 | 用户模型、全局模型、API Key 加密 | 用户和管理员模型配置可用 |
| Wave 13 | 业务 API 迁移 | 求职流程、AI 结果、简历持久化 | 核心闭环由后端 API 驱动 |
| Wave 14 | 前端接入升级 | Next.js 改接 NestJS，新增管理员 UI | Vercel 前端可跨域访问后端 |
| Wave 15 | 移动端与部署 | OpenAPI、移动端 Bearer Token、服务器部署 | API 可供移动端开发 |
| Wave 16 | 安全与运维 | 限流、审计、日志、备份、监控 | 上线可运营 |

---

## 12.2 Wave 10 — 后端基础设施

### 目标

搭建 NestJS 后端、PostgreSQL、Prisma、统一响应格式、Swagger 和基础健康检查。

### 任务清单

| # | 任务 | 输出 |
|---|------|------|
| 10.1 | 创建 `backend/` NestJS 项目 | `backend/` |
| 10.2 | 配置 Prisma + PostgreSQL | `prisma/schema.prisma` |
| 10.3 | 实现 ConfigModule 环境变量校验 | `config/` |
| 10.4 | 实现统一响应和异常过滤器 | `common/filters` |
| 10.5 | 实现 RequestId 中间件 | `common/middleware` |
| 10.6 | 启用 Swagger/OpenAPI | `/docs` |
| 10.7 | 启用 CORS 白名单 | `main.ts` |
| 10.8 | 健康检查接口 | `/health` |

---

## 12.3 Wave 11 — 认证权限 + 邮箱

### 目标

实现真实账号体系，支持 Web 和移动端，并接入 SMTP。

### 任务清单

| # | 任务 | 输出 |
|---|------|------|
| 11.1 | 用户表、Token 表迁移 | Prisma migration |
| 11.2 | 注册/登录/刷新/登出 | `AuthModule` |
| 11.3 | 邮箱验证 | verification tokens |
| 11.4 | 找回密码 | reset tokens |
| 11.5 | SMTP 配置和测试邮件 | `MailModule` |
| 11.6 | Role Guard 和 Admin Guard | `common/guards` |
| 11.7 | 空库默认管理员初始化 | bootstrap service + `system.admin.bootstrap` 审计 |

---

## 12.4 Wave 12 — AI 模型管理 + 加密密钥

### 目标

实现用户级模型和管理员全局模型，API Key 加密存储。

### 任务清单

| # | 任务 | 输出 |
|---|------|------|
| 12.1 | 模型配置表和调用日志表 | Prisma migration |
| 12.2 | AES-256-GCM SecretService | `common/security` |
| 12.3 | 用户模型 CRUD | `/ai/models` |
| 12.4 | 全局模型 CRUD | `/admin/ai/models` |
| 12.5 | 模型连接测试 | `AIClient.testConnection` |
| 12.6 | 模型选择优先级 | ResolveModelConfig |
| 12.7 | AI 调用日志 | `ai_call_logs` |

---

## 12.5 Wave 13 — 求职业务 API 迁移

### 目标

将画像、转译、JD、匹配、简历、面试、计划、报告迁移到 NestJS。

### 任务清单

| # | 任务 |
|---|------|
| 13.1 | 学生档案 API |
| 13.2 | 求职流程 `career_flow_runs` API |
| 13.3 | AI 画像诊断 API |
| 13.4 | AI 经历转译 API |
| 13.5 | AI JD 解析 API |
| 13.6 | AI 人岗匹配 API |
| 13.7 | AI 简历优化 API |
| 13.8 | AI 面试/计划/报告 API |
| 13.9 | 简历 CRUD 和版本 API |

---

## 12.6 Wave 14 — 前端接入升级

### 目标

Next.js 前端改接独立后端 API，并新增管理员后台页面。

### 任务清单

| # | 任务 |
|---|------|
| 14.0 | 将现有前端代码迁移到 `frontend/`，保持 Next.js 构建通过 |
| 14.1 | 新增 `src/lib/api` |
| 14.2 | AuthContext 改接 `/auth/*` |
| 14.3 | AIContext 改接 `/ai/models` |
| 14.4 | JobFlowContext 改接 `/career-flows` |
| 14.5 | ResumeBuilder 改接 `/resumes` |
| 14.6 | 设置页模型管理迁移 |
| 14.7 | 新增管理员后台 |
| 14.8 | Vercel 环境变量配置 |
| 14.9 | 跨域 Cookie 和 Bearer Token 调试 |

---

## 12.7 Wave 15 — 移动端 API 与部署

### 目标

完成独立服务器部署，并冻结移动端 API v1 契约。

### 任务清单

| # | 任务 |
|---|------|
| 15.1 | Dockerfile 和生产启动脚本 |
| 15.2 | Nginx HTTPS 反向代理 |
| 15.3 | PostgreSQL 备份策略 |
| 15.4 | Vercel 前端生产环境接入 |
| 15.5 | OpenAPI 导出 |
| 15.6 | 移动端认证示例 |
| 15.7 | CORS 生产域名验证 |

---

## 12.8 Wave 16 — 安全与运维加固

### 目标

平台具备基本运营安全和可观测能力。

### 任务清单

| # | 任务 |
|---|------|
| 16.1 | 登录/注册/AI 限流 |
| 16.2 | 审计日志完善 |
| 16.3 | 结构化日志 |
| 16.4 | 错误告警 |
| 16.5 | 数据库慢查询和索引检查 |
| 16.6 | 安全头和 CORS 回归测试 |
| 16.7 | 密钥轮换文档 |
