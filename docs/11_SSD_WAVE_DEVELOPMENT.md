# 11 — SSD 驱动开发与 Wave 机制

## 11.1 SSD 定义

本项目将 SSD 定义为：

```
Spec → Schema → Delivery
规格 → 数据/接口契约 → 可验收交付
```

如果团队成员习惯称为 SDD（Spec Driven Development，规格驱动开发），在本项目中与 SSD 的目标一致：先明确规格，再写 Schema 和 API 契约，最后按 Wave 交付。

## 11.2 SSD 三阶段

### S1：Spec 规格

每个能力开发前必须明确：

- 用户是谁
- 解决什么问题
- 页面或 API 行为是什么
- 成功和失败状态是什么
- 管理员是否可配置
- 是否影响移动端 API

### S2：Schema 契约

进入开发前必须明确：

- PostgreSQL 表结构
- Prisma Schema
- DTO 类型
- API 请求和响应
- 错误码
- 权限要求
- 审计日志字段

### S3：Delivery 交付

每个 Wave 必须包含：

- 开发任务
- 验收标准
- 测试范围
- 迁移脚本
- 回滚策略
- 文档更新

## 11.3 Wave 命名

旧版前端 MVP 已完成 Wave 1-9，并归档在：

```
docs/archive/frontend-mvp/
```

升级开发从 Wave 10 开始。

| Wave | 主题 |
|------|------|
| Wave 10 | NestJS 后端基础设施 + PostgreSQL |
| Wave 11 | 认证权限 + 邮箱验证 + 找回密码 |
| Wave 12 | AI 模型管理 + API Key 加密 |
| Wave 13 | 求职业务 API 迁移 |
| Wave 14 | 前端接入后端 API + 管理员 UI |
| Wave 15 | 移动端 API 契约 + 部署上线 |
| Wave 16 | 安全加固 + 观测 + 性能优化 |

## 11.4 Wave 文档要求

每个 Wave 必须有：

```
docs/prompts/waveN_prompt.md
```

内容结构：

1. 必读文档
2. 前置条件
3. 目标
4. 任务清单
5. 数据库变更
6. API 变更
7. 前端变更
8. 安全要求
9. 验收标准
10. 禁止事项

## 11.5 开发前检查清单

- [ ] 已阅读 `docs/00_PROJECT_OVERVIEW.md`
- [ ] 已阅读 `docs/01_TECH_ARCHITECTURE.md`
- [ ] 已阅读 `docs/02_DATA_MODELS.md`
- [ ] 已阅读 `docs/06_UI_UX_DESIGN_SYSTEM.md`
- [ ] 已阅读当前 `docs/prompts/waveN_prompt.md`
- [ ] 已确认是否涉及 CORS、Cookie、移动端 Bearer Token
- [ ] 已确认是否涉及密钥加密或审计日志
- [ ] 已确认是否需要数据库迁移

## 11.6 Wave 完成标准

每个 Wave 结束前：

- TypeScript 无编译错误
- 后端单元测试和 e2e 测试通过
- 前端构建通过
- 数据库迁移可重复执行
- OpenAPI 文档更新
- 关键接口有成功和失败验收
- Vercel 前端可访问独立后端
- CORS 白名单在生产域名下验证通过
