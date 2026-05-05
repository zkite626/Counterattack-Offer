# 逆袭Offer 升级文档索引

本目录为《逆袭Offer》平台升级后的主文档体系。旧版 Next.js 全栈 Web MVP 文档已归档到 `docs/archive/frontend-mvp/`，作为前端实现、视觉系统和既有功能行为的历史参考。

## 当前升级目标

本次升级将平台从「前端全栈 MVP」演进为「前后端分离 + 可独立部署 + 可移动端接入」的产品化架构：

- 前端继续使用 Next.js 16，可部署到 Vercel
- 后端新增 NestJS API 服务，部署在独立服务器
- 数据库使用 PostgreSQL，承载用户、模型、求职流程、简历和审计数据
- 仓库采用单项目管理前后端：`frontend/` 存放前端，`backend/` 存放后端
- 每个用户可设置自己的 OpenAI 兼容模型和 API Key
- 管理员可设置全局默认模型、全局 API Key、SMTP 邮箱和用户管理策略
- API 设计面向 Web、移动端和未来第三方客户端复用
- 开发过程鼓励使用相关 Codex Skills/Plugins 辅助规格梳理、实现、调试、测试、代码审查和部署排障

## 文档索引

| # | 文档 | 说明 |
|---|------|------|
| 00 | `00_PROJECT_OVERVIEW.md` | 升级版项目总览 |
| 01 | `01_TECH_ARCHITECTURE.md` | 前后端分离技术架构 |
| 02 | `02_DATA_MODELS.md` | PostgreSQL 数据模型与 TypeScript 类型 |
| 03 | `03_API_SPECIFICATION.md` | NestJS REST/SSE API 规格 |
| 04 | `04_AI_SERVICE_DESIGN.md` | AI 模型、密钥加密和调用链路 |
| 05 | `05_AUTH_DESIGN.md` | 认证、权限、邮箱验证和找回密码 |
| 06 | `06_UI_UX_DESIGN_SYSTEM.md` | UI/UX 与 Next.js 前端接入升级方案 |
| 07 | `07_ADMIN_CONSOLE_DESIGN.md` | 管理员后台设计 |
| 08 | `08_MAIL_SMTP_DESIGN.md` | SMTP 与邮件通知设计 |
| 09 | `09_MOBILE_API_DESIGN.md` | 移动端 API 接入设计 |
| 10 | `10_STATE_AND_DATA_FLOW.md` | Web/后端状态与数据流 |
| 11 | `11_SSD_WAVE_DEVELOPMENT.md` | SSD 驱动开发与 Wave 机制 |
| 12 | `12_UPGRADE_SCOPE_ROADMAP.md` | 升级范围与 Wave 路线图 |
| 13 | `13_DEVELOPMENT_TASKS.md` | 开发任务拆分 |
| 14 | `14_TEST_ACCEPTANCE.md` | 测试与验收清单 |
| 15 | `15_DEPLOYMENT_GUIDE.md` | Vercel 前端 + 独立后端部署 |
| 16 | `16_SECURITY_NOTES.md` | 安全、加密、CORS 与合规注意事项 |
| 17 | `17_OPERATIONS_OBSERVABILITY.md` | 运维、日志、监控与审计 |
| 18 | `18_ARCHIVE_INDEX.md` | 旧前端文档归档索引 |

## Wave 提示词

升级开发提示词位于 `docs/prompts/`，从 Wave 10 开始延续旧版 Wave 1-9 的历史：

- `docs/prompts/wave10_prompt.md` — 后端基础设施 + 数据库
- `docs/prompts/wave11_prompt.md` — 认证权限 + 邮箱能力
- `docs/prompts/wave12_prompt.md` — AI 模型管理 + 加密密钥
- `docs/prompts/wave13_prompt.md` — 求职业务 API 迁移
- `docs/prompts/wave14_prompt.md` — 前端接入后端 API
- `docs/prompts/wave15_prompt.md` — 移动端 API 契约 + 部署
- `docs/prompts/wave16_prompt.md` — 安全加固 + 运维观测
