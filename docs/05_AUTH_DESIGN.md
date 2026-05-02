# 05 — 认证设计文档

## 5.1 认证方案概述

MVP 阶段采用无数据库 JWT 认证方案，用户信息存储在服务端内存（进程启动时从环境变量初始化 + 运行时注册的用户存内存）。

### 流程图

```
注册流程:
  用户填写邮箱+密码+姓名
    → POST /api/auth/register
      → 校验参数 → 检查邮箱唯一性
        → bcrypt 哈希密码 → 存入 MemoryUserRepository
          → 签发 JWT → 设置 HttpOnly Cookie
            → 返回 User + Token

登录流程:
  用户输入邮箱+密码
    → POST /api/auth/login
      → 查找用户 → bcrypt 比对密码
        → 签发 JWT → 设置 HttpOnly Cookie
          → 返回 User + Token

认证验证:
  请求到达
    → middleware.ts 检查路径
      → 读取 Cookie 中的 token
        → jose 验证 JWT 签名和有效期
          → 通过：注入 userId 到请求
          → 失败：返回 401 或重定向登录页
```

---

## 5.2 JWT 实现 (`lib/auth/jwt.ts`)

```typescript
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// 签发 Token
export async function signToken(payload: {
  sub: string;
  email: string;
  name: string;
}, rememberMe?: boolean): Promise<string> {
  const expiresIn = rememberMe ? '30d' : '7d';
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// 验证 Token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}
```

---

## 5.3 中间件 (`middleware.ts`)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// 需要认证的路径
const protectedPaths = ['/profile', '/diagnosis', '/translation', '/job',
  '/match', '/resume', '/interview', '/plan', '/report', '/settings'];

const authPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // AI API 路由保护
  if (pathname.startsWith('/api/ai/')) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_TOKEN_INVALID', message: '未登录' } },
        { status: 401 }
      );
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_TOKEN_EXPIRED', message: 'Token已过期' } },
        { status: 401 }
      );
    }
    // 注入用户ID到请求头
    const headers = new Headers(request.headers);
    headers.set('x-user-id', payload.sub);
    return NextResponse.next({ headers });
  }

  // Dashboard 页面保护
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 已登录用户访问登录页 → 重定向到Dashboard
  if (authPaths.some(p => pathname.startsWith(p))) {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/ai/:path*', '/profile', '/diagnosis', '/translation',
    '/job', '/match', '/resume', '/interview', '/plan', '/report',
    '/settings', '/login', '/register'],
};
```

---

## 5.4 用户数据存储 (Repository Pattern)

### 接口定义 (`lib/repository/interface.ts`)

```typescript
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(dto: CreateUserDTO & { passwordHash: string }): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}
```

### 内存实现 (`lib/repository/memory.ts`)

```typescript
class MemoryUserRepository implements IUserRepository {
  private users: Map<string, UserRecord> = new Map();

  constructor() {
    // 从环境变量初始化默认管理员
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const hash = bcryptjs.hashSync(process.env.ADMIN_PASSWORD, 10);
      this.users.set('admin-uuid', {
        id: 'admin-uuid',
        email: process.env.ADMIN_EMAIL,
        name: '管理员',
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  // ... 实现方法
}
```

### 数据库实现（预留骨架）

```typescript
// lib/repository/database.ts
class DatabaseUserRepository implements IUserRepository {
  // 未来接入 Prisma / Drizzle / 等 ORM 实现
  // constructor(private db: PrismaClient) {}
}
```

### 工厂函数

```typescript
// lib/repository/index.ts
export function getUserRepository(): IUserRepository {
  if (process.env.DATABASE_URL) {
    // 未来：return new DatabaseUserRepository(db);
    throw new Error('Database not implemented yet');
  }
  return MemoryUserRepository.getInstance();
}
```

---

## 5.5 Cookie 配置

```typescript
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60,  // 7天
};

// 记住我模式
const REMEMBER_ME_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 30 * 24 * 60 * 60, // 30天
};
```

---

## 5.6 安全措施

1. **密码哈希**：bcryptjs，salt rounds = 10
2. **JWT 签名**：HS256，密钥最少 32 字符
3. **HttpOnly Cookie**：防止 XSS 读取 Token
4. **Secure Flag**：生产环境强制 HTTPS
5. **SameSite=Lax**：防止 CSRF
6. **Token 过期**：默认 7 天，记住我 30 天

---

## 5.7 数据库迁移路径

当需要接入数据库时，只需：

1. 安装 ORM（如 Prisma）
2. 创建 User 表 Schema
3. 实现 `DatabaseUserRepository`
4. 修改工厂函数返回数据库实现
5. 迁移环境变量中的管理员到数据库

**不需要修改**：JWT 逻辑、中间件、API Route、前端代码。
