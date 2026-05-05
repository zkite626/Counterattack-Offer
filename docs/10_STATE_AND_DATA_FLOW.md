# 10 — 状态与数据流文档

## 10.1 升级前后对比

| 领域 | 旧 MVP | 升级后 |
|------|--------|--------|
| 用户 | 内存 Repository | PostgreSQL |
| 认证 | Next.js API Route + JWT Cookie | NestJS + Access/Refresh Token |
| AI 模型 | localStorage + 前端加密 | PostgreSQL + 服务端加密 |
| 求职流程 | React Context + localStorage | PostgreSQL `career_flow_runs` |
| 简历 | localStorage | PostgreSQL `resumes` + `resume_versions` |
| 管理员 | 环境变量管理员 | 数据库角色和后台管理 |

## 10.2 前端状态分类

| 类型 | 存放位置 | 说明 |
|------|----------|------|
| 登录用户 | `AuthContext` + 后端 API | 刷新页面后恢复 |
| Access Token | 内存 | 不写入 localStorage |
| UI 主题 | localStorage | light/dark/system |
| 表单草稿 | localStorage 或 sessionStorage | 未提交时防丢 |
| 业务数据 | 后端 PostgreSQL | 以 API 返回为准 |
| 管理员筛选条件 | URL Query | 便于分享和刷新 |

## 10.3 Web 数据恢复流程

```
页面加载
  → AuthProvider 初始化
  → POST /auth/refresh 或 GET /auth/me
  → 成功：保存 user + accessToken
  → 拉取当前页面所需业务数据
  → 失败：跳转登录或展示游客页
```

## 10.4 求职流程数据流

```
用户填写资料
  → PATCH /users/me/profile
  → POST /career-flows
  → POST /ai/diagnose
  → 后端保存 career_flow_results
  → 前端更新当前步骤 UI
```

每个 AI 步骤都应保存：

- 输入快照
- AI 输出
- 使用模型
- 调用状态
- 创建时间

这样用户刷新页面、换设备或未来使用移动端时都能恢复流程。

## 10.5 简历编辑数据流

```
打开简历编辑器
  → GET /resumes/{id}
  → 本地编辑状态
  → 1500ms 防抖 PATCH /resumes/{id}
  → 关键操作 POST /resumes/{id}/versions
```

版本快照触发时机：

- 从 AI 结果创建简历
- 用户手动点击保存版本
- 模板大改
- 导出前

## 10.6 管理员状态流

管理员页面使用服务端分页和筛选：

```
/admin/users?page=1&status=active&keyword=li
  → GET /admin/users
```

管理员操作成功后：

1. 刷新当前列表
2. 展示操作结果
3. 审计日志自动写入后端

## 10.7 错误状态

前端统一处理：

| 错误码 | UI 行为 |
|--------|---------|
| `AUTH_TOKEN_EXPIRED` | 尝试 refresh |
| `AUTH_FORBIDDEN` | 展示 403 |
| `USER_DISABLED` | 清空登录态，展示禁用说明 |
| `AI_MODEL_NOT_CONFIGURED` | 引导配置模型或联系管理员 |
| `AI_KEY_INVALID` | 标记模型测试失败 |
| `SMTP_NOT_CONFIGURED` | 管理员后台提示配置 SMTP |
| `RATE_LIMITED` | 展示等待时间 |

## 10.8 前端缓存策略

第一阶段不引入复杂缓存库，使用轻量策略：

- 页面进入时拉取数据
- 关键操作后重新拉取
- 草稿本地保存
- 管理员列表通过 URL Query 保持筛选

后续如引入 React Query/SWR，需先更新本文档和任务文档。

