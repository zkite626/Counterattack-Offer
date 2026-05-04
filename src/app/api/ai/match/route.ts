import { AIClient } from "@/lib/ai/client";
import { getSystemPrompt, getUserPrompt } from "@/prompts/match-report";
import type { AIModelConfig } from "@/types/ai";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { parseAIJson } from "@/lib/utils/parse-json";
import { normalizeMatchReport } from "@/lib/utils/ai-results";

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
    const { careerDiagnosis, experienceTranslations, jobAnalysis, modelConfig } = body as {
      careerDiagnosis: Record<string, unknown>;
      experienceTranslations: Record<string, unknown>[];
      jobAnalysis?: Record<string, unknown> | null;
      modelConfig: AIModelConfig;
    };

    if (!careerDiagnosis) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "缺少诊断数据" } },
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
      jobAnalysis: jobAnalysis
        ? JSON.stringify(jobAnalysis, null, 2)
        : "用户未提供 JD，请基于学生画像、经历转译和目标岗位方向进行泛匹配分析。",
    });

    const result = await client.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], true);

    const data = normalizeMatchReport(parseAIJson<unknown>(result));
    if (!data) {
      throw new Error("AI 返回的人岗匹配结果格式不正确");
    }

    return Response.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message } },
      { status: 500 }
    );
  }
}
