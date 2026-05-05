# 09 — 移动端 API 接入设计文档

## 9.1 设计目标

后端 API 从第一阶段就面向移动端设计，避免未来 App/小程序接入时重写业务接口。

移动端包括：

- iOS / Android App
- 小程序
- 未来桌面客户端

## 9.2 API 契约原则

1. 所有业务能力走 `/api/v1`
2. 认证使用 Bearer Token，不依赖 Cookie
3. 所有列表接口支持分页
4. 所有错误返回稳定错误码
5. 所有写操作可携带 `X-Idempotency-Key`
6. API 文档由 OpenAPI/Swagger 自动生成
7. 移动端不得直接调用第三方 AI API

## 9.3 移动端认证

### 登录

```http
POST /api/v1/auth/login
Content-Type: application/json
X-Client-Type: mobile
X-Client-Version: 1.0.0
```

```json
{
  "email": "student@example.com",
  "password": "password123",
  "clientType": "mobile",
  "deviceName": "iPhone 15"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900,
    "user": {}
  }
}
```

### 后续请求

```http
Authorization: Bearer <accessToken>
X-Client-Type: mobile
X-Client-Version: 1.0.0
```

## 9.4 分页格式

请求：

```http
GET /api/v1/resumes?page=1&pageSize=20
```

响应：

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 9.5 SSE 与移动端兼容

Web 可优先使用 SSE：

```text
POST /api/v1/ai/interview
stream=true
```

移动端若运行环境不稳定支持 SSE，可使用非流式接口：

```json
{
  "stream": false
}
```

后续可增加任务式接口：

```
POST /api/v1/ai/jobs
GET /api/v1/ai/jobs/{id}
```

用于长任务轮询。

## 9.6 移动端核心流程

```
登录/注册
  → 邮箱验证
  → 获取/创建学生档案
  → 创建 career_flow_run
  → 调用 AI 步骤
  → 拉取流程结果
  → 创建或编辑简历
  → 查看报告
```

移动端不需要实现管理员后台，但可以复用：

- 用户资料 API
- AI 模型 API
- 求职流程 API
- 简历 API

## 9.7 版本兼容

请求头：

```http
X-Client-Version: 1.0.0
X-Platform: ios
```

后端可返回：

```json
{
  "success": false,
  "error": {
    "code": "CLIENT_VERSION_UNSUPPORTED",
    "message": "当前版本过低，请升级后继续使用"
  }
}
```

## 9.8 移动端安全

- Refresh Token 使用系统安全存储
- 用户退出登录时调用 `/auth/logout`
- 密码重置后撤销所有移动端会话
- 不在本地保存 API Key 明文
- 截图、日志和崩溃上报不得包含 Token 和模型 Key

