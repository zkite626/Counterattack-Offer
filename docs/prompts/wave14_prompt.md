# Wave 14 开发提示词 — 前端接入 NestJS API + 管理员 UI

```
你是一个资深 Next.js 前端工程师，正在将《逆袭Offer》前端从本地/Next API 迁移到独立 NestJS 后端。

## 必读文档

- AGENTS.md
- docs/03_API_SPECIFICATION.md
- docs/06_UI_UX_DESIGN_SYSTEM.md
- docs/07_ADMIN_CONSOLE_DESIGN.md
- docs/10_STATE_AND_DATA_FLOW.md
- docs/15_DEPLOYMENT_GUIDE.md
- docs/archive/frontend-mvp/06_UI_UX_DESIGN_SYSTEM.md
- docs/archive/frontend-mvp/08_COMPONENT_SPECIFICATION.md

## 目标

1. 新增统一 API Client
2. AuthContext、AIContext、JobFlowContext、ResumeBuilder 改接后端 API
3. 移除前端 API Key 本地持久化
4. 新增管理员后台
5. 验证 Vercel 前端访问独立后端的 CORS 和 Cookie

## 任务

### 14.1 API Client

- `src/lib/api/client.ts`
- 自动处理 JSON、错误、requestId
- Web 请求 `credentials: include`
- Access Token 内存管理
- 401 自动 refresh

### 14.2 认证迁移

- 登录/注册/找回密码/邮箱验证页面改接 `/auth/*`
- AuthContext 从 `/auth/me` 或 `/auth/refresh` 恢复用户

### 14.3 模型设置页迁移

- 使用 `/ai/models`
- 只显示 Key 掩码
- 测试连接调用后端

### 14.4 求职流程页面迁移

- 个人档案、AI 结果和流程状态从后端恢复
- localStorage 只保留草稿和 UI 偏好

### 14.5 管理员后台

- `/admin/users`
- `/admin/ai-models`
- `/admin/smtp`
- `/admin/audit-logs`
- `/admin/stats`

### 14.6 Vercel 接入

- 使用 `NEXT_PUBLIC_API_BASE_URL`
- 生产域名加入后端 CORS 白名单
- 验证跨域 Cookie 和 Bearer Header

## 验收标准

- Vercel 前端可登录独立后端
- 刷新页面后登录态恢复
- 用户模型不再存 localStorage Key
- 核心业务页面刷新后数据恢复
- 非管理员访问管理员页面显示 403
- 新页面亮色/暗色/移动端适配正常
```
