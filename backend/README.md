# 逆袭Offer 后端

`backend/` 是 NestJS API 服务，负责认证、PostgreSQL 持久化、AI 代理、SMTP、管理员后台 API、审计日志和运维观测。

## 本地启动

```bash
cp backend/.env.example backend/.env
npm --workspace backend run prisma:generate
npm --workspace backend run prisma:migrate
npm --workspace backend run start:dev
```

本地 Docker PostgreSQL：

```bash
npm --workspace backend run db:up
```

## 环境变量

后端读取 `backend/.env`，可由 `backend/.env.example` 复制生成。每一项含义如下：

| 变量 | 说明 |
|------|------|
| `NODE_ENV` | 运行环境，取值为 `development`、`test` 或 `production` |
| `PORT` | 后端 HTTP 服务监听端口 |
| `API_PUBLIC_URL` | 后端公开访问地址，用于日志、OpenAPI 和回调 URL 生成 |
| `WEB_PUBLIC_URL` | 前端 Web 地址，用于邮件验证、找回密码等跳转链接 |
| `CORS_ORIGINS` | 允许访问后端的前端 Origin 白名单，多个值用英文逗号分隔 |
| `DATABASE_URL` | PostgreSQL 连接串 |
| `SWAGGER_PATH` | Swagger/OpenAPI 文档路径 |
| `JWT_ACCESS_SECRET` | Access Token 签名密钥，至少 32 字符 |
| `JWT_REFRESH_SECRET` | Refresh Token 签名密钥，至少 32 字符，必须与 Access Token 密钥不同 |
| `ACCESS_TOKEN_TTL_SECONDS` | Access Token 有效期，单位秒 |
| `REFRESH_TOKEN_TTL_DAYS` | Refresh Token 有效期，单位天 |
| `APP_KEY_ENCRYPTION_SECRET` | API Key / SMTP 密码加密主密钥，要求 32 字节明文或 base64 编码后的 32 字节 |
| `ADMIN_EMAIL` | 空库首次启动时创建的默认管理员邮箱 |
| `ADMIN_PASSWORD` | 空库首次启动时创建的默认管理员密码 |

## 空库初始化

服务启动时如果检测到 `users` 表为空，会自动初始化最小可运营数据：

- 使用 `ADMIN_EMAIL` / `ADMIN_PASSWORD` 创建默认管理员，当前模板值为 `admin@nixioffer.com` / `Admin@123`
- 写入 `app_settings.system.bootstrap` 初始化标记
- 写入 `audit_logs`，`action = system.admin.bootstrap`

已有用户时会跳过初始化。该流程不会创建全局 AI 模型、SMTP 配置或示例业务数据，避免把真实密钥和演示数据混入生产环境。
空库启动时如果缺少 `ADMIN_EMAIL` 或 `ADMIN_PASSWORD`，后端会拒绝启动。
首次登录后请尽快修改默认管理员密码。

## 账号与管理员接口

- 用户可通过 `/api/v1/auth/change-password` 修改自己的密码
- 用户可通过 `/api/v1/auth/change-email` 修改登录邮箱，新邮箱需要重新验证
- AI 求职问答通过 `/api/v1/ai/career-qa` 提供 `text/event-stream` 流式回复，`contextSummary` 可为空
- 管理员可通过 `/api/v1/admin/users` 新增用户，并通过 `/api/v1/admin/users/:id` 软删除用户
- 管理员可通过 `/api/v1/admin/users/:id/reset-password` 重置用户密码，旧会话会失效
- 管理员可通过 `/api/v1/admin/users/:id/resend-verification` 重新发送验证邮件
- 以上敏感操作都会写入审计日志，错误响应会携带 `requestId`

## 常用命令

```bash
npm --workspace backend run lint
npm --workspace backend run build
npm --workspace backend run openapi:export
npm --workspace backend run verify:cors
npm --workspace backend run verify:mobile
```
