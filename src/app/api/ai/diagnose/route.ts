import { AIClient } from "@/lib/ai/client";
import { getSystemPrompt, getUserPrompt } from "@/prompts/diagnose";
import type { AIModelConfig } from "@/types/ai";
import type { CareerDiagnosis } from "@/types";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

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
    const { studentProfile, modelConfig } = body as {
      studentProfile: Record<string, unknown>;
      modelConfig: AIModelConfig;
    };

    if (!studentProfile) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "缺少 studentProfile" } },
        { status: 400 }
      );
    }
    if (!modelConfig?.baseUrl || !modelConfig?.apiKey || !modelConfig?.model) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "缺少 modelConfig 必填字段" } },
        { status: 400 }
      );
    }

    const client = new AIClient({
      baseUrl: modelConfig.baseUrl,
      apiKey: modelConfig.apiKey,
      model: modelConfig.model,
      temperature: modelConfig.temperature ?? 0.7,
      maxTokens: modelConfig.maxTokens ?? 4096,
    });

    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt({
      studentProfile: JSON.stringify(studentProfile, null, 2),
    });

    const result = await client.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], true);

    const data: CareerDiagnosis = JSON.parse(result);
    return Response.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message } },
      { status: 500 }
    );
  }
}
