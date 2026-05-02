# Wave 1 开发提示词 — 项目骨架 + 设计系统 + JWT 认证

```
你是一个资深全栈工程师，正在开发《逆袭Offer：面向低经验大学生的 AI 求职突围智能体》Web MVP。

## 必读文档

开始前必须阅读以下文档：
- AGENTS.md（开发规则）
- docs/00_PROJECT_OVERVIEW.md（项目总览）
- docs/01_TECH_ARCHITECTURE.md（技术架构）
- docs/05_AUTH_DESIGN.md（认证设计）
- docs/06_UI_UX_DESIGN_SYSTEM.md（设计系统）
- docs/08_COMPONENT_SPECIFICATION.md（组件规格）

## Wave 1 任务

### 任务 1.1：项目初始化

使用以下命令初始化项目：
```bash
npx -y create-next-app@latest ./ --typescript --app --eslint --src-dir --no-tailwind --import-alias "@/*"
```

安装依赖：
```bash
npm install jose bcryptjs uuid
npm install -D @types/bcryptjs @types/uuid
```

### 任务 1.2：全局 CSS 设计系统

在 `src/app/globals.css` 中实现完整的 Design Token 系统：
- 品牌色（靛蓝紫为主色）
- 强调色（翡翠绿）
- 中性色阶梯
- 语义色（背景、文字、边框）
- 暗色模式变量（`[data-theme="dark"]`）
- 排版（Inter + Noto Sans SC）
- 间距、圆角、阴影
- 入场动画 keyframes
- 渐变定义

所有颜色和尺寸参考 `docs/06_UI_UX_DESIGN_SYSTEM.md`。

### 任务 1.3：Google Fonts

在 `src/app/layout.tsx` 中引入 Inter、Noto Sans SC、Outfit 字体。使用 `next/font` 或 `<link>` 方式引入。

### 任务 1.4：基础 UI 组件

在 `src/components/ui/` 中实现：
- **Button**：primary/secondary/ghost/danger 四种变体，sm/md/lg 三种尺寸，loading 状态
- **Card**：default/glass/gradient 三种变体，hoverable 效果
- **Input**：label + error + helper 支持，focus 动画
- **Tag**：default/success/warning/danger 四色，可选 removable
- **Modal**：遮罩 + 居中弹窗，sm/md/lg 尺寸

每个组件必须使用 CSS Variables，支持暗色模式。参考 `docs/08_COMPONENT_SPECIFICATION.md`。

### 任务 1.5：ThemeContext + ThemeToggle

创建 `src/contexts/ThemeContext.tsx`：
- 管理 'light' | 'dark' | 'system' 三种主题
- 持久化到 localStorage
- 设置 `document.documentElement.setAttribute('data-theme', resolved)`
- 监听系统主题变化

创建 `src/components/ui/ThemeToggle.tsx`：三态切换按钮（☀️/🌙/🖥️）

### 任务 1.6：JWT 工具

创建 `src/lib/auth/jwt.ts`：
- `signToken(payload, rememberMe?)` — 签发 JWT（HS256, jose 库）
- `verifyToken(token)` — 验证 JWT
- 默认有效期 7d，记住我 30d

### 任务 1.7：用户 Repository

创建 `src/lib/repository/`：
- `interface.ts` — IUserRepository 接口
- `memory.ts` — 内存实现（从环境变量初始化管理员）
- `index.ts` — 工厂函数

参考 `docs/05_AUTH_DESIGN.md` §5.4。

### 任务 1.8：Auth API Routes

创建四个 API Route：
- `POST /api/auth/register` — 注册
- `POST /api/auth/login` — 登录（设置 HttpOnly Cookie）
- `GET /api/auth/me` — 获取当前用户
- `POST /api/auth/logout` — 登出（清除 Cookie）

参考 `docs/03_API_SPECIFICATION.md` §3.1。

### 任务 1.9：Middleware

创建 `src/middleware.ts`：
- 保护 /api/ai/* 路由
- 保护 Dashboard 页面
- 已登录用户重定向

参考 `docs/05_AUTH_DESIGN.md` §5.3。

### 任务 1.10：AuthContext + useAuth

创建 `src/contexts/AuthContext.tsx`：
- 管理 user, isLoading, isAuthenticated 状态
- 提供 login, register, logout 方法
- 挂载时调用 /api/auth/me 验证登录状态

### 任务 1.11：登录/注册页

创建 Auth 布局和页面：
- `src/app/(auth)/layout.tsx` — 居中卡片布局，渐变背景
- `src/app/(auth)/login/page.tsx` — 登录表单（邮箱+密码+记住我+注册链接）
- `src/app/(auth)/register/page.tsx` — 注册表单（邮箱+密码+姓名+登录链接）

设计要求：精美、专业、有品牌感。

### 任务 1.12：Dashboard Layout

创建 `src/app/(dashboard)/layout.tsx`：
- Header 组件（Logo + 应用名 + ThemeToggle + 用户菜单）
- Sidebar 骨架（导航项列表，当前路径高亮）
- 主内容区域

### 任务 1.13：环境变量

创建 `.env.local.example`，包含所有需要的环境变量。

## 验收标准

1. `npm run dev` 无错误启动
2. 可注册新用户并自动登录
3. 可登录已有用户
4. 暗色模式可切换且持久化
5. 未登录访问 /profile 重定向到 /login
6. 已登录访问 /login 重定向到 /profile
7. 所有 UI 组件在亮色和暗色下正常显示
8. 手机端（375px）布局不破裂
```
