import type { Prisma } from "@prisma/client";

export interface SaveResumeDto {
  title?: unknown;
  templateId?: unknown;
  theme?: unknown;
  content?: unknown;
  sourceRunId?: unknown;
}

export interface ResumeResponse {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  theme: Prisma.JsonValue;
  content: Prisma.JsonValue;
  sourceRunId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersionResponse {
  id: string;
  resumeId: string;
  versionNo: number;
  content: Prisma.JsonValue;
  createdBy: string;
  createdAt: string;
}

export interface SaveResumeInput {
  title?: string;
  templateId?: string;
  theme?: Prisma.InputJsonValue;
  content?: Prisma.InputJsonValue;
  sourceRunId?: string | null;
}
