import { AIClient } from "@/lib/ai/client";
import { getSystemPrompt, getUserPrompt } from "@/prompts/translate-experience";
import type { AIModelConfig } from "@/types/ai";
import type { ExperienceTranslation } from "@/types";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { parseAIJson } from "@/lib/utils/parse-json";

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
    const { rawExperiences, targetRoles, modelConfig } = body as {
      rawExperiences: string[];
      targetRoles: string[];
      modelConfig: AIModelConfig;
    };

    if (!rawExperiences?.length) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "缺少 rawExperiences" } },
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
      rawExperiences: rawExperiences.map((e, i) => `${i + 1}. ${e}`).join("\n"),
      targetRoles: targetRoles.join("、"),
    });

    const result = await client.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], true);

    const parsed = parseAIJson<{ experienceTranslations: ExperienceTranslation[] }>(result);
    return Response.json({ success: true, data: parsed.experienceTranslations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message } },
      { status: 500 }
    );
  }
}
