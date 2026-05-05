# Wave 15 开发提示词 — 移动端 API 契约 + 生产部署

```
你是一个资深平台工程师，正在为《逆袭Offer》完成生产部署和移动端 API 契约。

## 必读文档

- AGENTS.md
- docs/01_TECH_ARCHITECTURE.md
- docs/03_API_SPECIFICATION.md
- docs/09_MOBILE_API_DESIGN.md
- docs/14_TEST_ACCEPTANCE.md
- docs/15_DEPLOYMENT_GUIDE.md
- docs/16_SECURITY_NOTES.md
- docs/17_OPERATIONS_OBSERVABILITY.md

## 技能辅助建议

鼓励根据任务使用相关 Codex Skills/Plugins 辅助开发。本 Wave 涉及 Vercel、服务器部署、CORS、OpenAPI 和移动端契约，可优先使用部署排障、GitHub/CI、系统化调试、浏览器验证、验证和代码审查相关技能；技能建议必须服从生产安全、备份和回滚规范。

## 目标

1. 前端部署到 Vercel
2. 后端部署到独立服务器
3. PostgreSQL 生产可用并有备份
4. CORS 生产域名验证通过
5. OpenAPI v1 契约可供移动端开发

## 任务

### 15.1 后端部署

- 生产环境变量
- PM2 或 Docker
- Nginx HTTPS
- `/api/v1/health`
- 日志目录和重启策略

### 15.2 PostgreSQL

- 创建生产数据库
- 执行迁移
- 配置备份脚本
- 禁止公网裸露

### 15.3 前端 Vercel

- 配置 Root Directory 为 `frontend`
- 配置 `NEXT_PUBLIC_API_BASE_URL`
- 绑定自定义域名

### 15.4 CORS 验证

- Vercel 默认域名
- 自定义前端域名
- OPTIONS 预检
- `credentials: include`
- 非白名单 Origin 拒绝

### 15.5 移动端契约

- 导出 OpenAPI JSON
- 验证移动端 Bearer Token 登录、刷新、调用核心接口
- 编写移动端接入说明

### 15.6 上线验收

- 注册验证邮件
- 找回密码
- 用户模型配置
- 全局模型 fallback
- AI 全流程
- 管理员后台
- 审计日志

## 验收标准

- `https://offer.example.com` 可访问
- `https://api.offer.example.com/api/v1/health` 可访问
- 前端生产环境可登录、刷新、调用 AI
- OpenAPI 可下载
- 数据库备份可运行
- CORS 配置不使用通配符
```
