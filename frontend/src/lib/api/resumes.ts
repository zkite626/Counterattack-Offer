import { apiClient } from "@/lib/api/client";
import type { ResumeBuilderData } from "@/types";

export interface BackendResume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  theme: unknown;
  content: unknown;
  sourceRunId: string | null;
  createdAt: string;
  updatedAt: string;
}

function isResumeBuilderData(value: unknown): value is ResumeBuilderData {
  return typeof value === "object" && value !== null && "basic" in value && "sections" in value;
}

export function fromBackendResume(resume: BackendResume): ResumeBuilderData | null {
  if (!isResumeBuilderData(resume.content)) return null;
  return {
    ...resume.content,
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  };
}

function toSavePayload(resume: ResumeBuilderData, sourceRunId?: string | null) {
  return {
    title: resume.title,
    templateId: resume.templateId,
    theme: resume.globalSettings,
    content: resume,
    sourceRunId: sourceRunId ?? null,
  };
}

export const resumesApi = {
  async list(): Promise<ResumeBuilderData[]> {
    const result = await apiClient.get<{ resumes: BackendResume[] }>("/resumes");
    return result.resumes.map(fromBackendResume).filter((item): item is ResumeBuilderData => item !== null);
  },

  async create(resume: ResumeBuilderData, sourceRunId?: string | null): Promise<ResumeBuilderData> {
    const result = await apiClient.post<{ resume: BackendResume }>("/resumes", toSavePayload(resume, sourceRunId));
    return fromBackendResume(result.resume) ?? resume;
  },

  async update(resume: ResumeBuilderData, sourceRunId?: string | null): Promise<ResumeBuilderData> {
    const result = await apiClient.patch<{ resume: BackendResume }>(`/resumes/${resume.id}`, toSavePayload(resume, sourceRunId));
    return fromBackendResume(result.resume) ?? resume;
  },

  async duplicate(id: string): Promise<ResumeBuilderData | null> {
    const result = await apiClient.post<{ resume: BackendResume }>(`/resumes/${id}/duplicate`);
    return fromBackendResume(result.resume);
  },

  async createVersion(id: string): Promise<void> {
    await apiClient.post<{ version: unknown }>(`/resumes/${id}/versions`);
  },
};
