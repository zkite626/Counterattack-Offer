# 12 — MVP 范围与 Wave 路线图

## 12.1 Wave 总览

| Wave | 名称 | 核心目标 | 验收标准 |
|------|------|----------|----------|
| Wave 1 | 项目骨架 + 设计系统 + 认证 | 可运行项目，登录认证，暗色模式 | 可登录/注册，主题切换正常 |
| Wave 2 | AI 服务层 + 模型管理 | AI 调用链路跑通 | 可添加模型、测试连接、调用AI |
| Wave 3 | 核心业务前半段 | 信息→画像→转译→JD→匹配 | 5个页面可走通 |
| Wave 4 | 核心业务后半段 | 简历→面试→计划→报告 | 全流程闭环 |
| Wave 5 | 首页 + 演示模式 + 打磨 | 精美首页，一键演示 | 视觉惊艳，Demo 流畅 |
| Wave 6 | 测试 + 部署 + 优化 | 上线可用 | Lighthouse>85, 无Bug |
| Wave 7 | 简历创建器 | 编辑+预览+导出简历 | 三栏编辑器，3个模板，AI预填充，PDF导出 |
| Wave 8 | 全站视觉升级 | Emoji→IconFont、国内资源、样式统一 | 全站无emoji图标、本地字体、暗色/响应式完美 |

---

## 12.2 Wave 1 — 项目骨架 + 设计系统 + JWT 认证

### 目标
搭建完整项目基础：Next.js 初始化、全局 CSS 设计系统、JWT 认证流程、基础布局。

### 任务清单

| # | 任务 | 输出文件 |
|---|------|----------|
| 1.1 | Next.js 16 项目初始化（TypeScript, App Router） | `package.json`, `tsconfig.json`, `next.config.ts` |
| 1.2 | 全局 CSS 设计系统（Design Tokens + 暗色模式） | `globals.css` |
| 1.3 | Google Fonts 引入（Inter + Noto Sans SC + Outfit） | `layout.tsx` |
| 1.4 | 基础 UI 组件（Button, Card, Input, Tag, Modal） | `components/ui/` |
| 1.5 | ThemeContext + ThemeToggle | `contexts/ThemeContext.tsx` |
| 1.6 | JWT 工具（jose 签发/验证） | `lib/auth/jwt.ts` |
| 1.7 | 用户 Repository（内存实现 + 接口） | `lib/repository/` |
| 1.8 | Auth API Routes（login, register, me, logout） | `app/api/auth/` |
| 1.9 | Proxy 路由保护 | `proxy.ts` |
| 1.10 | AuthContext + useAuth Hook | `contexts/AuthContext.tsx` |
| 1.11 | 登录页 + 注册页 | `app/(auth)/` |
| 1.12 | Dashboard Layout（Header + Sidebar 骨架） | `app/(dashboard)/layout.tsx` |
| 1.13 | 环境变量模板 | `.env.local.example` |

### 验收标准
- `npm run dev` 正常启动
- 可注册新用户、登录、查看用户信息
- 暗色模式正常切换
- 未登录访问 Dashboard 自动跳转登录
- 已登录访问登录页自动跳转 Dashboard

---

## 12.3 Wave 2 — AI 服务层 + 模型管理

### 目标
实现 OpenAI 兼容 AI 调用层，用户可管理模型。

### 任务清单

| # | 任务 | 输出文件 |
|---|------|----------|
| 2.1 | AIClient 统一封装（fetch 调用 Chat Completions） | `lib/ai/client.ts` |
| 2.2 | 内置模型配置 | `lib/ai/models.ts` |
| 2.3 | Prompt 模板加载系统 | `lib/ai/prompts.ts`, `prompts/*.ts` |
| 2.4 | SSE 流式响应处理 | `lib/ai/stream.ts` |
| 2.5 | API Key 加密工具 | `lib/utils/crypto.ts` |
| 2.6 | AIContext + useAI Hook | `contexts/AIContext.tsx` |
| 2.7 | 模型管理页面（列表 + 添加 + 编辑 + 删除 + 测试） | `app/(dashboard)/settings/page.tsx` |
| 2.8 | AI 代理 API Route（通用 chat） | `app/api/ai/chat/route.ts` |
| 2.9 | 连接测试 API Route | `app/api/ai/test-connection/route.ts` |

### 验收标准
- 可添加 DeepSeek 模型并输入 API Key
- 测试连接成功
- 通过 API Route 调用 AI 并收到响应
- 内置模型列表正确显示

---

## 12.4 Wave 3 — 核心业务页面（前半段）

