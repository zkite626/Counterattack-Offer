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

### Vercel 项目设置

1. 在 Vercel 新建 Project，Git 仓库选择当前仓库
2. Framework Preset 选择 Next.js
3. Root Directory 设置为 `frontend`
4. Production 环境变量使用 `frontend/.env.production.example` 中的键名
5. Domains 绑定 `offer.example.com`
6. 自定义域名生效后，将 Vercel 默认域名和自定义域名同时加入后端 `CORS_ORIGINS`

前端生产环境只允许 `NEXT_PUBLIC_` 变量；数据库、JWT、SMTP、AI Key 和加密主密钥不得配置到 Vercel。

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

仓库提供生产样例：

```bash
cp backend/.env.production.example backend/.env
```

复制后必须替换所有 `replace-with-*` 占位值，并确认 `.env` 不进入 Git。

### PM2 部署

```bash
cd /opt/counterattack-offer/backend
npm ci
npm run prisma:generate
npm run build
npm run prisma:migrate
sudo mkdir -p /var/log/counterattack-offer/api
sudo chown -R "$USER":"$USER" /var/log/counterattack-offer
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

PM2 配置文件：`backend/ecosystem.config.cjs`。

重启和回滚：

```bash
pm2 reload counterattack-offer-api
pm2 logs counterattack-offer-api --lines 100
```

### Docker 部署

如果服务器使用 Docker 镜像：

```bash
cd /opt/counterattack-offer/backend
docker build -t counterattack-offer-api:$(git rev-parse --short HEAD) .
docker run -d --name counterattack-offer-api \
  --restart unless-stopped \
  --env-file .env \
  -p 127.0.0.1:3001:3001 \
  counterattack-offer-api:$(git rev-parse --short HEAD)
```

PM2 和 Docker 二选一即可，生产只暴露 Nginx HTTPS，不直接开放 Node.js 端口。

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

完整示例位于：

```text
deploy/nginx/api.offer.example.com.conf
```

启用 HTTPS：

```bash
sudo cp deploy/nginx/api.offer.example.com.conf /etc/nginx/sites-available/api.offer.example.com.conf
sudo ln -s /etc/nginx/sites-available/api.offer.example.com.conf /etc/nginx/sites-enabled/api.offer.example.com.conf
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.offer.example.com
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

仓库脚本验证：

```bash
API_BASE_URL=https://api.offer.example.com/api/v1 \
CORS_ALLOWED_ORIGINS=https://offer.example.com,https://counterattack-offer.vercel.app \
CORS_DENIED_ORIGIN=https://evil.example.com \
npm --workspace backend run verify:cors
```

该脚本会验证 OPTIONS 预检、`Access-Control-Allow-Credentials: true`、实际 GET 健康检查和非白名单 Origin 拒绝。

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

生产数据库初始化模板：

```text
deploy/postgres/provision-production-db.sql
deploy/postgres/pg_hba.production.example.conf
```

执行迁移：

```bash
cd /opt/counterattack-offer/backend
npm run prisma:migrate
```

备份脚本：

```bash
PGHOST=127.0.0.1 \
PGPORT=5432 \
PGDATABASE=counterattack_offer \
PGUSER=counterattack_offer_app \
PGPASSWORD='replace-with-password' \
BACKUP_DIR=/var/backups/counterattack-offer/postgres \
BACKUP_ENCRYPTION_PASSPHRASE='replace-with-backup-passphrase' \
deploy/postgres/backup-postgres.sh
```

Crontab 示例：

```cron
15 2 * * * PGHOST=127.0.0.1 PGPORT=5432 PGDATABASE=counterattack_offer PGUSER=counterattack_offer_app PGPASSWORD=*** BACKUP_DIR=/var/backups/counterattack-offer/postgres BACKUP_ENCRYPTION_PASSPHRASE=*** /opt/counterattack-offer/deploy/postgres/backup-postgres.sh
```

恢复演练：

```bash
BACKUP_ENCRYPTION_PASSPHRASE='replace-with-backup-passphrase' \
deploy/postgres/restore-backup-check.sh /var/backups/counterattack-offer/postgres/counterattack_offer-YYYYMMDDTHHMMSSZ.dump.enc
```

PostgreSQL 必须只监听 `127.0.0.1` 或内网地址；云安全组和防火墙必须拒绝公网 `5432`。

## 15.7 OpenAPI 与移动端契约

导出 OpenAPI JSON：

```bash
npm --workspace backend run openapi:export
```

输出文件：

```text
docs/openapi/openapi-v1.json
```

生产也可直接访问：

```text
https://api.offer.example.com/docs/openapi.json
```

移动端接入说明：

```text
docs/mobile/MOBILE_API_INTEGRATION.md
```

移动端 Bearer Token 验证：

```bash
API_BASE_URL=https://api.offer.example.com/api/v1 \
MOBILE_TEST_EMAIL=student@example.com \
MOBILE_TEST_PASSWORD='replace-with-password' \
npm --workspace backend run verify:mobile
```

若要纳入真实 AI 调用验收，测试账号需先具备用户模型或可用全局模型，然后增加 `MOBILE_VERIFY_AI=true`。

## 15.8 发布流程

1. 合并代码到主分支
2. 后端执行数据库迁移
3. 部署 NestJS
4. 验证 `/api/v1/health`
5. 更新 Vercel 环境变量
6. 部署前端
7. 验证登录、刷新、AI 调用、SMTP 测试
8. 检查 CORS 和审计日志

上线验收命令建议：

```bash
curl -fsS https://api.offer.example.com/api/v1/health
npm --workspace backend run verify:cors
npm --workspace backend run verify:mobile
```

人工验收项：

- 注册验证邮件可收到并激活账号
- 找回密码邮件可收到，重置后旧会话失效
- 用户模型配置可创建、测试、设置默认和删除
- 用户无模型时可 fallback 到全局默认模型
- AI 画像到报告全流程可完成
- 管理员后台可访问用户、SMTP、全局模型、统计和审计日志
- 审计日志包含管理员敏感操作

## 15.9 回滚策略

| 场景 | 回滚 |
|------|------|
| 前端错误 | Vercel 回滚上一部署 |
| 后端错误 | PM2/Docker 回滚上一镜像 |
| 数据库迁移错误 | 使用向前修复迁移，避免生产直接 down migration |
| CORS 配置错误 | 更新后端环境变量并重启 |
| SMTP 错误 | 管理员后台停用 SMTP 或回退旧配置 |
