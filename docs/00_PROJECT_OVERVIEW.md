# 00 — 升级版项目总览

## 0.1 项目名称

**逆袭Offer：面向低经验大学生的 AI 求职突围智能体**

英文标识：`counterattack-offer`

升级版本标识：`platform-upgrade`

## 0.2 升级定位

本次升级将原有 Next.js 全栈 Web MVP 演进为可长期运营的 AI 求职平台。平台不再只服务单一浏览器本地状态，而是具备后端账号体系、数据库持久化、管理员运营能力、用户级模型配置、全局模型兜底、邮件验证和移动端 API 接入能力。

核心方向：

```
前端体验继续轻快，后端能力平台化，AI 调用可管、可审计、可扩展。
```

## 0.3 技术栈选型

| 层级 | 技术选择 | 说明 |
|------|----------|------|
| Web 前端 | Next.js 16 App Router + TypeScript | 复用现有前端能力，可部署到 Vercel |
| 后端 API | NestJS + TypeScript | 独立服务器部署，模块化组织业务能力 |
| 数据库 | PostgreSQL | 持久化用户、求职流程、模型配置、审计日志 |
| ORM | Prisma | 类型安全迁移和查询，便于 NestJS 集成 |
| 认证 | Access Token + Refresh Token + HttpOnly Cookie/Bearer Token | Web 与移动端双模式 |
| 密码哈希 | Argon2id 优先，bcrypt 兼容迁移 | 新账号使用更强哈希，旧账号可逐步升级 |
| AI 调用 | OpenAI 兼容协议 | 适配 DeepSeek/OpenAI/智谱/通义/Kimi 等兼容服务 |
| 邮件 | Nodemailer + SMTP | 注册验证、找回密码、欢迎邮件、系统通知 |
| 部署 | 前端 Vercel，后端 Docker/PM2 + Nginx + PostgreSQL | 前后端分离，CORS 白名单控制 |
| API 文档 | OpenAPI/Swagger | Web、移动端和测试统一契约 |

## 0.4 项目管理结构

升级后采用一个 Git 仓库统一管理前后端，但前端和后端代码物理隔离：

```
counterattack-offer/
├── frontend/                    # Next.js 16 前端，可独立部署到 Vercel
├── backend/                     # NestJS 后端，可独立部署到服务器
├── packages/                    # 可选共享包：类型、DTO、Prompt、常量
├── docs/                        # 升级文档与 Wave 提示词
├── scripts/                     # 项目级脚本
├── package.json                 # 项目管理入口，可使用 npm workspaces
└── README.md
```

根目录只做项目管理，不混放业务源码。当前已有 Next.js 前端代码在后续 Wave 中迁移到 `frontend/`；NestJS 后端新建到 `backend/`。

## 0.5 升级后的角色

| 角色 | 说明 | 核心能力 |
|------|------|----------|
| 游客 | 未登录访问者 | 浏览首页、注册、登录、找回密码 |
| 学生用户 | 平台主要用户 | 管理个人档案、模型配置、求职流程、简历和报告 |
| 管理员 | 平台运营者 | 管理用户、全局模型、SMTP、系统设置、审计日志 |
| 未来移动端用户 | App/小程序用户 | 通过同一后端 API 使用核心求职能力 |

## 0.6 核心升级能力

### 用户和权限

- 邮箱注册、邮箱验证、密码登录、找回密码
- Access Token + Refresh Token 机制
- 管理员可禁用用户、重置用户状态、查看用户基础信息
- 所有敏感操作进入审计日志

### AI 模型配置

- 每个用户可创建多个 OpenAI 兼容模型配置
- API Key 服务端加密存储，前端只展示掩码和末四位
- 用户可选择自己的默认模型
- 管理员可配置全局默认模型和全局 API Key
- 用户无可用模型时可按系统策略 fallback 到全局模型
- 支持按用户、模型、功能统计 AI 调用日志和 Token 用量

### 邮件能力

- 管理员配置 SMTP 主机、端口、安全协议、账号和发件人
- SMTP 密码加密存储
- 支持注册验证、找回密码、欢迎邮件、API Key 变更提醒
- 可测试 SMTP 连接和发送测试邮件

### 数据持久化

- 用户资料、求职流程结果、简历、面试记录、行动计划全部进入 PostgreSQL
- 前端 localStorage 只保留 UI 偏好和临时草稿
- 业务数据以服务端为准，便于多端同步

### 移动端接入

- 后端 API 使用版本化路径 `/api/v1`
- 移动端使用 Bearer Token，不依赖 Cookie
- 支持刷新 Token、分页、错误码、幂等请求和 SSE/轮询兼容方案
- OpenAPI 文档作为移动端开发契约

## 0.7 与旧前端 MVP 的关系

旧版文档已归档为前端 MVP 文档：

```
docs/archive/frontend-mvp/
```

旧前端仍是升级后的 Web 客户端基础，尤其包括：

- 首页、Dashboard、简历创建器和核心求职页面
- CSS Variables 设计系统
- Prompt 模板和 AI 业务闭环
- Wave 1-9 的验收经验

升级后，旧文档不再作为主架构依据，但可以作为 Web 视觉、组件和业务体验的参考。

## 0.8 升级原则

1. **前端不直接调用第三方 AI API**：所有 AI 请求必须走 NestJS 后端代理。
2. **敏感信息不进入前端持久化**：API Key、SMTP 密码、Refresh Token 等敏感值必须由服务端加密或 HttpOnly 存储。
3. **Web 与移动端共用 API 契约**：新增能力优先沉淀为后端 API，而不是只写在 Web 页面里。
4. **管理员能力可审计**：用户管理、全局配置、密钥变更、SMTP 变更必须记录操作人和时间。
5. **功能按 Wave 交付**：每个 Wave 有文档、任务、验收、迁移和回滚说明。
6. **SSD 驱动开发**：规格、Schema、交付标准先行，再进入代码实现。
7. **鼓励使用相关技能辅助开发**：开发、调试、测试、部署和文档工作中，应主动使用可用的 Codex Skills/Plugins 辅助，例如系统化调试、前端实现、浏览器测试、OpenAI 文档查询、代码审查、部署排障等；技能用于提升质量和效率，但不得替代项目文档、安全规范和人工验收标准。

## 0.9 升级后文档索引

详见 `docs/README.md`。
