import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getUserRepository } from "@/lib/repository";
import { signToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // 参数校验
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "邮箱和密码为必填项" },
        },
        { status: 400 }
      );
    }

    const repo = getUserRepository();

    // 查找用户
    const user = await repo.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "AUTH_FAILED", message: "邮箱或密码错误" },
        },
        { status: 401 }
      );
    }

    // 比对密码
    const valid = await bcryptjs.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "AUTH_FAILED", message: "邮箱或密码错误" },
        },
        { status: 401 }
      );
    }

    // 签发 JWT
    const token = await signToken(
      { sub: user.id, email: user.email, name: user.name },
      rememberMe
    );

    // 返回用户信息（不含密码哈希）
    const { passwordHash: _, ...publicUser } = user;

    const response = NextResponse.json(
      { success: true, data: { user: publicUser, token } },
      { status: 200 }
    );

    setAuthCookie(response.cookies, token, rememberMe);

    return response;
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    );
  }
}