### 目标
实现求职闭环前半段：基础信息 → 画像 → 转译 → JD 解析 → 匹配。

### 任务清单

| # | 任务 | 输出文件 |
|---|------|----------|
| 3.1 | TypeScript 类型定义 | `types/*.ts` |
| 3.2 | JobFlowContext + useJobFlow Hook | `contexts/JobFlowContext.tsx` |
| 3.3 | 步骤导航组件 StepNav | `components/layout/StepNav.tsx` |
| 3.4 | Demo 案例数据 | `data/demo-case.ts` |
| 3.5 | 学生信息页（表单 + 一键导入） | `app/(dashboard)/profile/page.tsx` |
| 3.6 | 画像诊断 Prompt + API Route | `prompts/diagnose.ts`, `api/ai/diagnose/route.ts` |
| 3.7 | 画像诊断页（ScoreRing + 推荐岗位卡片） | `app/(dashboard)/diagnosis/page.tsx` |
| 3.8 | 经历转译 Prompt + API Route | `prompts/translate-experience.ts`, `api/ai/translate/route.ts` |
| 3.9 | 经历转译页（ExperienceCard 列表） | `app/(dashboard)/translation/page.tsx` |
| 3.10 | JD 解析 Prompt + API Route | `prompts/analyze-job.ts`, `api/ai/analyze-job/route.ts` |
| 3.11 | JD 解析页（文本输入 + 解析结果） | `app/(dashboard)/job/page.tsx` |
| 3.12 | 人岗匹配 Prompt + API Route | `prompts/match-report.ts`, `api/ai/match/route.ts` |
| 3.13 | 人岗匹配页（MatchScoreBoard + RadarChart） | `app/(dashboard)/match/page.tsx` |
| 3.14 | ProgressBar, ScoreRing, RadarChart, Skeleton 组件 | `components/ui/` |

### 验收标准
- 一键导入李同学案例正常工作
- 5 个页面依次走通，AI 返回正确 JSON
- 步骤导航正确高亮和锁定
- 匹配分数雷达图正确渲染

---

## 12.5 Wave 4 — 核心业务页面（后半段）

### 目标
完成求职闭环后半段。

### 任务清单

| # | 任务 |
|---|------|
| 4.1 | 简历优化 Prompt + API Route |
| 4.2 | 简历优化页（ResumeCompare 前后对比） |
| 4.3 | 面试追问 Prompt + API Route |
| 4.4 | 面试追问页（InterviewChat 卡片+对话模式） |
| 4.5 | 能力计划 Prompt + API Route |
| 4.6 | 能力计划页（PlanTimeline 时间轴） |
| 4.7 | 汇总报告 Prompt + API Route |
| 4.8 | 汇总报告页（整合展示） |
| 4.9 | Timeline 组件 |

### 验收标准
- 全 8 个模块可完整走通
- 面试对话支持流式输出
- 报告页整合所有模块数据

---

## 12.6 Wave 5 — 首页 + 演示模式 + 动画打磨

### 任务清单

| # | 任务 |
|---|------|
| 5.1 | 首页 Hero 区（渐变背景 + 核心文案 + CTA） |
| 5.2 | 首页痛点区（卡片网格） |
| 5.3 | 首页解决方案区（步骤流） |
| 5.4 | 首页核心功能区（功能卡片） |
| 5.5 | 一键体验按钮（Demo 模式） |
| 5.6 | 页面过渡动画（slideUp, fadeIn） |
| 5.7 | 卡片入场动画（Intersection Observer） |
| 5.8 | 分数动画（计数递增） |
| 5.9 | 响应式全面检查 |
| 5.10 | 暗色模式全面适配 |
| 5.11 | SEO Meta Tags |

---

## 12.7 Wave 6 — 测试 + 部署 + 优化

### 任务清单

| # | 任务 |
|---|------|
| 6.1 | 核心流程手动 E2E 测试 |
| 6.2 | API 错误处理测试 |
| 6.3 | 响应式布局测试（Chrome DevTools） |
| 6.4 | Lighthouse 性能优化 |
| 6.5 | Vercel 部署配置 |
| 6.6 | README.md 完善 |
| 6.7 | 环境变量文档 |

---

## 12.8 Wave 7 — 简历创建器（Resume Builder）

### 目标
提供完整的简历编辑、实时预览、多模板选择和 PDF 导出能力，将 AI 优化结果转化为可投递的简历。

### 设计文档
详见 `docs/17_RESUME_BUILDER_DESIGN.md`。

### 任务清单

