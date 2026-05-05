# 01 — 技术架构文档

## 1.1 架构总览

```
Web Browser / Vercel Edge
  Next.js 16 App Router
  React Pages + Context + CSS Variables
        │
        │ HTTPS / CORS / Cookie or Authorization Bearer
        ▼
NestJS API Server
  AuthModule
  UsersModule
  AiModule
  ModelConfigModule
  CareerFlowModule
  ResumeModule
  MailModule
  AdminModule
  AuditModule
        │
        ├── PostgreSQL
        ├── SMTP Server
        └── OpenAI-Compatible LLM APIs

Mobile App / Mini Program / Future Clients
        │
        └── Same /api/v1 contract
```

## 1.2 单仓双目录目标结构

升级后采用一个 Git 仓库统一管理前后端，但业务代码分为两个顶层目录：`frontend/` 和 `backend/`。这样既方便整体项目管理，也避免前后端代码边界混乱。

```
counterattack-offer/
├── frontend/                    # Next.js 前端（由当前项目迁移而来）
│   ├── package.json
│   ├── next.config.ts
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── contexts/
│       └── lib/api/
├── backend/                     # NestJS 后端
│   ├── package.json
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── modules/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── ai/
│   │       ├── model-config/
│   │       ├── career-flow/
│   │       ├── resume/
│   │       ├── mail/
│   │       ├── admin/
│   │       └── audit/
│   └── prisma/
├── mobile/                      # 未来移动端，当前只预留 API 契约或示例

packages/
├── shared/                      # DTO、错误码、常量、类型
├── prompts/                     # AI Prompt 模板
└── eslint-config/               # 可选共享规范

docs/
└── ...                          # 当前升级文档
```

根目录可使用 npm workspaces 管理：

```json
{
  "private": true,
  "workspaces": ["frontend", "backend", "packages/*"],
  "scripts": {
    "dev:frontend": "npm --workspace frontend run dev",
    "dev:backend": "npm --workspace backend run start:dev",
    "build:frontend": "npm --workspace frontend run build",
    "build:backend": "npm --workspace backend run build"
  }
}
```

后续迁移顺序：

1. 先将当前 Next.js 代码整体迁移到 `frontend/`
2. 再在 `backend/` 新建 NestJS 服务
3. 根目录保留项目级文档、脚本和工作区配置

## 1.3 部署拓扑

| 部分 | 部署位置 | 域名示例 | 说明 |
|------|----------|----------|------|
| Web 前端 | Vercel | `https://offer.example.com` | 静态资源、SSR/CSR 页面 |
| NestJS API | 独立服务器 | `https://api.offer.example.com` | REST/SSE API、认证、AI 代理 |
| PostgreSQL | 同服务器或托管数据库 | 内网地址 | 禁止公网裸露 |
| SMTP | 第三方邮件服务或自建 | 服务商提供 | 仅后端访问 |

### CORS 策略

后端只允许明确白名单来源：

```env
CORS_ORIGINS=https://offer.example.com,https://counterattack-offer.vercel.app,http://localhost:3000
```

NestJS 必须启用：

- `origin` 精确匹配白名单
- `credentials: true`
- `allowedHeaders: Content-Type, Authorization, X-Request-Id, X-Client-Version`
- `methods: GET,POST,PATCH,PUT,DELETE,OPTIONS`

Web 使用 Cookie 时，API 请求必须携带 `credentials: "include"`；移动端使用 Bearer Token 时不依赖 Cookie。

## 1.4 前后端责任边界

| 能力 | 前端 Next.js | 后端 NestJS |
|------|--------------|-------------|
| 页面渲染 | 负责 | 不负责 |
| 表单交互 | 负责 | 提供校验错误 |
| 登录注册 UI | 负责 | 负责认证、Token、邮件验证 |
| 用户数据持久化 | 只读写 API | 负责 PostgreSQL |
| AI Prompt 展示/触发 | 负责交互 | 负责加载 Prompt、调用模型、解析输出 |
| API Key 存储 | 不存储明文 | 加密存储和解密调用 |
| SMTP 配置 | 管理员 UI | 加密存储、测试和发信 |
| 管理员审计 | 展示 | 记录、查询、导出 |
| 移动端支持 | 不负责 | 提供通用 API |

