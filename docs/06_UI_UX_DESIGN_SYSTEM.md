# 06 — UI/UX 与前端接入升级文档

## 6.1 前端定位

现有 Next.js 前端继续作为 Web 主客户端。旧版 UI/UX、组件规范和简历创建器文档已归档到：

```
docs/archive/frontend-mvp/
```

升级后前端重点从「本地状态 + Next.js API Routes」迁移为「远程 NestJS API + 服务端持久化」。

## 6.2 必须保留的 UI/UX 规范

1. TypeScript 严格模式，不使用 `any`
2. Vanilla CSS + CSS Variables，不引入 TailwindCSS 或 CSS-in-JS
3. BEM-like CSS 类名
4. 亮色/暗色模式继续使用语义 CSS Variables
5. 响应式覆盖手机、平板、桌面
6. AI 调用不得从前端直连第三方模型 API

## 6.3 API 客户端封装

新增前端 API 层：

```
src/lib/api/
├── client.ts              # fetch 封装
├── auth.ts
├── users.ts
├── ai.ts
├── career-flows.ts
├── resumes.ts
└── admin.ts
```

统一读取：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.offer.example.com/api/v1
```

### `apiClient` 基础行为

- 自动添加 `Content-Type: application/json`
- Web 请求默认 `credentials: "include"`
- 自动注入内存中的 Access Token
- 收到 401 后调用 `/auth/refresh`
- refresh 失败则清空登录态并跳转登录页
- 所有响应解析为 `ApiResponse<T>`

## 6.4 认证状态迁移

旧版 `AuthContext` 从本地 JWT Cookie 读取登录态；新版改为：

```
App 启动
  → GET /auth/me 或 POST /auth/refresh
  → 恢复 user + accessToken
  → AuthContext 提供 user/isAuthenticated/isAdmin
```

前端不应持久化 Refresh Token。

## 6.5 AI 模型管理页迁移

旧版模型配置存在 localStorage。新版设置页改为调用后端：

| 旧行为 | 新行为 |
|--------|--------|
| localStorage 保存模型和 API Key | POST `/ai/models` 保存到数据库 |
| 前端加密 API Key | 后端 AES-256-GCM 加密 |
| 前端传完整 `modelConfig` 给 API Route | 前端只传 `modelConfigId` |
| 默认模型存在 AIContext | 默认模型存在后端用户设置 |

模型列表只展示：

- 名称
- Provider
- Base URL
- Model
- API Key 掩码
- 测试状态
- 是否默认

## 6.6 求职流程状态迁移

旧版 `JobFlowContext` 保存完整 AI 结果到 localStorage。新版：

- 草稿输入可短暂保存在 localStorage，避免刷新丢失
- 已提交的数据写入后端 `career_flow_runs`
- 每一步 AI 结果写入 `career_flow_results`
- 页面刷新后从 API 恢复流程状态

## 6.7 管理员入口

前端新增管理员路由组：

```
src/app/(admin)/
├── layout.tsx
├── users/page.tsx
├── ai-models/page.tsx
├── smtp/page.tsx
├── audit-logs/page.tsx
└── stats/page.tsx
```

路由保护：

- 未登录跳转 `/login`
- 非管理员显示 403 页面
- 管理员 API 错误要展示 `requestId`

管理员用户在工作台头像下拉菜单中可看到「进入后台」入口。管理员后台使用顶部导航栏展示
用户管理、全局模型、邮件设置、审计日志和平台统计，并提供「返回工作台」入口。

## 6.7.1 账号中心

前端新增 `/account` 账号中心，和 `/profile` 学生资料分离：

- `/account` 用于查看账号邮箱、角色、状态、注册时间、最近登录
- 支持用户修改密码、修改邮箱、重新发送邮箱验证邮件
- 修改邮箱后账号状态回到待验证，新邮箱通过验证后恢复正常使用
- `/account` 即使用户尚未配置 AI 模型也可访问，避免账号维护被模型配置流程阻断

用户状态、角色和模型服务商在界面统一展示中文文案。模型密钥只展示掩码和连接状态，页面不出现面向实现细节的文案。
选择常见模型服务商时，模型管理表单会自动填入对应的 OpenAI 兼容接口地址；
用户仍可手动修改该地址以适配代理或自定义服务。

## 6.8 Vercel 部署要求

Vercel 环境变量：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.offer.example.com/api/v1
NEXT_PUBLIC_APP_NAME=逆袭Offer
```

前端不需要数据库连接和 AI Key 环境变量。

### 本地开发代理

本地可通过 Next.js rewrites 代理后端，减少 CORS 调试：

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/backend/:path*',
      destination: 'http://localhost:3001/api/v1/:path*',
    },
  ];
}
```

生产环境仍直接访问 `NEXT_PUBLIC_API_BASE_URL`，由后端 CORS 白名单放行 Vercel 域名。

## 6.9 与旧 UI 文档的关系

新文档不重复维护完整视觉系统。视觉细节继续参考：

- `docs/archive/frontend-mvp/06_UI_UX_DESIGN_SYSTEM.md`
- `docs/archive/frontend-mvp/08_COMPONENT_SPECIFICATION.md`
- `docs/archive/frontend-mvp/17_RESUME_BUILDER_DESIGN.md`

升级时只修改数据接入、状态恢复、管理员页面和跨域认证相关 UI。
