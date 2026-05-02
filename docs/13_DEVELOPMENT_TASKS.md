# 13 — 开发任务拆分

## Wave 1 — 项目骨架 + 设计系统 + JWT 认证

### TASK-1.1 项目初始化

| 字段 | 内容 |
|------|------|
| 目标 | 使用 `npx create-next-app` 初始化 Next.js 15 项目 |
| 命令 | `npx -y create-next-app@latest ./ --typescript --app --eslint --src-dir --no-tailwind --import-alias "@/*"` |
| 验收 | `npm run dev` 正常启动，访问 `localhost:3000` 显示默认页 |

### TASK-1.2 安装依赖

| 字段 | 内容 |
|------|------|
| 依赖 | `jose bcryptjs uuid` |
| 类型 | `@types/bcryptjs @types/uuid` |
| 命令 | `npm install jose bcryptjs uuid && npm install -D @types/bcryptjs @types/uuid` |

### TASK-1.3 全局 CSS 设计系统

| 字段 | 内容 |
|------|------|
| 目标 | 实现完整 Design Token 系统 |
| 文件 | `src/app/globals.css` |
| 内容 | 颜色、排版、间距、圆角、阴影、动画、暗色模式变量 |
| 参考 | `docs/06_UI_UX_DESIGN_SYSTEM.md` |

### TASK-1.4 基础 UI 组件

| 字段 | 内容 |
|------|------|
| 目标 | 实现 Button, Card, Input, Tag, Modal 组件 |
| 文件 | `src/components/ui/*.tsx` + 对应 CSS |
| 参考 | `docs/08_COMPONENT_SPECIFICATION.md` |

### TASK-1.5 ThemeContext

| 字段 | 内容 |
|------|------|
| 目标 | 主题状态管理 + ThemeToggle 组件 |
| 文件 | `src/contexts/ThemeContext.tsx`, `src/components/ui/ThemeToggle.tsx` |
| 参考 | `docs/10_STATE_MANAGEMENT.md` §10.2 |

### TASK-1.6 JWT 工具

| 字段 | 内容 |
|------|------|
| 目标 | 使用 jose 实现 JWT 签发/验证 |
| 文件 | `src/lib/auth/jwt.ts` |
| 参考 | `docs/05_AUTH_DESIGN.md` §5.2 |

### TASK-1.7 用户 Repository

| 字段 | 内容 |
|------|------|
| 目标 | 定义 IUserRepository 接口 + 内存实现 |
| 文件 | `src/lib/repository/interface.ts`, `memory.ts`, `index.ts` |
| 参考 | `docs/05_AUTH_DESIGN.md` §5.4 |

### TASK-1.8 Auth API Routes

| 字段 | 内容 |
|------|------|
| 目标 | 实现 login, register, me, logout |
| 文件 | `src/app/api/auth/*/route.ts` |
| 参考 | `docs/03_API_SPECIFICATION.md` §3.1 |

### TASK-1.9 Middleware

| 字段 | 内容 |
|------|------|
| 目标 | JWT 路由保护 |
| 文件 | `src/middleware.ts` |
| 参考 | `docs/05_AUTH_DESIGN.md` §5.3 |

### TASK-1.10 AuthContext

| 字段 | 内容 |
|------|------|
| 目标 | 认证状态管理 + useAuth Hook |
| 文件 | `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts` |

### TASK-1.11 登录/注册页

| 字段 | 内容 |
|------|------|
| 目标 | Auth 布局 + 登录表单 + 注册表单 |
| 文件 | `src/app/(auth)/layout.tsx`, `login/page.tsx`, `register/page.tsx` |
| 设计 | 居中卡片，渐变背景，精美表单 |

### TASK-1.12 Dashboard Layout

| 字段 | 内容 |
|------|------|
| 目标 | Header（Logo + ThemeToggle + 用户菜单）+ Sidebar 骨架 |
| 文件 | `src/app/(dashboard)/layout.tsx`, `src/components/layout/Header.tsx`, `Sidebar.tsx` |

### TASK-1.13 环境变量

| 字段 | 内容 |
|------|------|
| 文件 | `.env.local.example` |
| 内容 | JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_PUBLIC_APP_NAME |

---

## Wave 2 — AI 服务层 + 模型管理

### TASK-2.1 ~ 2.9

参见 `docs/12_MVP_SCOPE_ROADMAP.md` Wave 2 任务清单。每个任务对应参考文档：`docs/04_AI_SERVICE_DESIGN.md`。

---

## Wave 3 — 核心业务前半段

### TASK-3.1 ~ 3.14

参见 `docs/12_MVP_SCOPE_ROADMAP.md` Wave 3 任务清单。
- 类型定义参考：`docs/02_DATA_MODELS.md`
- Prompt 参考：`docs/09_PROMPT_TEMPLATES.md`
- API 参考：`docs/03_API_SPECIFICATION.md`
- 组件参考：`docs/08_COMPONENT_SPECIFICATION.md`

---

## Wave 4 — 核心业务后半段

### TASK-4.1 ~ 4.9

参见 `docs/12_MVP_SCOPE_ROADMAP.md` Wave 4 任务清单。

---

## Wave 5 — 首页 + 演示模式 + 打磨

### TASK-5.1 ~ 5.11

参见 `docs/12_MVP_SCOPE_ROADMAP.md` Wave 5 任务清单。

---

## Wave 6 — 测试 + 部署

### TASK-6.1 ~ 6.7

参见 `docs/12_MVP_SCOPE_ROADMAP.md` Wave 6 任务清单。

---

## Wave 7 — 简历创建器

### TASK-7.1 ~ 7.12

参见 `docs/12_MVP_SCOPE_ROADMAP.md` Wave 7 任务清单。
- 类型定义：`types/resume-builder.ts`
- 设计文档：`docs/17_RESUME_BUILDER_DESIGN.md`
- 组件规格：`docs/08_COMPONENT_SPECIFICATION.md` §8.3（SectionNavigator/SectionEditor/ResumePreview/EditorToolbar）
- 状态管理：`docs/10_STATE_MANAGEMENT.md` §10.6（ResumeBuilderContext）

---

## Wave 8 — 全站视觉升级 + 图标体系统一 + 国内资源替换

### TASK-8.1 ~ 8.14

参见 `docs/12_MVP_SCOPE_ROADMAP.md` Wave 8 任务清单。
- 设计提示词：`docs/codex_prompts/wave8_prompt.md`
- 组件参考：`docs/08_COMPONENT_SPECIFICATION.md`（Icon / IconSprite）
- 设计系统参考：`docs/06_UI_UX_DESIGN_SYSTEM.md`
- 架构参考：`docs/01_TECH_ARCHITECTURE.md`（proxy.ts 路由保护）
