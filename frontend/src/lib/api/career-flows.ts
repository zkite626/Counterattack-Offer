import { apiClient } from "@/lib/api/client";
import type { FlowStep } from "@/types";

export interface CareerFlowSummary {
  id: string;
  targetRole: string | null;
  jobDescription: string | null;
  status: "draft" | "running" | "completed" | "failed";
  currentStep: FlowStep;
  createdAt: string;
  updatedAt: string;
}

export interface CareerFlowResult {
  id: string;
  runId: string;
  step: string;
  inputSnapshot: unknown;
  result: unknown;
  modelConfigId: string | null;
  createdAt: string;
}

export interface CareerFlowDetail extends CareerFlowSummary {
  results: CareerFlowResult[];
}

export const careerFlowsApi = {
  async list(): Promise<CareerFlowSummary[]> {
    const result = await apiClient.get<{ flows: CareerFlowSummary[] }>("/career-flows");
    return result.flows;
  },

  async create(input: Partial<Pick<CareerFlowSummary, "targetRole" | "jobDescription" | "currentStep" | "status">>): Promise<CareerFlowSummary> {
    const result = await apiClient.post<{ flow: CareerFlowSummary }>("/career-flows", input);
    return result.flow;
  },

  async get(id: string): Promise<CareerFlowDetail> {
    const result = await apiClient.get<{ flow: CareerFlowDetail }>(`/career-flows/${id}`);
    return result.flow;
  },

  async update(id: string, input: Partial<Pick<CareerFlowSummary, "targetRole" | "jobDescription" | "currentStep" | "status">>): Promise<CareerFlowSummary> {
    const result = await apiClient.patch<{ flow: CareerFlowSummary }>(`/career-flows/${id}`, input);
    return result.flow;
  },
};
