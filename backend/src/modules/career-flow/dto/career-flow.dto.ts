import type { Prisma } from "@prisma/client";

export type CareerFlowStatusResponse =
  | "draft"
  | "running"
  | "completed"
  | "failed";

export interface SaveCareerFlowDto {
  targetRole?: unknown;
  jobDescription?: unknown;
  status?: unknown;
  currentStep?: unknown;
}

export interface CareerFlowResultResponse {
  id: string;
  runId: string;
  step: string;
  inputSnapshot: Prisma.JsonValue;
  result: Prisma.JsonValue;
  modelConfigId: string | null;
  createdAt: string;
}

export interface CareerFlowResponse {
  id: string;
  userId: string;
  targetRole: string | null;
  jobDescription: string | null;
  status: CareerFlowStatusResponse;
  currentStep: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerFlowDetailResponse extends CareerFlowResponse {
  results: CareerFlowResultResponse[];
}

export interface CareerFlowResultsResponse {
  results: CareerFlowResultResponse[];
  latestResults: Record<string, CareerFlowResultResponse>;
}

export interface SaveCareerFlowInput {
  targetRole?: string | null;
  jobDescription?: string | null;
  status?: CareerFlowStatusResponse;
  currentStep?: string;
}

export interface SaveCareerFlowResultInput {
  runId: string;
  userId: string;
  step: string;
  inputSnapshot: Prisma.InputJsonValue;
  result: Prisma.InputJsonValue;
  modelConfigId: string | null;
}
