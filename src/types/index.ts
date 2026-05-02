import type { StudentProfile, CareerDiagnosis, ExperienceTranslation } from "./student";
import type {
  JobAnalysis,
  MatchReport,
  ResumeOptimizationResult,
  InterviewSimulation,
  ImprovementPlan,
} from "./job";

export type { StudentProfile, CareerDiagnosis, ExperienceTranslation } from "./student";
export type {
  JobAnalysis,
  CoreAbility,
  MatchReport,
  DimensionScore,
  ResumeOptimization,
  ResumeOptimizationResult,
  InterviewSimulation,
  InterviewMessage,
  ImprovementPlan,
} from "./job";
export type { User, CreateUserDTO, LoginDTO, AuthResponse, JWTPayload } from "./auth";
export type {
  AIModelConfig,
  BuiltinModel,
  ChatMessage,
  ChatCompletionRequest,
  ChatCompletionResponse,
  AIServiceError,
} from "./ai";

export type {
  ResumeBasicInfo,
  ResumeCustomField,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSection,
  ResumeGlobalSettings,
  ResumeTemplate,
  ResumeBuilderData,
} from "./resume-builder";
export { DEFAULT_RESUME_SECTIONS, DEFAULT_GLOBAL_SETTINGS } from "./resume-builder";

export type FlowStep =
  | "profile"
  | "diagnosis"
  | "translation"
  | "job"
  | "match"
  | "resume"
  | "interview"
  | "plan"
  | "report";

export interface JobFlowState {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
  studentProfile: StudentProfile | null;
  careerDiagnosis: CareerDiagnosis | null;
  experienceTranslations: ExperienceTranslation[] | null;
  jobDescription: string | null;
  jobAnalysis: JobAnalysis | null;
  matchReport: MatchReport | null;
  resumeOptimization: ResumeOptimizationResult | null;
  interviewSimulation: InterviewSimulation[] | null;
  improvementPlan: ImprovementPlan | null;
  isLoading: boolean;
  error: string | null;
}

export type JobFlowAction =
  | { type: "SET_PROFILE"; payload: StudentProfile }
  | { type: "SET_DIAGNOSIS"; payload: CareerDiagnosis }
  | { type: "SET_TRANSLATIONS"; payload: ExperienceTranslation[] }
  | { type: "SET_JOB_DESCRIPTION"; payload: string }
  | { type: "SET_JOB_ANALYSIS"; payload: JobAnalysis }
  | { type: "SET_MATCH_REPORT"; payload: MatchReport }
  | { type: "SET_RESUME_OPTIMIZATION"; payload: ResumeOptimizationResult }
  | { type: "SET_INTERVIEW"; payload: InterviewSimulation[] }
  | { type: "SET_IMPROVEMENT_PLAN"; payload: ImprovementPlan }
  | { type: "SET_STEP"; payload: FlowStep }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" }
  | { type: "LOAD_DEMO" };

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export type Theme = "light" | "dark" | "system";
