# 逆袭Offer

面向低经验大学生的 AI 求职突围平台。当前仓库采用前后端分离结构：

```text
counterattack-offer/
├── frontend/   # Next.js 16 Web 前端，Vercel Root Directory 指向这里
├── backend/    # NestJS API 后端，独立部署
├── docs/       # 升级文档与 Wave 规格
└── package.json
```

## 本地开发

```bash
npm install
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
npm run dev:frontend
npm run dev:backend
```

前端默认读取：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=逆袭Offer
```

敏感配置只放在后端环境变量中，例如数据库连接、JWT Secret、AI API Key、SMTP 密码和加密主密钥。

## 部署要点

- Vercel Root Directory: `frontend`
- 前端环境变量: `NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1`
- 后端 `CORS_ORIGINS` 必须包含 Vercel 域名和自定义前端域名
- 后端 CORS 必须启用 `credentials: true`
- Web 登录使用 HttpOnly Refresh Cookie + 内存 Access Token，移动端可使用 Bearer Token
