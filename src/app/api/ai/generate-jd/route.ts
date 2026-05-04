import { AIClient } from "@/lib/ai/client";
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
    const { jobTitle, modelConfig } = body as {
      jobTitle: string;
      modelConfig: AIModelConfig;
    };

    if (!jobTitle?.trim()) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "缺少 jobTitle" } },
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
      temperature: 0.7,
      maxTokens: 2048,
    });

    const result = await client.chat([
      {
        role: "system",
        content: "你是一个招聘专家。根据用户提供的岗位名称，生成一份真实、专业的岗位描述（JD）。要求：1）包含岗位名称、岗位职责（4-5条）、任职要求（4-5条）；2）内容要具体、真实，像真正的招聘信息；3）用中文输出，格式清晰。",
      },
      {
        role: "user",
        content: `请为以下岗位生成一份参考 JD：${jobTitle.trim()}`,
      },
    ]);

    return Response.json({ success: true, data: { jd: result } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 服务异常";
    return Response.json(
      { success: false, error: { code: "AI_MODEL_ERROR", message } },
      { status: 500 }
    );
  }
}
