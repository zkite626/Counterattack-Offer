import type { Prisma } from "@prisma/client";

export interface AIBusinessRequestDto {
  runId?: unknown;
  modelConfigId?: unknown;
  input?: unknown;
  stream?: unknown;
  studentProfile?: unknown;
  rawExperiences?: unknown;
  targetRoles?: unknown;
  jobDescription?: unknown;
  jobTitle?: unknown;
  careerDiagnosis?: unknown;
  experienceTranslations?: unknown;
  jobAnalysis?: unknown;
  matchReport?: unknown;
  resumeOptimization?: unknown;
  interviewSimulation?: unknown;
  improvementPlan?: unknown;
}

export interface AIBusinessContext {
  userId: string;
  runId: string;
  modelConfigId: string | null;
  input: Record<string, unknown>;
  inputSnapshot: Prisma.InputJsonValue;
}
