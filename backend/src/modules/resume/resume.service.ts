import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Prisma, Resume, ResumeVersion } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  ResumeResponse,
  ResumeVersionResponse,
  SaveResumeDto,
  SaveResumeInput,
} from "./dto/resume.dto";

@Injectable()
export class ResumeService {
  constructor(private readonly prismaService: PrismaService) {}

  async listResumes(userId: string): Promise<ResumeResponse[]> {
    try {
      const resumes = await this.prismaService.resume.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      return resumes.map((resume) => this.toResumeResponse(resume));
    } catch (error) {
      throw error;
    }
  }

  async createResume(
    userId: string,
    dto: SaveResumeDto,
  ): Promise<ResumeResponse> {
    try {
      const input = this.validateResumeDto(dto, false);

      if (input.sourceRunId !== undefined && input.sourceRunId !== null) {
        await this.assertRunOwner(userId, input.sourceRunId);
      }

      const resume = await this.prismaService.resume.create({
        data: {
          userId,
          title: input.title ?? "未命名简历",
          templateId: input.templateId ?? "classic",
          theme: input.theme ?? {},
          content: input.content ?? {},
          sourceRunId: input.sourceRunId ?? null,
        },
      });

      await this.createVersion(userId, resume.id);

      return this.toResumeResponse(resume);
    } catch (error) {
      throw error;
    }
  }

  async getResume(userId: string, resumeId: string): Promise<ResumeResponse> {
    try {
      const resume = await this.getOwnedResume(userId, resumeId);

      return this.toResumeResponse(resume);
    } catch (error) {
      throw error;
    }
  }

  async updateResume(
    userId: string,
    resumeId: string,
    dto: SaveResumeDto,
  ): Promise<ResumeResponse> {
    try {
      await this.getOwnedResume(userId, resumeId);

      const input = this.validateResumeDto(dto, true);
      const data: Prisma.ResumeUpdateInput = {};

      if (input.title !== undefined) {
        data.title = input.title;
      }

      if (input.templateId !== undefined) {
        data.templateId = input.templateId;
      }

      if (input.theme !== undefined) {
        data.theme = input.theme;
      }

      if (input.content !== undefined) {
        data.content = input.content;
      }

      if (input.sourceRunId !== undefined) {
        if (input.sourceRunId !== null) {
          await this.assertRunOwner(userId, input.sourceRunId);
        }

        data.sourceRun =
          input.sourceRunId === null
            ? { disconnect: true }
            : { connect: { id: input.sourceRunId } };
      }

      const resume = await this.prismaService.resume.update({
        where: { id: resumeId },
        data,
      });

      return this.toResumeResponse(resume);
    } catch (error) {
      throw error;
    }
  }

  async createVersion(
    userId: string,
    resumeId: string,
  ): Promise<ResumeVersionResponse> {
    try {
      const resume = await this.getOwnedResume(userId, resumeId);
      const latest = await this.prismaService.resumeVersion.findFirst({
        where: { resumeId },
        orderBy: { versionNo: "desc" },
        select: { versionNo: true },
      });
      const version = await this.prismaService.resumeVersion.create({
        data: {
          resumeId,
          versionNo: (latest?.versionNo ?? 0) + 1,
          content: this.toInputJson(resume.content),
          createdBy: userId,
        },
      });

      return this.toVersionResponse(version);
    } catch (error) {
      throw error;
    }
  }

  async duplicateResume(
    userId: string,
    resumeId: string,
  ): Promise<ResumeResponse> {
    try {
      const source = await this.getOwnedResume(userId, resumeId);
      const duplicated = await this.prismaService.resume.create({
        data: {
          userId,
          title: `${source.title} 副本`,
          templateId: source.templateId,
          theme: this.toInputJson(source.theme),
          content: this.toInputJson(source.content),
          sourceRunId: source.sourceRunId,
        },
      });

      await this.createVersion(userId, duplicated.id);

      return this.toResumeResponse(duplicated);
    } catch (error) {
      throw error;
    }
  }

  private async getOwnedResume(
    userId: string,
    resumeId: string,
  ): Promise<Resume> {
    const resume = await this.prismaService.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (resume === null) {
      throw new NotFoundException({
        code: "RESUME_NOT_FOUND",
        message: "简历不存在",
      });
    }

    return resume;
  }

  private async assertRunOwner(userId: string, runId: string): Promise<void> {
    const run = await this.prismaService.careerFlowRun.findFirst({
      where: { id: runId, userId },
      select: { id: true },
    });

    if (run === null) {
      throw new NotFoundException({
        code: "CAREER_FLOW_NOT_FOUND",
        message: "求职流程不存在",
      });
    }
  }

  private validateResumeDto(
    dto: SaveResumeDto,
    partial: boolean,
  ): SaveResumeInput {
    const input: SaveResumeInput = {};

    if (!partial || dto.title !== undefined) {
      input.title = this.readOptionalString(dto.title, "title") ?? "未命名简历";
    }

    if (!partial || dto.templateId !== undefined) {
      input.templateId =
        this.readOptionalString(dto.templateId, "templateId") ?? "classic";
    }

    if (!partial || dto.theme !== undefined) {
      input.theme = this.readJson(dto.theme, "theme");
    }

    if (!partial || dto.content !== undefined) {
      input.content = this.readJson(dto.content, "content");
    }

    if (!partial || dto.sourceRunId !== undefined) {
      input.sourceRunId = this.readNullableString(
        dto.sourceRunId,
        "sourceRunId",
      );
    }

    return input;
  }

  private readOptionalString(
    value: unknown,
    fieldName: string,
  ): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== "string") {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: `${fieldName} 必须是字符串`,
      });
    }

    return value.trim();
  }

  private readNullableString(
    value: unknown,
    fieldName: string,
  ): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const text = this.readOptionalString(value, fieldName);

    return text === undefined || text.length === 0 ? null : text;
  }

  private readJson(
    value: unknown,
    fieldName: string,
  ): Prisma.InputJsonValue | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null || typeof value === "function") {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: `${fieldName} 必须是 JSON 值`,
      });
    }

    return this.toInputJson(value);
  }

  private toInputJson(value: unknown): Prisma.InputJsonValue {
    return value as Prisma.InputJsonValue;
  }

  private toResumeResponse(resume: Resume): ResumeResponse {
    return {
      id: resume.id,
      userId: resume.userId,
      title: resume.title,
      templateId: resume.templateId,
      theme: resume.theme,
      content: resume.content,
      sourceRunId: resume.sourceRunId,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
    };
  }

  private toVersionResponse(version: ResumeVersion): ResumeVersionResponse {
    return {
      id: version.id,
      resumeId: version.resumeId,
      versionNo: version.versionNo,
      content: version.content,
      createdBy: version.createdBy,
      createdAt: version.createdAt.toISOString(),
    };
  }
}
