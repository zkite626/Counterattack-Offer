# 05 — 认证与权限设计文档

## 5.1 认证方案概述

升级后认证由 NestJS 后端负责。Web 前端部署在 Vercel，后端独立服务器部署，因此认证设计必须同时满足跨域浏览器访问和移动端访问。

| 客户端 | Access Token | Refresh Token | 说明 |
|--------|--------------|---------------|------|
| Web | 内存保存，短期有效 | HttpOnly Cookie | 降低 XSS 泄露长期凭证风险 |
| 移动端 | 安全存储或内存 | App 安全存储 | 使用 Bearer Token，不依赖 Cookie |

## 5.2 登录流程

```
用户提交邮箱密码
  → POST /api/v1/auth/login
  → 校验用户存在且未禁用
  → 校验密码哈希
  → 检查邮箱验证策略
  → 生成 accessToken + refreshToken
  → 写入 refresh_tokens 表
  → Web 设置 HttpOnly Cookie
  → 返回 accessToken + user
```

Access Token 默认 15 分钟过期，Refresh Token 默认 30 天过期。

## 5.3 邮箱验证流程

注册后：

```
创建用户 pending_email
  → 生成 email_verification_tokens
  → 发送验证邮件
  → 用户点击链接
  → POST /auth/verify-email
  → 标记 email_verified_at
  → 用户状态变为 active
  → 发送欢迎邮件
```

系统设置：

| 设置 | 默认 | 说明 |
|------|------|------|
| `require_email_verification` | true | 未验证邮箱是否禁止使用核心功能 |
| `verification_token_ttl_minutes` | 60 | 验证链接有效期 |
| `welcome_email_enabled` | true | 验证成功后发送欢迎邮件 |

## 5.4 找回密码流程

```
用户输入邮箱
  → POST /auth/forgot-password
  → 无论邮箱是否存在都返回成功
  → 若用户存在，生成 password_reset_tokens
  → 发送重置邮件
  → 用户提交 token + 新密码
  → 校验 token 未过期未使用
  → 更新密码哈希
  → 撤销该用户所有 refresh token
  → 发送安全提醒邮件
```

## 5.5 权限模型

### 角色

```typescript
export type UserRole = 'student' | 'admin';
```

### 权限矩阵

| 能力 | 游客 | 学生 | 管理员 |
|------|------|------|--------|
| 浏览首页 | ✅ | ✅ | ✅ |
| 注册/登录 | ✅ | ✅ | ✅ |
| 管理个人档案 | ❌ | ✅ | ✅ |
| 配置个人 AI 模型 | ❌ | ✅ | ✅ |
| 使用全局模型 | ❌ | 按策略 | ✅ |
| 管理用户 | ❌ | ❌ | ✅ |
| 管理全局模型 | ❌ | ❌ | ✅ |
| 管理 SMTP | ❌ | ❌ | ✅ |
| 查看审计日志 | ❌ | ❌ | ✅ |

## 5.6 Guard 与 Decorator

NestJS 后端建议实现：

| 名称 | 用途 |
|------|------|
| `JwtAuthGuard` | 校验 Access Token |
| `RolesGuard` | 校验角色 |
| `EmailVerifiedGuard` | 核心功能要求邮箱已验证 |
| `CurrentUser()` | 获取当前用户 |
| `RequireRoles('admin')` | 标记管理员接口 |

## 5.7 跨域 Cookie 配置

前端 Vercel、后端独立域名时，生产 Cookie 配置：

```typescript
{
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/api/v1/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000
}
```

后端 CORS 必须：

```typescript
app.enableCors({
  origin: corsOriginMatcher,
  credentials: true,
});
```

前端请求必须：

```typescript
fetch(url, {
  credentials: 'include',
});
```

## 5.8 用户状态处理

| 状态 | 登录 | 核心功能 | 说明 |
|------|------|----------|------|
| `pending_email` | 允许 | 可限制 | 等待邮箱验证 |
| `active` | 允许 | 允许 | 正常状态 |
| `disabled` | 禁止 | 禁止 | 管理员禁用 |
| `deleted` | 禁止 | 禁止 | 软删除 |

## 5.9 默认管理员初始化

服务启动时若 `users` 表为空，则通过环境变量创建默认管理员：

```env
ADMIN_EMAIL=admin@nixioffer.com
ADMIN_PASSWORD=Admin@123
```

初始化流程必须是幂等的，只在空库第一次启动时执行，不会覆盖已有用户或业务数据。
空库启动时如果缺少 `ADMIN_EMAIL` 或 `ADMIN_PASSWORD`，后端必须拒绝启动。
初始化后必须写入审计日志和 bootstrap 标记：

```text
action = system.admin.bootstrap
target_type = user
app_settings.key = system.bootstrap
```
首次登录后应立即修改默认管理员密码，不要长期保留示例值。
