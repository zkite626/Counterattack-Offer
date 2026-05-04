import { NextResponse } from "next/server";

// 返回 .env.local 中配置的默认 AI 模型信息
export async function GET() {
  const baseUrl = process.env.DEFAULT_AI_BASE_URL || "";
  const model = process.env.DEFAULT_AI_MODEL || "";
  const apiKey = process.env.DEFAULT_AI_API_KEY || "";

  if (!baseUrl || !model) {
    return NextResponse.json({ success: true, data: null });
  }

  return NextResponse.json({
    success: true,
    data: {
      baseUrl,
      model,
      hasApiKey: apiKey.length > 0,
      // 仅在设置了 key 时返回，前端存入 localStorage 后由 Context 管理
      apiKey: apiKey || undefined,
    },
  });
}
