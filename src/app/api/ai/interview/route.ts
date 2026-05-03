import { AIClient } from "@/lib/ai/client";
import { getSystemPrompt, getUserPrompt } from "@/prompts/interview";
import type { AIModelConfig } from "@/types/ai";
import type { InterviewSimulation } from "@/types";
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
    const { careerDiagnosis, resumeOptimization, jobAnalysis, modelConfig } = body as {
      careerDiagnosis: Record<string, unknown>;
      resumeOptimization: Record<string, unknown>;
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
      resumeOptimization: JSON.stringify(resumeOptimization, null, 2),
      jobAnalysis: JSON.stringify(jobAnalysis, null, 2),
    });

    const result = await client.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], true);

    const parsed = JSON.parse(result) as { interviewSimulation: InterviewSimulation[] };
    return Response.json({ success: true, data: parsed.interviewSimulation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message } },
      { status: 500 }
    );
  }
}
