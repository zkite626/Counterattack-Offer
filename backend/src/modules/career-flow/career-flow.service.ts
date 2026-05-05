import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CareerFlowResult,
  CareerFlowRun,
  CareerFlowStatus,
  Prisma,
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  CareerFlowDetailResponse,
  CareerFlowResponse,
  CareerFlowResultResponse,
  CareerFlowResultsResponse,
  CareerFlowStatusResponse,
  SaveCareerFlowDto,
  SaveCareerFlowInput,
  SaveCareerFlowResultInput,
} from "./dto/career-flow.dto";

type FlowWithResults = CareerFlowRun & { results: CareerFlowResult[] };

const statusToPrisma: Record<CareerFlowStatusResponse, CareerFlowStatus> = {
  draft: CareerFlowStatus.DRAFT,
  running: CareerFlowStatus.RUNNING,
  completed: CareerFlowStatus.COMPLETED,
  failed: CareerFlowStatus.FAILED,
};

const statusToResponse: Record<CareerFlowStatus, CareerFlowStatusResponse> = {
  [CareerFlowStatus.DRAFT]: "draft",
  [CareerFlowStatus.RUNNING]: "running",
  [CareerFlowStatus.COMPLETED]: "completed",
  [CareerFlowStatus.FAILED]: "failed",
};

@Injectable()
export class CareerFlowService {
  constructor(private readonly prismaService: PrismaService) {}

  async listFlows(userId: string): Promise<CareerFlowResponse[]> {
    try {
      const flows = await this.prismaService.careerFlowRun.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      return flows.map((flow) => this.toFlowResponse(flow));
    } catch (error) {
      throw error;
    }
  }

  async createFlow(
    userId: string,
    dto: SaveCareerFlowDto,
  ): Promise<CareerFlowResponse> {
    try {
      const input = this.validateFlowDto(dto, false);
      const flow = await this.prismaService.careerFlowRun.create({
        data: {
          userId,
          targetRole: input.targetRole ?? null,
          jobDescription: input.jobDescription ?? null,
          status: statusToPrisma[input.status ?? "draft"],
          currentStep: input.currentStep ?? "profile",
        },
      });

      return this.toFlowResponse(flow);
    } catch (error) {
      throw error;
    }
  }

  async getFlow(
    userId: string,
    flowId: string,
  ): Promise<CareerFlowDetailResponse> {
    try {
      const flow = await this.prismaService.careerFlowRun.findFirst({
        where: { id: flowId, userId },
        include: {
          results: { orderBy: { createdAt: "asc" } },
        },
      });

      if (flow === null) {
        throw this.notFoundError();
      }

      return this.toFlowDetailResponse(flow);
    } catch (error) {
      throw error;
    }
  }

  async updateFlow(
    userId: string,
    flowId: string,
    dto: SaveCareerFlowDto,
  ): Promise<CareerFlowResponse> {
    try {
      await this.assertFlowOwner(userId, flowId);

      const input = this.validateFlowDto(dto, true);
      const data: Prisma.CareerFlowRunUpdateInput = {};

      if (input.targetRole !== undefined) {
        data.targetRole = input.targetRole;
      }

      if (input.jobDescription !== undefined) {
        data.jobDescription = input.jobDescription;
      }

      if (input.status !== undefined) {
        data.status = statusToPrisma[input.status];
      }

      if (input.currentStep !== undefined) {
        data.currentStep = input.currentStep;
      }

      const flow = await this.prismaService.careerFlowRun.update({
        where: { id: flowId },
        data,
      });

      return this.toFlowResponse(flow);
    } catch (error) {
      throw error;
    }
  }

