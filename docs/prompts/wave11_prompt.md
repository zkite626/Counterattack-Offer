# Wave 11 开发提示词 — 认证权限 + SMTP 邮件

```
你是一个资深全栈后端工程师，正在为《逆袭Offer》实现真实账号体系和邮件能力。

## 必读文档

- AGENTS.md
- docs/01_TECH_ARCHITECTURE.md
- docs/02_DATA_MODELS.md
- docs/03_API_SPECIFICATION.md
- docs/05_AUTH_DESIGN.md
- docs/08_MAIL_SMTP_DESIGN.md
- docs/16_SECURITY_NOTES.md

## 技能辅助建议

鼓励根据任务使用相关 Codex Skills/Plugins 辅助开发。本 Wave 涉及认证、SMTP、安全和跨域 Cookie，可优先使用系统化调试、官方文档查询、安全检查、验证和代码审查相关技能；技能建议必须服从项目文档、密钥脱敏和验收规范。

## 目标

1. 实现注册、登录、刷新 Token、登出、当前用户
2. 实现邮箱验证和找回密码
3. 实现管理员 SMTP 配置和测试邮件
4. 同时支持 Web 跨域 Cookie 和移动端 Bearer Token

## 任务

### 11.1 数据库迁移

- users
- refresh_tokens
- email_verification_tokens
- password_reset_tokens
- smtp_settings
- mail_events

### 11.2 AuthModule

- `/auth/register`
- `/auth/login`
- `/auth/refresh`
- `/auth/logout`
- `/auth/me`
- Access Token 15 分钟
- Refresh Token 30 天

### 11.3 邮箱验证

- 注册后生成验证 Token
- Token 只保存哈希
- 验证成功后设置 `email_verified_at`
- 可重发验证邮件

### 11.4 找回密码

- 申请找回密码不暴露邮箱是否存在
- 重置成功后撤销所有 Refresh Token
- 发送安全提醒邮件

### 11.5 MailModule

- 管理员保存 SMTP 配置
- SMTP 密码 AES-256-GCM 加密
- 发送测试邮件
- 邮件事件写入 `mail_events`

### 11.6 权限

- `JwtAuthGuard`
- `RolesGuard`
- `EmailVerifiedGuard`
- `@CurrentUser()`
- `@RequireRoles('admin')`

## 验收标准

- Web 可跨域登录并设置 HttpOnly Refresh Cookie
- 移动端可使用 Bearer Token 登录和刷新
- 注册验证邮件可发送并激活账号
- 找回密码链路完整
- SMTP 密码数据库不存明文
- 管理员操作进入审计日志
```
