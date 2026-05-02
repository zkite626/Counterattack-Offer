import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getUserRepository } from "@/lib/repository";
import { signToken } from "@/lib/auth/jwt";

// 一键 Demo 模式 — 自动创建临时账户并登录
export async function POST() {
  try {
    const repo = getUserRepository();

    // 生成唯一 Demo 账户
    const ts = Date.now();
    const email = `demo_${ts}@demo.offer`;
    const password = `Demo${ts}!`;
    const name = "Demo体验用户";

    // 哈希密码并创建用户
    const passwordHash = await bcryptjs.hash(password, 10);
    const user = await repo.create({ email, password, name, passwordHash });

    // 签发 JWT（30天有效）
    const token = await signToken(
      { sub: user.id, email: user.email, name: user.name },
      true // rememberMe = true
    );

    const response = NextResponse.json(
      { success: true, data: { user, token, isDemo: true } },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Demo 创建失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Demo 账户创建失败" },
      },
      { status: 500 }
    );
  }
}
