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
| `ADMIN_PASSWORD` | ✅ | 默认管理员密码 | `Admin@123` |
| `NEXT_PUBLIC_APP_NAME` | ❌ | 应用名称 | `逆袭Offer` |
| `NEXT_PUBLIC_APP_URL` | ❌ | 应用URL | `http://localhost:3000` |

---

## 15.2 Vercel 部署

### 前置说明

- 项目 **无需** `vercel.json` 或 `output: 'standalone'`，Vercel 自动识别 Next.js App Router
- 构建命令：`next build`（Vercel 自动执行）
- 所有 API Route 自动转为 Serverless Functions

### 步骤

1. 将代码推送到 GitHub
2. 登录 [Vercel](https://vercel.com)
3. 点击「Add New → Project」，导入 GitHub 仓库
4. Framework Preset 自动识别为 Next.js，无需修改
5. 配置环境变量（见下方）
6. 点击 Deploy

### Vercel 环境变量配置

在 Vercel Dashboard → Project → Settings → Environment Variables 中添加：

| 变量 | 必填 | 说明 |
|------|------|------|
| `JWT_SECRET` | ✅ | JWT 签名密钥（≥32 字符随机字符串） |
| `JWT_EXPIRES_IN` | ❌ | Token 有效期，默认 `7d` |
| `ADMIN_EMAIL` | ✅ | 默认管理员邮箱 |
| `ADMIN_PASSWORD` | ✅ | 默认管理员密码 |
| `NEXT_PUBLIC_APP_NAME` | ❌ | 应用名称 |
| `NEXT_PUBLIC_APP_URL` | ❌ | 部署后的 Vercel 域名，如 `https://your-app.vercel.app` |

> **注意**：`NEXT_PUBLIC_` 开头的变量会暴露给浏览器，敏感信息不要使用此前缀。

### Vercel 部署后验证

- [ ] 访问部署域名，首页正常加载
- [ ] 注册/登录功能正常
- [ ] 设置页配置 AI 模型后可正常调用
- [ ] 暗色模式正常
- [ ] 移动端响应式正常

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
  /* 图片优化 */
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /* 生产环境移除 X-Powered-By 头 */
  poweredByHeader: false,

  /* 安全头 + 静态资源缓存 */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

> **Vercel 部署**：无需添加 `output: 'standalone'`，该选项仅用于 Docker 部署。Vercel 使用自己的构建系统，自动处理 Serverless Function 打包。

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