| # | 任务 | 输出文件 |
|---|------|----------|
| 7.1 | 简历构建器类型定义 | `types/resume-builder.ts` |
| 7.2 | ResumeBuilderContext + Hook | `contexts/ResumeBuilderContext.tsx`, `hooks/useResumeBuilder.ts` |
| 7.3 | 模板系统（经典/现代/应届生） | `components/resume-templates/registry.ts`, `classic/`, `modern/`, `fresh-grad/`, `templates.css` |
| 7.4 | 模块导航组件 SectionNavigator | `components/business/SectionNavigator.tsx` |
| 7.5 | 编辑面板 SectionEditor（6个子面板） | `components/business/SectionEditor.tsx`, `editor-panels/*.tsx` |
| 7.6 | A4 预览组件 ResumePreview | `components/business/ResumePreview.tsx` |
| 7.7 | 工具栏 EditorToolbar | `components/business/EditorToolbar.tsx` |
| 7.8 | 简历列表页 | `app/(dashboard)/resume-builder/page.tsx` |
| 7.9 | 编辑工作台页（三栏布局） | `app/(dashboard)/resume-builder/[id]/page.tsx` |
| 7.10 | AI 预填充逻辑 | `lib/utils/resume-builder.ts` |
| 7.11 | PDF 导出（@media print） | `globals.css` 追加 |
| 7.12 | 集成入口（侧边栏 + 简历优化页 + 报告页） | 多文件更新 |

### 验收标准
- 可新建空白简历和从 AI 结果创建简历
- 三栏编辑器正常工作，编辑实时预览
- 3 个模板可切换
- 模块排序和显隐正常
- PDF 导出正确
- 数据 localStorage 持久化
- 响应式布局正常

---

## 12.9 Wave 8 — 全站视觉升级 + 图标体系统一 + 国内资源替换

### 目标
彻底移除所有 emoji 图标、统一全站视觉风格、替换为国内可用资源、修复 Next.js 16 构建警告、品牌资源就位。

### 设计文档
详见 `docs/codex_prompts/wave8_prompt.md`。

### 任务清单

| # | 任务 | 说明 |
|---|------|------|
| 8.1 | Logo 和 Favicon 资源迁移 | 品牌资源移入 `public/`，更新 layout.tsx metadata |
| 8.2 | Google Fonts 替换为国内 CDN | 本地字体 woff2 托管到 `public/fonts/`，移除 Google CDN 链接 |
| 8.3 | 全面替换 Emoji 为 IconFont 图标 | 首页/侧边栏/StepNav/功能页/认证页/错误页 全部替换 |
| 8.4 | 新增缺失的 IconSprite 图标 | 补充 fire/award/book/chat/handshake/puzzle 等图标 |
| 8.5 | 全站样式统一 | 卡片/按钮/间距/排版/空状态/Loading 统一规范 |
| 8.6 | 首页视觉增强 | Logo 展示、痛点卡片色条、步骤流连线、功能卡片渐变 |
| 8.7 | Dashboard 侧边栏视觉优化 | Logo、导航项图标、当前页高亮、移动端动画 |
| 8.8 | 功能页面逐页美化 | 10+ 个功能页逐一检查并优化（参照统一样式规范） |
| 8.9 | 认证页面美化 | 登录/注册页 Logo + 输入框图标 + Loading 态 |
| 8.10 | 错误和空状态页面美化 | 404/Error/Loading 页面统一品牌风格 |
| 8.11 | 暗色模式全面适配 | 所有新增样式验证暗色模式 |
| 8.12 | 响应式全面检查 | 375px ~ 1536px 全断点验证 |
| 8.13 | ~~修复 middleware 弃用警告~~ | ✅ 已完成：`middleware.ts` → `proxy.ts`，导出函数名 `proxy` |
| 8.14 | 构建验证 | `npm run build` 无报错/警告，逐页验证亮色/暗色/响应式 |

### 验收标准
- 全站无 emoji 作为图标使用，所有图标通过 `<Icon>` 组件渲染
- IconSprite 中的图标覆盖所有使用场景
- 所有页面卡片、按钮、间距、排版风格统一
- Google Fonts 替换为本地字体，国内可正常加载
- `/favicon.ico` 和 `/logo-square.png`、`/logo-wide.png` 在 `public/` 下正确引用
- 侧边栏和首页正确展示品牌 Logo
- `npm run build` 无 middleware 弃用警告
- 暗色模式下所有图标、卡片、背景正常
- 响应式在 375px ~ 1536px 范围内正常
- Lighthouse Performance > 90, Accessibility > 95

