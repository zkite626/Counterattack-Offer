import { AIClient } from "@/lib/ai/client";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

// 连接测试 API：验证模型配置是否可用
export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return Response.json(
        { success: false, error: { code: "AUTH_TOKEN_INVALID", message: "未授权" } },
        { status: 401 }
      );
    }

    const { baseUrl, model, apiKey } = (await request.json()) as {
      baseUrl?: string;
      model?: string;
      apiKey?: string;
    };

    if (!baseUrl || !model || !apiKey) {
      return Response.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "缺少 baseUrl、model 或 apiKey" },
        },
        { status: 400 }
      );
    }

    const client = new AIClient({
      baseUrl,
      apiKey,
      model,
      timeout: 15000,
      retryCount: 0,
    });

    const result = await client.chat([
      { role: "user", content: '请回复"连接成功"' },
    ]);

    return Response.json({
      success: true,
      data: { message: "模型连接成功", response: result },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "连接失败";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message: `连接失败: ${message}` } },
      { status: 500 }
    );
  }
}
