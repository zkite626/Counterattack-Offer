# 逆袭Offer 前端

`frontend/` 是 Next.js 16 Web 客户端，可独立部署到 Vercel。前端只保存 UI 偏好和临时草稿，账号、模型、简历和求职流程数据均通过后端 API 读写。

## 本地启动

```bash
cp frontend/.env.local.example frontend/.env.local
npm --workspace frontend run dev
```

## 环境变量

前端读取 `frontend/.env.local`，可由 `frontend/.env.local.example` 复制生成。生产环境在 Vercel 控制台配置同名变量。

| 变量 | 示例 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001/api/v1` | NestJS 后端 API 基础地址 |
| `NEXT_PUBLIC_APP_NAME` | `逆袭Offer` | 前端展示的应用名称 |

## 后端依赖

首次连接全新后端数据库时，后端会按 `ADMIN_EMAIL` / `ADMIN_PASSWORD`
创建默认管理员并写入审计日志。前端不直接初始化数据库，也不保存 AI API Key、SMTP 密码、JWT Secret 或数据库连接串。

## 主要页面

- `/account`：账号中心，可查看账号状态、修改密码、修改邮箱、重发验证邮件
- `/profile`：学生资料，用于维护求职背景和真实经历
- `/qa`：求职 AI 问答，可结合当前资料流式回答，也能在没有资料时直接聊天
- `/settings`：个人模型管理，模型服务商展示中文名称，并会自动填入常见服务商接口地址；密钥仅展示掩码和连接状态
- `/admin/*`：管理员后台，包含用户管理、全局模型、邮件设置、审计日志和平台统计；用户管理支持新增/删除用户，其他配置表单提供中文字段、示例值和输入说明

## 常用命令

```bash
npm --workspace frontend run lint
npm --workspace frontend run build
```
