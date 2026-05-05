import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { CareerFlowService } from "../career-flow/career-flow.service";
import type { ChatMessage } from "./ai-client";
import { AiService } from "./ai.service";
import type { AIInvokeResult } from "./dto/ai.dto";
import type {
  AIBusinessContext,
  AIBusinessRequestDto,
} from "./dto/ai-business.dto";
import {
  analyzeJobPrompt,
  careerQaPrompt,
  diagnosePrompt,
  generateJdPrompt,
  interviewPrompt,
  matchPrompt,
  optimizeResumePrompt,
  planPrompt,
  PromptTemplate,
  reportPrompt,
  translatePrompt,
} from "./prompts";

@Injectable()
export class AiBusinessService {
  constructor(
    private readonly aiService: AiService,
    private readonly careerFlowService: CareerFlowService,
  ) {}

  async diagnose(userId: string, dto: AIBusinessRequestDto): Promise<unknown> {
    try {
      const context = await this.resolveContext(userId, dto, "profile");
      const studentProfile = this.requireValue(
        context.input.studentProfile,
        "studentProfile",
      );
      const parsed = await this.invokeJson(userId, context, "diagnose", {
        step: "diagnosis",
        prompt: diagnosePrompt,
        variables: {
          studentProfile: this.stringify(studentProfile),
        },
      });

      return this.requireRecord(parsed, "AI 画像诊断结果");
    } catch (error) {
      throw error;
    }
  }

