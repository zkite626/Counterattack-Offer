# Wave 13 开发提示词 — 求职业务 API 迁移

```
你是一个资深全栈业务工程师，正在将《逆袭Offer》旧 Next.js AI API 迁移到 NestJS 后端。

## 必读文档

- AGENTS.md
- docs/02_DATA_MODELS.md
- docs/03_API_SPECIFICATION.md
- docs/04_AI_SERVICE_DESIGN.md
- docs/10_STATE_AND_DATA_FLOW.md
- docs/archive/frontend-mvp/03_API_SPECIFICATION.md
- docs/archive/frontend-mvp/09_PROMPT_TEMPLATES.md

## 目标

1. 学生档案和经历持久化
2. 求职流程 `career_flow_runs` 和步骤结果持久化
3. 画像、转译、JD、匹配、简历、面试、计划、报告全部由 NestJS 提供
4. 简历创建器数据进入 PostgreSQL

## 任务

### 13.1 学生档案

- `GET /users/me/profile`
- `PUT /users/me/profile`
- 经历 CRUD 或随档案保存

### 13.2 求职流程

- `GET /career-flows`
- `POST /career-flows`
- `GET /career-flows/{id}`
- `PATCH /career-flows/{id}`
- `GET /career-flows/{id}/results`

### 13.3 AI 业务接口

- `/ai/diagnose`
- `/ai/translate`
- `/ai/analyze-job`
- `/ai/match`
- `/ai/optimize-resume`
- `/ai/interview`
- `/ai/plan`
- `/ai/report`
- `/ai/generate-jd`

### 13.4 结果保存

每个 AI 接口成功后写入 `career_flow_results`，包含输入快照、输出、模型配置 ID。

### 13.5 简历 API

- `GET /resumes`
- `POST /resumes`
- `GET /resumes/{id}`
- `PATCH /resumes/{id}`
- `POST /resumes/{id}/versions`
- `POST /resumes/{id}/duplicate`

## 验收标准

- 旧前端核心 AI 输出类型保持兼容
- 页面刷新或换设备后可恢复流程结果
- 简历编辑数据进入数据库
- AI JSON 围栏响应可解析
- 所有接口都有权限校验
```