  async getResults(
    userId: string,
    flowId: string,
  ): Promise<CareerFlowResultsResponse> {
    try {
      await this.assertFlowOwner(userId, flowId);

      const results = await this.prismaService.careerFlowResult.findMany({
        where: { runId: flowId },
        orderBy: { createdAt: "asc" },
      });
      const mapped = results.map((result) => this.toResultResponse(result));
      const latestResults: Record<string, CareerFlowResultResponse> = {};

      for (const result of mapped) {
        latestResults[result.step] = result;
      }

      return { results: mapped, latestResults };
    } catch (error) {
      throw error;
    }
  }

  async saveResult(
    input: SaveCareerFlowResultInput,
  ): Promise<CareerFlowResultResponse> {
    try {
      await this.assertFlowOwner(input.userId, input.runId);

      const result = await this.prismaService.careerFlowResult.create({
        data: {
          runId: input.runId,
          step: input.step,
          inputSnapshot: input.inputSnapshot,
          result: input.result,
          modelConfigId: input.modelConfigId,
        },
      });

      await this.prismaService.careerFlowRun.update({
        where: { id: input.runId },
        data: {
          currentStep: input.step,
          status: CareerFlowStatus.RUNNING,
        },
      });

      return this.toResultResponse(result);
    } catch (error) {
      throw error;
    }
  }

  async assertFlowOwner(userId: string, flowId: string): Promise<void> {
    try {
      const flow = await this.prismaService.careerFlowRun.findFirst({
        where: { id: flowId, userId },
        select: { id: true },
      });

      if (flow === null) {
        throw this.notFoundError();
      }
    } catch (error) {
      throw error;
    }
  }

  private validateFlowDto(
    dto: SaveCareerFlowDto,
    partial: boolean,
  ): SaveCareerFlowInput {
    const input: SaveCareerFlowInput = {};

    if (!partial || dto.targetRole !== undefined) {
      input.targetRole = this.readNullableString(dto.targetRole, "targetRole");
    }

    if (!partial || dto.jobDescription !== undefined) {
      input.jobDescription = this.readNullableString(
        dto.jobDescription,
        "jobDescription",
      );
    }

    if (!partial || dto.status !== undefined) {
      input.status = this.readStatus(dto.status, "status") ?? "draft";
    }

    if (!partial || dto.currentStep !== undefined) {
      input.currentStep =
        this.readNullableString(dto.currentStep, "currentStep") ?? "profile";
    }

    return input;
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

    if (typeof value !== "string") {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: `${fieldName} 必须是字符串`,
      });
    }

    const trimmed = value.trim();

    return trimmed.length === 0 ? null : trimmed;
  }

  private readStatus(
    value: unknown,
    fieldName: string,
  ): CareerFlowStatusResponse | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (
      value === "draft" ||
      value === "running" ||
      value === "completed" ||
      value === "failed"
    ) {
      return value;
    }

    throw new BadRequestException({
      code: "VALIDATION_ERROR",
      message: `${fieldName} 状态无效`,
    });
  }

  private notFoundError(): NotFoundException {
    return new NotFoundException({
      code: "CAREER_FLOW_NOT_FOUND",
      message: "求职流程不存在",
    });
  }

  private toFlowDetailResponse(
    flow: FlowWithResults,
  ): CareerFlowDetailResponse {
    return {
      ...this.toFlowResponse(flow),
      results: flow.results.map((result) => this.toResultResponse(result)),
    };
  }

  private toFlowResponse(flow: CareerFlowRun): CareerFlowResponse {
    return {
      id: flow.id,
      userId: flow.userId,
      targetRole: flow.targetRole,
      jobDescription: flow.jobDescription,
      status: statusToResponse[flow.status],
      currentStep: flow.currentStep,
      createdAt: flow.createdAt.toISOString(),
      updatedAt: flow.updatedAt.toISOString(),
    };
  }

  private toResultResponse(result: CareerFlowResult): CareerFlowResultResponse {
    return {
      id: result.id,
      runId: result.runId,
      step: result.step,
      inputSnapshot: result.inputSnapshot,
      result: result.result,
      modelConfigId: result.modelConfigId,
      createdAt: result.createdAt.toISOString(),
    };
  }
}