  async translate(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<unknown[]> {
    try {
      const context = await this.resolveContext(userId, dto, "translation");
      const rawExperiences = this.readStringArray(
        context.input.rawExperiences,
        "rawExperiences",
      );
      const targetRoles = this.readStringArray(
        context.input.targetRoles,
        "targetRoles",
      );

      if (rawExperiences.length === 0) {
        throw this.validationError("缺少 rawExperiences");
      }

      const parsed = await this.invokeJson(userId, context, "translate", {
        step: "translation",
        prompt: translatePrompt,
        variables: {
          rawExperiences: rawExperiences
            .map((experience, index) => `${index + 1}. ${experience}`)
            .join("\n"),
          targetRoles: targetRoles.join("、"),
        },
      });

      return this.unwrapArray(parsed, "experienceTranslations");
    } catch (error) {
      throw error;
    }
  }

  async analyzeJob(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<Record<string, unknown>> {
    try {
      const context = await this.resolveContext(userId, dto, "job");
      const jobDescription = this.readRequiredString(
        context.input.jobDescription,
        "jobDescription",
      );
      const parsed = await this.invokeJson(userId, context, "analyze_job", {
        step: "job",
        prompt: analyzeJobPrompt,
        variables: { jobDescription },
      });

      return this.requireRecord(parsed, "AI JD 解析结果");
    } catch (error) {
      throw error;
    }
  }

  async match(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<Record<string, unknown>> {
    try {
      const context = await this.resolveContext(userId, dto, "match");
      const parsed = await this.invokeJson(userId, context, "match", {
        step: "match",
        prompt: matchPrompt,
        variables: {
          careerDiagnosis: this.stringify(
            this.requireValue(context.input.careerDiagnosis, "careerDiagnosis"),
          ),
          experienceTranslations: this.stringify(
            context.input.experienceTranslations ?? [],
          ),
          jobAnalysis: this.stringify(
            context.input.jobAnalysis ??
              "用户未提供 JD，请基于学生画像、经历转译和目标岗位方向进行泛匹配分析。",
          ),
        },
      });

      return this.requireRecord(parsed, "AI 人岗匹配结果");
    } catch (error) {
      throw error;
    }
  }

  async optimizeResume(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<Record<string, unknown>> {
    try {
      const context = await this.resolveContext(userId, dto, "resume");
      const parsed = await this.invokeJson(userId, context, "optimize_resume", {
        step: "resume",
        prompt: optimizeResumePrompt,
        variables: {
          rawExperiences: this.stringify(context.input.rawExperiences ?? []),
          experienceTranslations: this.stringify(
            this.requireValue(
              context.input.experienceTranslations,
              "experienceTranslations",
            ),
          ),
          jobAnalysis: this.stringify(
            this.requireValue(context.input.jobAnalysis, "jobAnalysis"),
          ),
          matchReport: this.stringify(context.input.matchReport ?? {}),
        },
      });

      return this.requireRecord(parsed, "AI 简历优化结果");
    } catch (error) {
      throw error;
    }
  }

  async interview(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<unknown[]> {
    try {
      const context = await this.resolveContext(userId, dto, "interview");
      const parsed = await this.invokeJson(userId, context, "interview", {
        step: "interview",
        prompt: interviewPrompt,
        variables: {
          careerDiagnosis: this.stringify(
            this.requireValue(context.input.careerDiagnosis, "careerDiagnosis"),
          ),
          resumeOptimization: this.stringify(
            context.input.resumeOptimization ?? {},
          ),
          jobAnalysis: this.stringify(
            context.input.jobAnalysis ??
              "用户未提供 JD，请基于画像中的推荐岗位生成通用面试训练问题。",
          ),
        },
      });

      return this.unwrapArray(parsed, "interviewSimulation");
    } catch (error) {
      throw error;
    }
  }

  async plan(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<Record<string, unknown>> {
    try {
      const context = await this.resolveContext(userId, dto, "plan");
      const parsed = await this.invokeJson(userId, context, "plan", {
        step: "plan",
        prompt: planPrompt,
        variables: {
          careerDiagnosis: this.stringify(
            this.requireValue(context.input.careerDiagnosis, "careerDiagnosis"),
          ),
          jobAnalysis: this.stringify(
            context.input.jobAnalysis ??
              "用户未提供 JD，请基于画像中的推荐岗位制定通用求职突围计划。",
          ),
          matchReport: this.stringify(context.input.matchReport ?? {}),
        },
      });

      return this.requireRecord(parsed, "AI 行动计划结果");
    } catch (error) {
      throw error;
    }
  }

  async report(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<{ markdown: string; report: string }> {
    try {
      const context = await this.resolveContext(userId, dto, "report");
      const result = await this.invokeText(userId, context, "report", {
        step: "report",
        prompt: reportPrompt,
        variables: {
          careerDiagnosis: this.stringify(
            this.requireValue(context.input.careerDiagnosis, "careerDiagnosis"),
          ),
          experienceTranslations: this.stringify(
            context.input.experienceTranslations ?? [],
          ),
          jobAnalysis: this.stringify(context.input.jobAnalysis ?? {}),
          matchReport: this.stringify(context.input.matchReport ?? {}),
          resumeOptimization: this.stringify(
            context.input.resumeOptimization ?? {},
          ),
          interviewSimulation: this.stringify(
            context.input.interviewSimulation ?? [],
          ),
          improvementPlan: this.stringify(context.input.improvementPlan ?? {}),
        },
      });
      const data = { markdown: result, report: result };

      await this.saveResult(context, "report", data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async generateJd(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<{ jd: string }> {
    try {
      const context = await this.resolveContext(userId, dto, "job");
      const jobTitle = this.readRequiredString(
        context.input.jobTitle,
        "jobTitle",
      );
      const jd = await this.invokeText(userId, context, "generate_jd", {
        step: "job",
        prompt: generateJdPrompt,
        variables: { jobTitle },
      });
      const data = { jd };

      await this.saveResult(context, "job", data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async careerQa(
    userId: string,
    dto: AIBusinessRequestDto,
  ): Promise<ReadableStream<Uint8Array>> {
    try {
      const body = this.toRecord(dto, "body");
      const input = this.isRecord(body.input) ? { ...body.input } : { ...body };
      const modelConfigId =
        this.readOptionalString(body.modelConfigId, "modelConfigId") ??
        this.readOptionalString(input.modelConfigId, "input.modelConfigId") ??
        null;
      const contextSummary =
        this.readOptionalString(
          input.contextSummary ?? input.userContext ?? input.profileSummary,
          "input.contextSummary",
        ) ?? "";
      const messages = this.readChatMessages(
        input.messages ?? input.history,
        "messages",
      );
      const question = this.readOptionalString(input.question, "input.question");
      const chatMessages: ChatMessage[] =
        messages.length > 0
          ? messages
          : question
            ? [{ role: "user" as const, content: question }]
            : [];

      if (chatMessages.length === 0) {
        throw this.validationError("缺少 messages");
      }

      const systemContent = [
        careerQaPrompt.system,
        contextSummary.length > 0
          ? `可参考的用户信息（只有相关时再使用，没有信息也要正常回答）：\n${contextSummary}`
          : null,
      ]
        .filter((line): line is string => Boolean(line))
        .join("\n\n");

      const requestMessages: ChatMessage[] = [
        { role: "system", content: systemContent },
        ...chatMessages,
      ];

      return await this.aiService.chatStream(userId, {
        module: "career_qa",
        modelConfigId,
        messages: requestMessages,
      });
    } catch (error) {
      throw error;
    }
  }

  private async invokeJson(
    userId: string,
    context: AIBusinessContext,
    module: string,
    input: {
      step: string;
      prompt: PromptTemplate;
      variables: Record<string, string>;
    },
  ): Promise<unknown> {
    const result = await this.aiService.chat(userId, {
      module,
      modelConfigId: context.modelConfigId,
      messages: this.buildMessages(input.prompt, input.variables),
      jsonMode: true,
    });
    const parsed = this.parseAIJson(result.content);

    await this.saveResultWithModel(context, input.step, parsed, result);

    return parsed;
  }

  private async invokeText(
    userId: string,
    context: AIBusinessContext,
    module: string,
    input: {
      step: string;
      prompt: PromptTemplate;
      variables: Record<string, string>;
    },
  ): Promise<string> {
    const result = await this.aiService.chat(userId, {
      module,
      modelConfigId: context.modelConfigId,
      messages: this.buildMessages(input.prompt, input.variables),
      jsonMode: false,
    });

    context.modelConfigId = result.modelConfigId;

    return result.content;
  }

  private async saveResultWithModel(
    context: AIBusinessContext,
    step: string,
    result: unknown,
    aiResult: AIInvokeResult,
  ): Promise<void> {
    context.modelConfigId = aiResult.modelConfigId;
    await this.saveResult(context, step, result);
  }

  private async saveResult(
    context: AIBusinessContext,
    step: string,
    result: unknown,
  ): Promise<void> {
    await this.careerFlowService.saveResult({
      runId: context.runId,
      userId: context.userId,
      step,
      inputSnapshot: context.inputSnapshot,
      result: this.toInputJson(result),
      modelConfigId: context.modelConfigId,
    });
  }

  private buildMessages(
    prompt: PromptTemplate,
    variables: Record<string, string>,
  ): ChatMessage[] {
    return [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user(variables) },
    ];
  }

  private readChatMessages(
    value: unknown,
    fieldName: string,
  ): ChatMessage[] {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      throw this.validationError(`${fieldName} 必须是消息数组`);
    }

    return value
      .flatMap((item, index) => {
        if (!this.isRecord(item)) {
          throw this.validationError(`${fieldName}[${index}] 必须是对象`);
        }

        const role = this.readOptionalString(
          item.role,
          `${fieldName}[${index}].role`,
        );
        const content = this.readOptionalString(
          item.content,
          `${fieldName}[${index}].content`,
        );

        if (!role || !content) {
          throw this.validationError(
            `${fieldName}[${index}] 必须包含 role 和 content`,
          );
        }

        if (role !== "user" && role !== "assistant") {
          return [];
        }

        return [{ role, content }];
      })
      .filter(
        (message): message is ChatMessage =>
          message.role === "user" || message.role === "assistant",
      );
  }

  private async resolveContext(
    userId: string,
    dto: AIBusinessRequestDto,
    fallbackStep: string,
  ): Promise<AIBusinessContext> {
    const body = this.toRecord(dto, "body");
    const input = this.isRecord(body.input) ? { ...body.input } : { ...body };
    const runIdFromBody = this.readOptionalString(body.runId, "runId");
    const runIdFromInput = this.readOptionalString(input.runId, "input.runId");
    const modelConfigId =
      this.readOptionalString(body.modelConfigId, "modelConfigId") ??
      this.readOptionalString(input.modelConfigId, "input.modelConfigId") ??
      null;
    let runId = runIdFromBody ?? runIdFromInput;

    delete input.modelConfig;
    if (runId === undefined || runId.length === 0) {
      const flow = await this.careerFlowService.createFlow(userId, {
        targetRole:
          input.jobTitle ??
          this.firstStringFromArray(input.targetRoles) ??
          input.targetRole,
        jobDescription: input.jobDescription,
        currentStep: fallbackStep,
        status: "running",
      });

      runId = flow.id;
    } else {
      await this.careerFlowService.assertFlowOwner(userId, runId);
    }

    return {
      userId,
      runId,
      modelConfigId,
      input,
      inputSnapshot: this.toInputJson(input),
    };
  }

  private firstStringFromArray(value: unknown): string | undefined {
    if (!Array.isArray(value)) {
      return undefined;
    }

    return value.find((item): item is string => typeof item === "string");
  }

  private parseAIJson(raw: string): unknown {
    try {
      let cleaned = raw.trim();
      const fenceMatch = cleaned.match(
        /^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/,
      );

      if (fenceMatch !== null) {
        cleaned = fenceMatch[1].trim();
      }

      const objectStart = cleaned.indexOf("{");
      const arrayStart = cleaned.indexOf("[");
      const starts = [objectStart, arrayStart].filter((index) => index >= 0);

      if (starts.length === 0) {
        throw new Error("JSON start not found");
      }

      const start = Math.min(...starts);

      if (start > 0) {
        cleaned = cleaned.slice(start);
      }

      const objectEnd = cleaned.lastIndexOf("}");
      const arrayEnd = cleaned.lastIndexOf("]");
      const end = Math.max(objectEnd, arrayEnd);

      if (end >= 0 && end < cleaned.length - 1) {
        cleaned = cleaned.slice(0, end + 1);
      }

      return JSON.parse(cleaned) as unknown;
    } catch (error) {
      throw new BadGatewayException({
        code: "AI_PARSE_ERROR",
        message: "AI 返回格式无法解析，请稍后重试或切换模型",
      });
    }
  }

  private unwrapArray(value: unknown, key: string): unknown[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (this.isRecord(value) && Array.isArray(value[key])) {
      return value[key];
    }

    throw new BadGatewayException({
      code: "AI_RESPONSE_FORMAT_ERROR",
      message: `AI 返回缺少 ${key} 数组`,
    });
  }

  private requireRecord(
    value: unknown,
    label: string,
  ): Record<string, unknown> {
    if (this.isRecord(value)) {
      return value;
    }

    throw new BadGatewayException({
      code: "AI_RESPONSE_FORMAT_ERROR",
      message: `${label}格式不正确`,
    });
  }

  private requireValue(value: unknown, fieldName: string): unknown {
    if (value === undefined || value === null) {
      throw this.validationError(`缺少 ${fieldName}`);
    }

    return value;
  }

  private readRequiredString(value: unknown, fieldName: string): string {
    const text = this.readOptionalString(value, fieldName);

    if (text === undefined || text.length === 0) {
      throw this.validationError(`缺少 ${fieldName}`);
    }

    return text;
  }

  private readOptionalString(
    value: unknown,
    fieldName: string,
  ): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== "string") {
      throw this.validationError(`${fieldName} 必须是字符串`);
    }

    return value.trim();
  }

  private readStringArray(value: unknown, fieldName: string): string[] {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      throw this.validationError(`${fieldName} 必须是字符串数组`);
    }

    return value
      .map((item) => {
        if (typeof item !== "string") {
          throw this.validationError(`${fieldName} 必须是字符串数组`);
        }

        return item.trim();
      })
      .filter((item) => item.length > 0);
  }

  private stringify(value: unknown): string {
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }

  private toRecord(value: unknown, fieldName: string): Record<string, unknown> {
    if (!this.isRecord(value)) {
      throw this.validationError(`${fieldName} 必须是对象`);
    }

    return value;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private toInputJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private validationError(message: string): BadRequestException {
    return new BadRequestException({
      code: "VALIDATION_ERROR",
      message,
    });
  }
}
