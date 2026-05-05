# 01 — 技术架构文档

## 1.1 架构总览

```
Browser (React Pages + Context + CSS Variables + localStorage)
        │  HTTP / SSE
        ▼
Next.js Server (API Routes)
├── Auth Middleware (JWT验证，middleware.ts)
├── AI Service (OpenAI兼容协议)
├── Prompt Engine (模板加载+注入)
└── Repository Layer (Memory → DB预留)
        │
        ▼
OpenAI-Compatible LLM APIs (DeepSeek/OpenAI/GLM/Kimi/...)
```

## 1.2 Next.js App Router 路由结构

```
src/app/
├── layout.tsx                 # Root Layout
├── page.tsx                   # 首页（公开）
├── globals.css                # 全局CSS + Design Tokens
├── (auth)/                    # 认证路由组（无需登录）
│   ├── layout.tsx             # 居中卡片布局
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/               # 受保护路由组（需JWT）
│   ├── layout.tsx             # Dashboard布局(Header+Sidebar+StepNav)
│   ├── profile/page.tsx       # 学生信息页
│   ├── diagnosis/page.tsx     # AI画像诊断页
│   ├── translation/page.tsx   # 经历转译页
│   ├── job/page.tsx           # JD解析页
│   ├── match/page.tsx         # 人岗匹配页
│   ├── resume/page.tsx        # 简历优化页
│   ├── interview/page.tsx     # 面试训练页
│   ├── plan/page.tsx          # 能力计划页
│   ├── report/page.tsx        # 汇总报告页
│   ├── settings/page.tsx      # 模型管理页
│   └── resume-builder/        # 简历创建器
│       ├── page.tsx           # 简历列表页
│       └── [id]/page.tsx      # 编辑工作台页
└── api/
    ├── auth/
    │   ├── login/route.ts
    │   ├── register/route.ts
    │   ├── me/route.ts
    │   └── logout/route.ts
    └── ai/
        ├── chat/route.ts          # 通用AI调用(流式)
        ├── default-config/route.ts # 获取.env默认模型配置
        ├── diagnose/route.ts
        ├── generate-jd/route.ts    # AI生成岗位JD
        ├── translate/route.ts
        ├── analyze-job/route.ts
        ├── match/route.ts
        ├── optimize-resume/route.ts
        ├── interview/route.ts
        ├── plan/route.ts
        ├── report/route.ts
        └── test-connection/route.ts
```

## 1.3 Route Group 说明

| Route Group | 用途 | Layout | 认证 |
|-------------|------|--------|------|
| `(auth)` | 登录/注册 | 居中卡片 | 不需要 |
| `(dashboard)` | 所有功能页 | Header+侧边栏+步骤导航 | 需要JWT |
| 根 `/` | 首页 | 全屏Landing | 不需要 |

## 1.4 渲染策略

| 页面 | 渲染方式 | 原因 |
|------|----------|------|
| 首页 | SSG | 内容固定，SEO友好 |
| 登录/注册 | CSR | 表单交互为主 |
| 功能页 | CSR | 依赖用户输入和AI实时响应 |
| API Routes | Server | 保护API Key |

## 1.5 路由保护（middleware.ts）

路由保护由项目根目录的 `middleware.ts` 实现，导出 `middleware` 函数：

```
Request → middleware.ts (middleware 函数)
  ├── /api/ai/* → 验证JWT Token → 注入 x-user-id 头 → 通过/401
  ├── /(dashboard)/* → 验证JWT Cookie → 通过/重定向登录
  ├── /(auth)/* → 已登录则重定向 /profile
  └── 其他 → 放行
```

受保护路径：`/profile`, `/diagnosis`, `/translation`, `/job`, `/match`, `/resume`, `/resume-builder`, `/interview`, `/plan`, `/report`, `/settings`

认证页面：`/login`, `/register`

## 1.6 数据流

### AI 调用链路
```
前端 → /api/ai/{module}/route.ts
  → getAuthUserId(request) 验证JWT（优先读 x-user-id header，fallback 解析 cookie）
  → 从请求 Body 获取 modelConfig(baseUrl, apiKey, model)
  → 加载Prompt模板 → 注入用户数据
  → AIClient.fetchWithRetry → OpenAI Chat Completions API
  → parseAIJson() 解析JSON响应（自动去除 Markdown 围栏）
  → 返回类型化数据
```

## 1.7 关键技术决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 框架 | Next.js App Router | 全栈一体，API代理保护Key |
| 样式 | Vanilla CSS | Design Token驱动，暗色模式原生支持 |
| JWT库 | jose | Edge Runtime兼容 |
| AI调用 | 原生fetch | 无需OpenAI SDK，减少依赖 |
| 数据层 | Repository Pattern | MVP内存实现，预留DB迁移 |

## 1.8 Repository Pattern 预留数据库

```typescript
// 接口定义
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDTO): Promise<User>;
}

// MVP：内存实现
class MemoryUserRepository implements IUserRepository { ... }

// 未来：数据库实现
class DatabaseUserRepository implements IUserRepository { ... }
```

## 1.9 第三方依赖

| 依赖 | 用途 | 必须 |
|------|------|------|
| next ^16.x | 全栈框架 | ✅ |
| react ^19.x | UI库 | ✅ |
| typescript ^5.x | 类型安全 | ✅ |
| jose ^6.x | JWT签发/验证 | ✅ |
| bcryptjs ^3.x | 密码哈希 | ✅ |
| uuid ^14.x | 唯一ID | ✅ |

## 1.10 环境变量

```env
# JWT
JWT_SECRET=your-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# 默认管理员（无数据库阶段）
ADMIN_EMAIL=admin@nixioffer.com
ADMIN_PASSWORD=Admin@123

# 应用
NEXT_PUBLIC_APP_NAME=逆袭Offer
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 内置模型（可选）
DEFAULT_AI_BASE_URL=https://api.deepseek.com
DEFAULT_AI_MODEL=deepseek-chat
DEFAULT_AI_API_KEY=
```

## 1.11 编码规范

1. **文件命名**：组件PascalCase，工具camelCase
2. **类型优先**：所有函数参数和返回值必须声明类型
3. **错误处理**：AI调用必须有超时和重试
4. **注释**：复杂逻辑必须有中文注释
5. **CSS类名**：BEM-like命名（`.card__header--active`）
6. **禁止any**：不使用TypeScript `any` 类型
