# 13 — 开发任务拆分

## Wave 1 — 项目骨架 + 设计系统 + JWT 认证

### TASK-1.1 项目初始化

| 字段 | 内容 |
|------|------|
| 目标 | 使用 `npx create-next-app` 初始化 Next.js 16 项目 |
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

### TASK-1.9 Proxy（路由保护）

| 字段 | 内容 |
|------|------|
| 目标 | JWT 路由保护 |
| 文件 | `middleware.ts` |
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
- 架构参考：`docs/01_TECH_ARCHITECTURE.md`（middleware.ts 路由保护）

---

## Wave 9 — 移除 Demo 模式 + JSON 解析修复 + 新模板 + 随机样式 + PDF 优化

### TASK-9.1 移除 Demo 模式

| 字段 | 内容 |
|------|------|
| 目标 | 删除 Demo 模式和 Mock 数据，所有功能强制调用真实 AI 接口 |
| 变更 | 移除首页 Demo 按钮、Dashboard Demo Banner、JobFlowContext LOAD_DEMO action、report 页面 Demo 自动加载 |
| 验收 | 无法绕过 API Key 配置，所有 AI 模块均调用真实接口 |

### TASK-9.2 李同学数据改为表单填充

| 字段 | 内容 |
|------|------|
| 目标 | 将李同学数据从 Demo 预填充改为表单快速填充 |
| 变更 | profile 页面「填充李同学数据」按钮仅填充表单字段，点击「开始 AI 诊断」后调用真实 AI |
| 验收 | 填充后表单显示李同学数据，提交后 AI 实时分析 |

### TASK-9.3 JSON 解析容错

| 字段 | 内容 |
|------|------|
| 目标 | 修复 AI 返回 Markdown 围栏导致的 `Unexpected token` 错误 |
| 新增 | `lib/utils/parse-json.ts` — `parseAIJson()` 函数 |
| 变更 | 所有 7 个 AI API Route 使用 `parseAIJson()` 替代 `JSON.parse()` |
| 验收 | AI 返回 ` ```json {...} ``` ` 格式时正常解析 |

### TASK-9.4 AI 综合建议显示优化

| 字段 | 内容 |
|------|------|
| 目标 | 报告页面 AI 综合建议显示为正常文本而非 Markdown 原始格式 |
| 变更 | 新增 `renderMarkdownToText()` 函数，将 Markdown 转为 React 元素 |
| 验收 | 标题、列表、段落正常渲染，无 `#`、`*` 等 Markdown 符号 |

### TASK-9.5 修复简历编辑器跳回基本信息

| 字段 | 内容 |
|------|------|
| 目标 | 修复编辑简历时每次保存都跳回「基本信息」面板的 bug |
| 原因 | `SET_ACTIVE_RESUME` 每次重置 `activeSection` 为 `"basic"`；`useEffect` 依赖 `state.resumes` 导致重复触发 |
| 变更 | 移除 `SET_ACTIVE_RESUME` 中的 `activeSection` 重置；`useEffect` 仅依赖 `resumeId` |
| 验收 | 编辑任意模块时切换不会跳回基本信息 |

### TASK-9.6 新增 3 个简历模板

| 字段 | 内容 |
|------|------|
| 目标 | 新增极简留白、时间轴、科技感 3 个差异化模板 |
| 新增 | `components/resume-templates/minimal/`、`timeline/`、`tech/` |
| 注册 | 更新 `registry.ts`，总计 10 个模板 |
| 验收 | 模板选择弹窗显示 10 个模板，切换正常 |

### TASK-9.7 随机样式功能

| 字段 | 内容 |
|------|------|
| 目标 | 在简历编辑工具栏新增「随机样式」按钮 |
| 变更 | `EditorToolbar.tsx` 新增 `handleRandomStyle()` 函数 |
| 验收 | 点击后随机切换模板、字体和主题色 |

### TASK-9.8 PDF 导出优化

| 字段 | 内容 |
|------|------|
| 目标 | 导出 PDF 时隐藏导航栏等 UI，文件名为「姓名 - 简历.pdf」 |
| 变更 | `dashboard.css` 添加 `@media print` 隐藏 header/sidebar/stepnav；`EditorToolbar.tsx` 设置 `document.title` |
| 验收 | 导出 PDF 只显示简历内容，文件名包含姓名 |
