import { AIClient } from "@/lib/ai/client";
import { getSystemPrompt, getUserPrompt } from "@/prompts/match-report";
import type { AIModelConfig } from "@/types/ai";
import type { MatchReport } from "@/types";

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json(
        { success: false, error: { code: "AUTH_TOKEN_INVALID", message: "未授权" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { careerDiagnosis, experienceTranslations, jobAnalysis, modelConfig } = body as {
      careerDiagnosis: Record<string, unknown>;
      experienceTranslations: Record<string, unknown>[];
      jobAnalysis: Record<string, unknown>;
      modelConfig: AIModelConfig;
    };

    if (!careerDiagnosis || !jobAnalysis) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "缺少诊断或岗位数据" } },
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
      careerDiagnosis: JSON.stringify(careerDiagnosis, null, 2),
      experienceTranslations: JSON.stringify(experienceTranslations, null, 2),
      jobAnalysis: JSON.stringify(jobAnalysis, null, 2),
    });

    const result = await client.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], true);

    const data: MatchReport = JSON.parse(result);
    return Response.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message } },
      { status: 500 }
    );
  }
}
