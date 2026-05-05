# 移动端 API v1 接入说明

## 基础信息

- 生产基础地址：`https://api.offer.example.com/api/v1`
- OpenAPI JSON：`https://api.offer.example.com/docs/openapi.json`
- 本仓库导出文件：`docs/openapi/openapi-v1.json`
- 认证方式：移动端只使用 `Authorization: Bearer <accessToken>`，不依赖 Cookie

## 必带请求头

```http
Content-Type: application/json
X-Client-Type: mobile
X-Client-Version: 1.0.0
X-Platform: ios
Authorization: Bearer <accessToken>
```

写操作建议额外携带：

```http
X-Idempotency-Key: <uuid>
```

## 登录与刷新

登录：

```http
POST /auth/login
```

```json
{
  "email": "student@example.com",
  "password": "password123",
  "clientType": "mobile",
  "deviceName": "iPhone 15"
}
```

移动端响应必须包含 `accessToken`、`refreshToken`、`expiresIn` 和 `user`。`refreshToken` 必须写入系统安全存储；崩溃日志、埋点和截图不得包含任何 Token。

刷新：

```http
POST /auth/refresh
```

```json
{
  "refreshToken": "<refreshToken>",
  "clientType": "mobile",
  "deviceName": "iPhone 15"
}
```

刷新成功后必须替换本地保存的 refresh token。退出登录时调用：

```http
POST /auth/logout
```

## 核心接口冒烟顺序

1. `POST /auth/login`
2. `POST /auth/refresh`
3. `GET /auth/me`
4. `GET /users/me/profile`
5. `GET /ai/models`
6. `POST /career-flows`
7. `POST /ai/diagnose`
8. `GET /career-flows/{id}/results`
9. `POST /resumes`

AI 长任务默认使用非流式请求，Body 中传 `stream: false`。移动端运行环境稳定支持 SSE 后，再接入 Web 同款流式体验。

## 本地契约验证

导出 OpenAPI：

```bash
npm --workspace backend run openapi:export
```

验证移动端登录、刷新和 Bearer Token 核心接口：

```bash
API_BASE_URL=https://api.offer.example.com/api/v1 \
MOBILE_TEST_EMAIL=student@example.com \
MOBILE_TEST_PASSWORD='replace-with-password' \
npm --workspace backend run verify:mobile
```

如需把 AI 真实调用也纳入验收，先确认测试账号已有可用用户模型或全局模型，再增加：

```bash
MOBILE_VERIFY_AI=true
```

## 错误处理

所有错误响应遵循统一结构：

```json
{
  "success": false,
  "error": {
    "code": "AUTH_TOKEN_INVALID",
    "message": "Refresh Token 无效"
  },
  "requestId": "req_xxx"
}
```

移动端应展示可理解的业务错误，并在反馈入口保留 `requestId`，方便后端排查日志。
