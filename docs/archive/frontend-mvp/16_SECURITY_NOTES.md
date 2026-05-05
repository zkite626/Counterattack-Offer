# 16 — 安全注意事项

## 16.1 API Key 安全

### 问题

用户在前端输入的 AI 模型 API Key 需要安全处理。

### 方案

1. **传输安全**：API Key 通过 HTTPS 加密传输（生产环境强制 HTTPS）
2. **存储安全（MVP）**：localStorage 中使用简单加密存储
   - 使用 AES 加密，密钥来源于用户 JWT Token
   - 不以明文存储 API Key
3. **服务端代理**：所有 AI 调用通过 API Route 代理
   - 前端将加密的 Key 发送到 API Route
   - API Route 解密后调用目标模型 API
   - 目标 API Key 不出现在前端网络请求中
4. **未来改进**：接入数据库后，API Key 存储在服务端加密字段

### 禁止事项

- ❌ 不在前端直接调用第三方 AI API
- ❌ 不在 `NEXT_PUBLIC_` 环境变量中存放 API Key
- ❌ 不在日志中打印 API Key
- ❌ 不在 Git 中提交 `.env.local`

---

## 16.2 JWT 安全

1. **密钥强度**：JWT_SECRET 至少 32 字符，使用随机字符串
2. **HttpOnly Cookie**：Token 存储在 HttpOnly Cookie 中，JavaScript 无法读取
3. **Secure Flag**：生产环境强制 Secure 标志
4. **SameSite=Lax**：防止 CSRF 攻击
5. **过期时间**：默认 7 天，不超过 30 天
6. **签名算法**：HS256

---

## 16.3 XSS 防护

1. **React 自动转义**：React 默认对 JSX 中的变量进行 HTML 转义
2. **避免 dangerouslySetInnerHTML**：除非必要（如 Markdown 渲染），不使用
3. **Markdown 渲染**：如果渲染 AI 返回的 Markdown，使用安全的 Markdown 解析器
4. **用户输入校验**：所有表单输入在前端和后端都进行校验

---

## 16.4 CORS 配置

Next.js API Routes 默认同源，无需额外 CORS 配置。如果需要跨域访问：

```typescript
// 在 API Route 中设置
const headers = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL,
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

---

## 16.5 输入校验

### 前端校验

- 邮箱格式验证
- 密码长度（≥8字符）
- 必填字段非空
- JD 文本最大长度限制（10000字符）

### 后端校验

- 所有 API Route 入口进行参数校验
- 类型检查
- 长度限制
- 格式验证

---

## 16.6 速率限制（建议）

MVP 阶段暂不实现，但建议后续添加：

- 登录接口：5次/分钟
- AI 调用接口：10次/分钟
- 注册接口：3次/小时

---

## 16.7 .gitignore

确保以下文件不被提交：

```
.env.local
.env.production
node_modules/
.next/
```
