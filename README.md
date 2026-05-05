# 逆袭Offer

面向低经验大学生的 AI 求职突围平台。当前仓库采用前后端分离结构：

```text
counterattack-offer/
├── frontend/   # Next.js 16 Web 前端，Vercel Root Directory 指向这里
├── backend/    # NestJS API 后端，独立部署
├── docs/       # 升级文档与 Wave 规格
└── package.json
```

## 本地开发

```bash
npm install
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
npm run dev:frontend
npm run dev:backend
```

前端环境变量：

| 变量 | 示例 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001/api/v1` | NestJS 后端 API 基础地址 |
| `NEXT_PUBLIC_APP_NAME` | `逆袭Offer` | 前端展示的应用名称 |

敏感配置只放在后端环境变量中，例如数据库连接、JWT Secret、AI API Key、SMTP 密码和加密主密钥。

后端环境变量见 [backend/.env.example](backend/.env.example)，每一项都带有用途说明；生产环境可参考 [backend/.env.production.example](backend/.env.production.example)。

## 数据库初始化

后端会在检测到 `users` 表为空时自动完成首次初始化：

- 使用 `ADMIN_EMAIL` / `ADMIN_PASSWORD` 创建默认管理员，当前模板值为 `admin@nixioffer.com` / `Admin@123`
- 写入 `system.bootstrap` 标记
- 写入 `system.admin.bootstrap` 审计日志

这一步只在空库第一次启动时执行，不会覆盖已有用户或业务数据。
空库启动时如果缺少 `ADMIN_EMAIL` 或 `ADMIN_PASSWORD`，后端会拒绝启动。
首次登录后请尽快修改默认管理员密码。

## 账号与后台

- 普通用户在 `/account` 维护登录邮箱和密码，在 `/profile` 维护求职资料
- `/qa` 提供求职 AI 问答，可结合当前资料流式回答，也能在没有资料时直接聊天
- 管理员登录后可从工作台头像下拉菜单进入后台，再访问 `/admin/users`
- 管理后台支持新增/删除用户、角色/状态维护、用户密码重置、重发验证邮件、全局模型、SMTP、审计日志和统计面板
- 模型服务商在界面展示中文名称，密钥仅展示掩码和连接状态

## 部署要点

- Vercel Root Directory: `frontend`
- 前端环境变量: `NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1`
- 后端 `CORS_ORIGINS` 必须包含 Vercel 域名和自定义前端域名
- 后端 CORS 必须启用 `credentials: true`
- Web 登录使用 HttpOnly Refresh Cookie + 内存 Access Token，移动端可使用 Bearer Token
- 后端空库初始化账号完全按 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 环境变量生成，模板默认值为 `admin@nixioffer.com` / `Admin@123`
