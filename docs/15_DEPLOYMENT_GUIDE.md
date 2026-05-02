# 15 — 部署指南

## 15.1 本地开发

### 前置条件

- Node.js >= 18.x（推荐 20.x+，Next.js 16 兼容）
- npm >= 9.x

### 启动步骤

```bash
# 1. 克隆项目
git clone <repo-url>
cd counterattack-offer

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填写 JWT_SECRET 等

# 4. 启动开发服务器
npm run dev

# 5. 访问 http://localhost:3000
```

### 环境变量说明

| 变量 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `JWT_SECRET` | ✅ | JWT签名密钥（≥32字符） | `your-very-long-secret-key-here-32+` |
| `JWT_EXPIRES_IN` | ❌ | Token有效期 | `7d` |
| `ADMIN_EMAIL` | ✅ | 默认管理员邮箱 | `admin@nixioffer.com` |
| `ADMIN_PASSWORD` | ✅ | 默认管理员密码 | `Admin@123456` |
| `NEXT_PUBLIC_APP_NAME` | ❌ | 应用名称 | `逆袭Offer` |
| `NEXT_PUBLIC_APP_URL` | ❌ | 应用URL | `http://localhost:3000` |

---

## 15.2 Vercel 部署

### 步骤

1. 将代码推送到 GitHub
2. 登录 [Vercel](https://vercel.com)
3. 导入 GitHub 仓库
4. 配置环境变量（同 `.env.local`）
5. 点击 Deploy

### Vercel 环境变量配置

在 Vercel Dashboard → Project → Settings → Environment Variables 中添加：

```
JWT_SECRET=<your-secret>
ADMIN_EMAIL=<your-email>
ADMIN_PASSWORD=<your-password>
```

> **注意**：`NEXT_PUBLIC_` 开头的变量会暴露给浏览器，敏感信息不要使用此前缀。

---

## 15.3 Docker 部署（可选）

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    restart: unless-stopped
```

### 构建与运行

```bash
docker compose up -d --build
```

---

## 15.4 next.config.ts 配置

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',  // Docker部署需要
  // 图片优化（如果使用外部图片）
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
```

---

## 15.5 生产检查清单

- [ ] 环境变量已正确配置
- [ ] JWT_SECRET 足够强（≥32字符随机字符串）
- [ ] ADMIN_PASSWORD 足够强
- [ ] `npm run build` 无错误
- [ ] Lighthouse Performance > 85
- [ ] 所有页面暗色模式正常
- [ ] 移动端响应式正常
- [ ] AI 模型调用正常
