import { AIClient } from "@/lib/ai/client";
import { getSystemPrompt, getUserPrompt } from "@/prompts/final-report";
import type { AIModelConfig } from "@/types/ai";
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
    const {
      careerDiagnosis,
      experienceTranslations,
      jobAnalysis,
      matchReport,
      resumeOptimization,
      interviewSimulation,
      improvementPlan,
      modelConfig,
    } = body as {
      careerDiagnosis: Record<string, unknown>;
      experienceTranslations: Record<string, unknown>[];
      jobAnalysis: Record<string, unknown>;
      matchReport: Record<string, unknown>;
      resumeOptimization: Record<string, unknown>;
      interviewSimulation: Record<string, unknown>[];
      improvementPlan: Record<string, unknown>;
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
      maxTokens: modelConfig.maxTokens ?? 8192,
    });

    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt({
      careerDiagnosis: JSON.stringify(careerDiagnosis, null, 2),
      experienceTranslations: JSON.stringify(experienceTranslations, null, 2),
      jobAnalysis: JSON.stringify(jobAnalysis, null, 2),
      matchReport: JSON.stringify(matchReport, null, 2),
      resumeOptimization: JSON.stringify(resumeOptimization, null, 2),
      interviewSimulation: JSON.stringify(interviewSimulation, null, 2),
      improvementPlan: JSON.stringify(improvementPlan, null, 2),
    });

    // 报告返回 Markdown 文本，非 JSON
    const result = await client.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    return Response.json({ success: true, data: { markdown: result } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message } },
      { status: 500 }
    );
  }
}
