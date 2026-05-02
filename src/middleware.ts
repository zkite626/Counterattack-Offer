import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

// 需要认证的 Dashboard 页面路径
const protectedPaths = [
  "/profile",
  "/diagnosis",
  "/translation",
  "/job",
  "/match",
  "/resume",
  "/interview",
  "/plan",
  "/report",
  "/settings",
];

// 已登录用户应重定向的认证页面路径
const authPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. AI API 路由保护
  if (pathname.startsWith("/api/ai/")) {
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "AUTH_TOKEN_MISSING", message: "未登录" },
        },
        { status: 401 }
      );
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "AUTH_TOKEN_EXPIRED", message: "Token已过期" },
        },
        { status: 401 }
      );
    }
    // 注入用户ID到请求头，供下游使用
    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload.sub);
    return NextResponse.next({ headers });
  }

  // 2. Dashboard 页面保护
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. 已登录用户访问登录/注册页 → 重定向到 profile
  if (authPaths.some((p) => pathname.startsWith(p))) {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/ai/:path*",
    "/profile",
    "/diagnosis",
    "/translation",
    "/job",
    "/match",
    "/resume",
    "/interview",
    "/plan",
    "/report",
    "/settings",
    "/login",
    "/register",
  ],
};
