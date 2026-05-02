# AGENTS.md — 逆袭Offer AI 辅助开发规则

## 1. 项目简介

《逆袭Offer：面向低经验大学生的 AI 求职突围智能体》是一个 Next.js 15 全栈 Web MVP。

技术栈：Next.js 15 App Router + TypeScript + Vanilla CSS + jose JWT + OpenAI 兼容协议。

## 2. 必读文档

开始任何开发任务前，必须阅读以下文档：

- `docs/00_PROJECT_OVERVIEW.md` — 项目总览
- `docs/01_TECH_ARCHITECTURE.md` — 技术架构
- `docs/02_DATA_MODELS.md` — 数据模型（TypeScript 类型）
- `docs/06_UI_UX_DESIGN_SYSTEM.md` — 设计系统（CSS Variables）
- 当前 Wave 对应的 `docs/codex_prompts/waveN_prompt.md`

## 3. 目录规范

```
src/
├── app/            # Next.js App Router 页面和 API
├── components/
│   ├── ui/         # 基础 UI 组件
│   ├── layout/     # 布局组件
│   └── business/   # 业务组件
├── lib/            # 工具库（auth, ai, repository, utils）
├── hooks/          # 自定义 React Hooks
├── contexts/       # React Context Providers
├── types/          # TypeScript 类型定义
├── data/           # Demo 数据
└── prompts/        # AI Prompt 模板
```

## 4. 编码规范

### 必须遵守

1. **TypeScript 严格模式**：不使用 `any`，所有变量有明确类型
2. **CSS 方案**：只使用 Vanilla CSS + CSS Variables，不使用 TailwindCSS 或 CSS-in-JS
3. **CSS 类名**：BEM-like 命名（`.component__element--modifier`）
4. **组件导出**：每个组件文件默认导出组件
5. **API Route 格式**：统一返回 `{ success: boolean, data?: T, error?: { code, message } }`
6. **错误处理**：所有 async 函数必须 try/catch
7. **中文注释**：复杂逻辑必须加中文注释
8. **响应式**：所有页面必须支持手机/平板/桌面三端
9. **暗色模式**：使用 `var(--color-xxx)` 语义色，不硬编码颜色值

### 禁止事项

- ❌ 不使用 `any` 类型
- ❌ 不硬编码颜色/字体/间距，必须使用 CSS Variables
- ❌ 不在前端直接调用第三方 AI API
- ❌ 不在 `NEXT_PUBLIC_` 中存放敏感信息
- ❌ 不安装文档之外的第三方依赖（需先确认）
- ❌ 不删除已有的中文注释

## 5. AI 调用规范

1. 所有 AI 调用通过 `/api/ai/*` API Route 代理
2. 使用 `src/lib/ai/client.ts` 中的 `AIClient` 类
3. Prompt 模板在 `src/prompts/*.ts` 中管理
4. 要求 AI 输出 JSON 时使用 `response_format: { type: "json_object" }`
5. 所有 AI 响应必须类型化解析

## 6. 样式规范

1. 全局变量在 `src/app/globals.css` 中定义
2. 组件样式使用同目录 `.css` 文件
3. 使用 `var(--xxx)` 引用 Design Token
4. 暗色模式通过 `[data-theme="dark"]` 选择器覆盖
5. 响应式使用 `@media (min-width: Npx)` 移动端优先

## 7. 状态管理规范

1. 全局状态使用 React Context（ThemeContext, AuthContext, AIContext, JobFlowContext）
2. 每次 dispatch 后自动持久化到 localStorage
3. 页面刷新自动恢复状态
4. 不使用 Redux / Zustand / Jotai 等第三方库

## 8. 测试前检查清单

完成代码后，检查：

- [ ] TypeScript 无编译错误
- [ ] 页面在亮色和暗色模式下正常
- [ ] 页面在手机宽度（375px）下正常
- [ ] API 调用有 loading 和 error 状态处理
- [ ] 不存在硬编码颜色值
- [ ] 中文注释完整

## 9. Git 提交规范

```
feat: 功能描述
fix: 修复描述
style: 样式调整
refactor: 重构
docs: 文档更新
```
