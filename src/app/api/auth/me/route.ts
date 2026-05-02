import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { getUserRepository } from "@/lib/repository";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

    const repo = getUserRepository();
    const user = await repo.findById(payload.sub);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "USER_NOT_FOUND", message: "用户不存在" },
        },
        { status: 401 }
      );
    }

    // 返回时不包含密码哈希
    const { passwordHash: _, ...publicUser } = user;
    return NextResponse.json({ success: true, data: publicUser }, { status: 200 });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    );
  }
}
