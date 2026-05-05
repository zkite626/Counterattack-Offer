# 18 — 旧前端文档归档索引

## 18.1 归档位置

旧版 Next.js 全栈 Web MVP 文档已归档：

```
docs/archive/frontend-mvp/
```

旧 Wave 提示词已归档：

```
docs/archive/frontend-mvp/codex_prompts/
```

## 18.2 归档原则

归档文档不再作为升级版主架构依据，但仍可用于：

- 还原前端页面和交互设计
- 查阅旧 Prompt 和 AI 输出格式
- 参考旧 CSS Variables 和组件规范
- 追溯 Wave 1-9 的实现背景
- 做前端迁移时对照旧行为

## 18.3 归档文档清单

| 文档 | 旧说明 | 新用途 |
|------|--------|--------|
| `00_PROJECT_OVERVIEW.md` | 旧 MVP 项目总览 | 前端 MVP 背景 |
| `01_TECH_ARCHITECTURE.md` | 旧 Next.js 全栈架构 | 迁移对照 |
| `02_DATA_MODELS.md` | 旧 TypeScript 类型 | 后端 DTO 迁移参考 |
| `03_API_SPECIFICATION.md` | 旧 Next.js API Routes | NestJS API 迁移参考 |
| `04_AI_SERVICE_DESIGN.md` | 旧 AI 服务设计 | Prompt 和 JSON 解析参考 |
| `05_AUTH_DESIGN.md` | 旧 JWT 认证 | 认证迁移参考 |
| `06_UI_UX_DESIGN_SYSTEM.md` | UI/UX 设计系统 | 继续作为 Web 视觉参考 |
| `07_PAGE_ROUTES_FLOW.md` | 页面路由流程 | 前端路由参考 |
| `08_COMPONENT_SPECIFICATION.md` | 组件规格 | 继续作为组件参考 |
| `09_PROMPT_TEMPLATES.md` | Prompt 模板 | 后端 Prompt 迁移参考 |
| `10_STATE_MANAGEMENT.md` | React Context 状态 | 前端状态迁移参考 |
| `11_DEMO_DATA.md` | 李同学案例 | 示例数据参考 |
| `12_MVP_SCOPE_ROADMAP.md` | 旧 Wave 路线图 | Wave 历史 |
| `13_DEVELOPMENT_TASKS.md` | 旧任务拆分 | 旧任务历史 |
| `14_TEST_ACCEPTANCE.md` | 旧验收清单 | 回归测试参考 |
| `15_DEPLOYMENT_GUIDE.md` | 旧部署指南 | 前端部署历史 |
| `16_SECURITY_NOTES.md` | 旧安全说明 | 安全升级对照 |
| `17_RESUME_BUILDER_DESIGN.md` | 简历创建器设计 | 简历功能继续参考 |

## 18.4 当前文档优先级

当旧文档与当前升级文档冲突时，以当前 `docs/` 根目录文档为准。

优先级：

1. 当前 Wave 提示词：`docs/prompts/waveN_prompt.md`
2. 当前升级文档：`docs/*.md`
3. 归档前端文档：`docs/archive/frontend-mvp/*.md`

