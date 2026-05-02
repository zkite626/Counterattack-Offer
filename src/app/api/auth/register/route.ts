import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getUserRepository } from "@/lib/repository";
import { signToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 参数校验
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "邮箱、密码和姓名为必填项" },
        },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "密码至少需要8个字符" },
        },
        { status: 400 }
      );
    }

    const repo = getUserRepository();

    // 检查邮箱唯一性
    const existing = await repo.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "EMAIL_EXISTS", message: "该邮箱已被注册" },
        },
        { status: 409 }
      );
    }

    // 哈希密码并创建用户
    const passwordHash = await bcryptjs.hash(password, 10);
    const user = await repo.create({ email, password, name, passwordHash });

    // 签发 JWT
    const token = await signToken({ sub: user.id, email: user.email, name: user.name });

    // 设置 HttpOnly Cookie
    const response = NextResponse.json(
      { success: true, data: { user, token } },
      { status: 201 }
    );
    // 通过 response.cookies 设置
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    );
  }
}
