# 08 — SMTP 与邮件通知设计文档

## 8.1 设计目标

邮件系统由 NestJS 后端统一负责，用于：

- 注册邮箱验证
- 找回密码
- 欢迎用户注册
- 密码重置成功提醒
- API Key 或账号安全变更提醒
- 管理员测试 SMTP 配置

## 8.2 SMTP 配置

管理员在后台配置：

| 字段 | 示例 | 说明 |
|------|------|------|
| Host | `smtp.exmail.qq.com` | SMTP 主机 |
| Port | `465` / `587` | 端口 |
| Secure | `true` / `false` | 465 通常 true，587 通常 false + STARTTLS |
| Username | `noreply@example.com` | SMTP 用户 |
| Password | `授权码或密码` | 加密存储 |
| From Name | `逆袭Offer` | 发件人名称 |
| From Email | `noreply@example.com` | 发件邮箱 |

SMTP 密码使用与 API Key 相同的 AES-256-GCM 加密机制。

空库首次启动时只会初始化默认管理员和 bootstrap 标记，不会预置 SMTP
配置；管理员需要在后台手动完成 SMTP 保存和测试。

## 8.3 邮件类型

| 类型 | 触发时机 | 是否必须 |
|------|----------|----------|
| `verify_email` | 用户注册或重发验证 | 推荐必须 |
| `welcome` | 邮箱验证成功或注册成功 | 可开关 |
| `reset_password` | 用户申请找回密码 | 必须 |
| `password_changed` | 密码重置成功 | 推荐必须 |
| `api_key_changed` | 用户或管理员更新模型 Key | 推荐 |

## 8.4 邮件模板

模板可先由代码维护，后续迁移到数据库。

```
packages/mail-templates/
├── verify-email.ts
├── welcome.ts
├── reset-password.ts
├── password-changed.ts
└── api-key-changed.ts
```

### 模板变量

| 变量 | 说明 |
|------|------|
| `appName` | 逆袭Offer |
| `userName` | 用户名 |
| `actionUrl` | 验证或重置链接 |
| `expiresIn` | 过期时间说明 |
| `supportEmail` | 支持邮箱 |

## 8.5 邮件链接

后端生成链接时使用前端域名：

```env
WEB_PUBLIC_URL=https://offer.example.com
```

示例：

```text
https://offer.example.com/verify-email?token=...
https://offer.example.com/reset-password?token=...
```

前端页面读取 token 后调用后端：

```text
POST /api/v1/auth/verify-email
POST /api/v1/auth/reset-password
```

## 8.6 发送策略

第一阶段可同步发送，后续引入队列。

| 阶段 | 策略 |
|------|------|
| Wave 11 | 请求内发送，失败记录 `mail_events` |
| 后续优化 | 引入队列和重试，避免阻塞用户请求 |

### 重试建议

- 网络错误：最多重试 3 次
- 认证错误：不重试，提示管理员检查配置
- 收件人错误：不重试，记录失败

## 8.7 测试邮件

管理员点击「发送测试邮件」：

```json
{
  "toEmail": "admin@nixioffer.com"
}
```

后端：

1. 校验管理员权限
2. 解密 SMTP 密码
3. 发送测试邮件
4. 更新 `last_tested_at` 和 `last_test_status`
5. 写入审计日志

## 8.8 安全要求

- SMTP 密码不返回前端
- 测试失败不展示完整服务商错误栈
- 邮件 Token 只保存哈希
- 验证和重置 Token 单次使用
- 找回密码接口不暴露邮箱是否存在
- 邮件正文避免包含敏感账号细节