## 1.5 NestJS 模块设计

| 模块 | 职责 |
|------|------|
| `AuthModule` | 注册、登录、刷新 Token、登出、邮箱验证、找回密码 |
| `UsersModule` | 用户资料、用户状态、个人设置 |
| `ModelConfigModule` | 用户模型、全局模型、密钥加密、连接测试 |
| `AiModule` | OpenAI 兼容调用、Prompt 编排、流式响应、调用日志 |
| `CareerFlowModule` | 画像、经历转译、JD 解析、匹配、计划、报告 |
| `ResumeModule` | 简历列表、版本、模板配置、导出元数据 |
| `MailModule` | SMTP 设置、邮件模板、发信队列、测试邮件 |
| `AdminModule` | 用户管理、系统设置、全局模型、SMTP、统计 |
| `AuditModule` | 操作日志、敏感动作审计 |

## 1.6 请求链路

### Web 登录链路

```
Next.js 登录页
  → POST https://api.offer.example.com/api/v1/auth/login
  → NestJS 校验密码
  → 设置 HttpOnly refresh cookie
  → 返回 accessToken + user
  → Web 内存保存 accessToken，刷新后通过 /auth/session 恢复
```

### 移动端登录链路

```
Mobile Login
  → POST /api/v1/auth/login
  → 返回 accessToken + refreshToken
  → App 安全存储 refreshToken
  → 后续请求使用 Authorization: Bearer <accessToken>
```

### AI 调用链路

```
前端触发功能
  → POST /api/v1/ai/{module}
  → AuthGuard 验证用户
  → ResolveModelConfig 解析用户模型或全局模型
  → DecryptApiKey 服务端解密
  → PromptService 构造消息
  → AIClient 调用 OpenAI 兼容接口
  → parseAIJson 类型化解析
  → 写入 ai_call_logs
  → 返回业务结果
```

## 1.7 关键技术决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 前后端分离 | Next.js + NestJS | 前端可继续 Vercel，后端可独立扩容 |
| API 版本 | `/api/v1` | 支持移动端和未来破坏性升级 |
| 认证模式 | Web Cookie + 移动端 Bearer | 同时满足浏览器安全和移动端可用性 |
| 数据库 | PostgreSQL | 强关系、事务、审计、JSONB 兼容 |
| ORM | Prisma | 类型安全、迁移清晰、团队上手快 |
| 密钥加密 | AES-256-GCM + 服务端主密钥 | API Key/SMTP 密码可安全存储 |
| 跨域 | CORS 白名单 + credentials | 支持 Vercel 前端访问独立后端 |
| API 文档 | Swagger/OpenAPI | Web/移动端/测试共享契约 |

## 1.8 环境变量总览

```env
# API 基础
NODE_ENV=production
PORT=3001
API_PUBLIC_URL=https://api.offer.example.com
WEB_PUBLIC_URL=https://offer.example.com
CORS_ORIGINS=https://offer.example.com,https://counterattack-offer.vercel.app

# 数据库
DATABASE_URL=postgresql://user:password@127.0.0.1:5432/counterattack_offer

# Token
JWT_ACCESS_SECRET=replace-with-long-random-secret
JWT_REFRESH_SECRET=replace-with-long-random-secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d

# 加密
APP_KEY_ENCRYPTION_SECRET=base64-32-byte-secret

# 管理员初始化
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-strong-password

# 前端
NEXT_PUBLIC_API_BASE_URL=https://api.offer.example.com/api/v1
NEXT_PUBLIC_APP_NAME=逆袭Offer
```
