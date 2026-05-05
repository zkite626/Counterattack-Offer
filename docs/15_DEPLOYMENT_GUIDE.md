# 15 — 部署指南

## 15.1 部署目标

本项目采用前后端分离部署：

| 服务 | 部署平台 | 示例域名 |
|------|----------|----------|
| Next.js 前端 | Vercel | `https://offer.example.com` |
| NestJS 后端 | 自有服务器 | `https://api.offer.example.com` |
| PostgreSQL | 自有服务器或托管数据库 | 内网访问 |

## 15.2 前端 Vercel 部署

### 环境变量

```env
NEXT_PUBLIC_API_BASE_URL=https://api.offer.example.com/api/v1
NEXT_PUBLIC_APP_NAME=逆袭Offer
```

前端禁止配置：

- 数据库连接串
- AI API Key
- SMTP 密码
- JWT Secret
- 加密主密钥

### 构建命令

```bash
npm run build
```

Vercel Root Directory 应指向：

```text
frontend
```

前端构建只读取 `frontend/` 内的 Next.js 项目文件。

## 15.3 后端服务器部署

推荐服务器组件：

- Ubuntu LTS
- Node.js LTS
- PostgreSQL 15+
- Nginx
- PM2 或 Docker
- Certbot/Let's Encrypt HTTPS

### 后端环境变量

```env
NODE_ENV=production
PORT=3001
API_PUBLIC_URL=https://api.offer.example.com
WEB_PUBLIC_URL=https://offer.example.com
CORS_ORIGINS=https://offer.example.com,https://counterattack-offer.vercel.app
DATABASE_URL=postgresql://user:password@127.0.0.1:5432/counterattack_offer
JWT_ACCESS_SECRET=replace-with-long-random-secret
JWT_REFRESH_SECRET=replace-with-long-random-secret
APP_KEY_ENCRYPTION_SECRET=base64-32-byte-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-strong-password
```

## 15.4 Nginx 反向代理

```nginx
server {
  listen 443 ssl http2;
  server_name api.offer.example.com;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }
}
```

SSE 接口如出现缓冲，需要为 AI 流式接口关闭代理缓冲：

```nginx
location /api/v1/ai/ {
  proxy_pass http://127.0.0.1:3001;
  proxy_buffering off;
  proxy_cache off;
}
```

## 15.5 CORS 生产配置

NestJS：

```typescript
app.enableCors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS origin denied'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Client-Version'],
});
```

生产检查：

- Vercel 默认域名加入白名单
- 自定义前端域名加入白名单
- 本地开发域名只在非生产环境加入
- 不使用 `origin: "*"` 搭配 `credentials: true`

## 15.6 PostgreSQL 备份

基础备份命令：

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%F).sql
```

建议：

- 每日自动备份
- 至少保留 7 天
- 备份文件加密
- 每月至少一次恢复演练

## 15.7 发布流程

1. 合并代码到主分支
2. 后端执行数据库迁移
3. 部署 NestJS
4. 验证 `/api/v1/health`
5. 更新 Vercel 环境变量
6. 部署前端
7. 验证登录、刷新、AI 调用、SMTP 测试
8. 检查 CORS 和审计日志

## 15.8 回滚策略

| 场景 | 回滚 |
|------|------|
| 前端错误 | Vercel 回滚上一部署 |
| 后端错误 | PM2/Docker 回滚上一镜像 |
| 数据库迁移错误 | 使用向前修复迁移，避免生产直接 down migration |
| CORS 配置错误 | 更新后端环境变量并重启 |
| SMTP 错误 | 管理员后台停用 SMTP 或回退旧配置 |
