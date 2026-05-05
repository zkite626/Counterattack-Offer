# 16 — 安全注意事项

## 16.1 敏感信息原则

以下信息不得进入前端持久化、日志、审计明文或 Git：

- 用户密码
- Refresh Token
- AI API Key
- SMTP 密码
- JWT Secret
- 加密主密钥
- 数据库连接串

## 16.2 API Key 与 SMTP 密码

使用 AES-256-GCM 加密存储：

- `encrypted_api_key`
- `encrypted_password`

展示时只显示掩码：

```text
sk-***abcd
```

更新密钥时：

1. 校验权限
2. 加密新值
3. 更新指纹和掩码
4. 写入审计日志
5. 不返回明文

## 16.3 CORS 安全

前端部署在 Vercel、后端独立服务器时，CORS 是上线关键项。

必须：

- 使用精确 Origin 白名单
- 生产环境禁止 `origin: "*"`
- credentials 请求必须使用 `Access-Control-Allow-Credentials: true`
- Cookie 跨站必须 `SameSite=None; Secure`
- 移动端使用 Bearer Token，不依赖 CORS Cookie

## 16.4 CSRF

Web 使用跨域 Cookie 时需考虑 CSRF。

基础防护：

- Refresh Token Cookie 限定 `Path=/api/v1/auth`
- 写操作使用 Access Token Bearer Header
- 后端校验 `Origin` 和 `Referer`
- 关键操作可增加 CSRF Token

## 16.5 XSS

- React 默认转义用户内容
- 避免 `dangerouslySetInnerHTML`
- 渲染 AI Markdown 前做安全清洗
- 用户输入和 AI 输出都按不可信内容处理

## 16.6 密码安全

- 新密码至少 8 位，建议包含字母和数字
- 新用户使用 Argon2id 哈希
- 如兼容旧 bcrypt 哈希，登录成功后可升级哈希
- 找回密码成功后撤销所有 Refresh Token

## 16.7 限流

建议基础限流：

| 接口 | 限制 |
|------|------|
| 登录 | 5 次/分钟/IP + 邮箱 |
| 注册 | 3 次/小时/IP |
| 找回密码 | 3 次/小时/邮箱 |
| 发送验证邮件 | 3 次/小时/用户 |
| 模型测试 | 10 次/小时/用户 |
| AI 调用 | 60 次/小时/用户 |

## 16.8 日志脱敏

日志中必须脱敏：

```text
Authorization: Bearer ***
Cookie: ***
apiKey: ***
password: ***
token: ***
```

AI 调用日志只记录模型、耗时、Token 用量、错误码，不记录完整 API Key。

## 16.9 管理员安全

- 至少保留一个管理员
- 管理员登录建议后续加入 MFA
- 管理员修改全局模型、SMTP、用户角色必须写审计日志
- 管理员不能查看用户 API Key 明文

## 16.10 数据库安全

- PostgreSQL 禁止公网裸露
- 使用独立数据库账号，最小权限
- 定期备份并加密
- 生产数据库禁止使用开发密码
- Prisma migration 必须经过审核

