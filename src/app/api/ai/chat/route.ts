import { AIClient } from "@/lib/ai/client";
import type { ChatMessage, AIModelConfig } from "@/types/ai";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

// AI 代理 API：统一代聊接口，支持流式和非流式
export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return Response.json(
        { success: false, error: { code: "AUTH_TOKEN_INVALID", message: "未授权" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messages, modelConfig, stream } = body as {
      messages: ChatMessage[];
      modelConfig: AIModelConfig;
      stream?: boolean;
    };

    // 参数校验
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "messages 不能为空" } },
        { status: 400 }
      );
    }
    if (!modelConfig?.baseUrl || !modelConfig?.apiKey || !modelConfig?.model) {
      return Response.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "缺少 modelConfig 必填字段" },
        },
        { status: 400 }
      );
    }

    // 创建 AI 客户端
    const client = new AIClient({
      baseUrl: modelConfig.baseUrl,
      apiKey: modelConfig.apiKey,
      model: modelConfig.model,
      temperature: modelConfig.temperature ?? 0.7,
      maxTokens: modelConfig.maxTokens ?? 4096,
    });

    // 流式响应
    if (stream) {
      const aiStream = await client.chatStream(messages);
      return new Response(aiStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // 非流式响应
    const result = await client.chat(messages);
    return Response.json({ success: true, data: { content: result } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    const code =
      error instanceof Error && "code" in error
        ? (error as { code: string }).code
        : "AI_MODEL_ERROR";

    return Response.json(
      { success: false, error: { code, message } },
      { status: 500 }
    );
  }
}
