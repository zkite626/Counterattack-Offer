# 02 — 数据模型文档

## 概述

所有 TypeScript 类型定义，存放在 `src/types/` 目录下。

类型文件：`auth.ts`, `ai.ts`, `student.ts`, `job.ts`, `resume-builder.ts`, `index.ts`

> 简历创建器类型详见 `types/resume-builder.ts` 和 `docs/17_RESUME_BUILDER_DESIGN.md`。

---

## 2.1 认证相关 (`types/auth.ts`)

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JWTPayload {
  sub: string;        // user id
  email: string;
  name: string;
  iat: number;
  exp: number;
}
```

---

## 2.2 AI 模型相关 (`types/ai.ts`)

```typescript
export interface AIModelConfig {
  id: string;
  name: string;              // 显示名称，如 "DeepSeek Chat"
  provider: string;          // 提供商标识，如 "deepseek"
  baseUrl: string;           // API Base URL
  model: string;             // 模型ID，如 "deepseek-chat"
  apiKey: string;            // 用户输入的API Key（加密存储）
  isBuiltin: boolean;        // 是否内置模型
  isActive: boolean;         // 是否为当前激活模型
  maxTokens?: number;
  temperature?: number;
  createdAt: string;
}

export interface BuiltinModel {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  model: string;
  description: string;
  icon: string;              // 模型图标路径
  requiresApiKey: true;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  response_format?: { type: 'json_object' };
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIServiceError {
  code: string;
  message: string;
  provider?: string;
  statusCode?: number;
}
```

---

## 2.3 学生档案 (`types/student.ts`)

```typescript
export interface StudentProfile {
  id: string;
  name: string;
  schoolType: string;          // "普通本科" | "985/211" | "高职" | "专科"
  major: string;
  grade: string;               // "大一" | "大二" | "大三" | "大四" | "已毕业"
  targetCities: string[];
  targetRoles: string[];
  educationBackground: string;
  rawExperiences: string[];
  skills: string[];
  weaknesses: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 2.4 职业诊断 (`types/student.ts`)

```typescript
export interface CareerDiagnosis {
  studentType: string;
  summary: string;
  coreStrengths: string[];
  mainWeaknesses: string[];
  recommendedRoles: RecommendedRole[];
  careerAdvice: string;
}

export interface RecommendedRole {
  role: string;
  reason: string;
  fitScore: number;           // 0-100
  priority: 'safe' | 'recommended' | 'challenge';
}
```

---

## 2.5 经历转译 (`types/student.ts`)

```typescript
export interface ExperienceTranslation {
  rawExperience: string;
  abilityTags: string[];
  businessLanguage: string;
  resumeBullet: string;
  interviewQuestions: string[];
  authenticityNote: string;
}
```

---

## 2.6 岗位分析 (`types/job.ts`)

```typescript
export interface JobAnalysis {
  jobTitle: string;
  hardRequirements: string[];
  softRequirements: string[];
  bonusPoints: string[];
  coreAbilities: CoreAbility[];
  hiddenExpectations: string[];
}

export interface CoreAbility {
  ability: string;
  importance: '高' | '中高' | '中' | '低';
}
```

---

## 2.7 匹配报告 (`types/job.ts`)

```typescript
export interface MatchReport {
  overallMatchScore: number;     // 0-100
  matchLevel: string;
  dimensionScores: DimensionScore[];
  advantages: string[];
  gaps: string[];
  applicationStrategy: string;
  riskWarning: string;
}

export interface DimensionScore {
  dimension: string;
  score: number;                 // 0-100
  reason: string;
}
```

---

## 2.8 简历优化 (`types/job.ts`)

```typescript
export interface ResumeOptimization {
  sourceExperience: string;
  before: string;
  after: string;
  targetAbility: string[];
  verificationQuestions: string[];
  riskLevel: '低' | '中' | '高';
  note: string;
}

export interface ResumeOptimizationResult {
  resumeOptimization: ResumeOptimization[];
  resumeSummary: string;
}
```

---

## 2.9 面试模拟 (`types/job.ts`)

```typescript
export interface InterviewSimulation {
  questionType: string;
  mainQuestion: string;
  followUpQuestions: string[];
  answerStructure: string;
  sampleAnswer: string;
  scoreCriteria: string[];
}

// 面试对话（实时模式）
export interface InterviewMessage {
  id: string;
  role: 'interviewer' | 'student';
  content: string;
  timestamp: string;
  feedback?: string;           // AI对回答的评价
}
```

---

## 2.10 能力补齐 (`types/job.ts`)

```typescript
export interface ImprovementPlan {
  targetRole: string;
  goal: string;
  sevenDayPlan: string[];
  fourteenDayPlan: string[];
  thirtyDayPlan: string[];
  recommendedOutputs: string[];
}
```

---

## 2.11 求职流程状态 (`types/index.ts`)

```typescript
export type FlowStep =
  | 'profile'
  | 'diagnosis'
  | 'translation'
  | 'job'
  | 'match'
  | 'resume'
  | 'interview'
  | 'plan'
  | 'report';

export interface JobFlowState {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
  studentProfile: StudentProfile | null;
  careerDiagnosis: CareerDiagnosis | null;
  experienceTranslations: ExperienceTranslation[] | null;
  jobDescription: string | null;         // 原始JD文本
  jobAnalysis: JobAnalysis | null;
  matchReport: MatchReport | null;
  resumeOptimization: ResumeOptimizationResult | null;
  interviewSimulation: InterviewSimulation[] | null;
  improvementPlan: ImprovementPlan | null;
  isLoading: boolean;
  error: string | null;
}

export type JobFlowAction =
  | { type: 'SET_PROFILE'; payload: StudentProfile }
  | { type: 'SET_DIAGNOSIS'; payload: CareerDiagnosis }
  | { type: 'SET_TRANSLATIONS'; payload: ExperienceTranslation[] }
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'SET_JOB_ANALYSIS'; payload: JobAnalysis }
  | { type: 'SET_MATCH_REPORT'; payload: MatchReport }
  | { type: 'SET_RESUME_OPTIMIZATION'; payload: ResumeOptimizationResult }
  | { type: 'SET_INTERVIEW'; payload: InterviewSimulation[] }
  | { type: 'SET_IMPROVEMENT_PLAN'; payload: ImprovementPlan }
  | { type: 'SET_STEP'; payload: FlowStep }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' }
  | { type: 'LOAD_SAMPLE' };
```

---

## 2.12 通用类型 (`types/index.ts`)

```typescript
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

// 主题类型
export type Theme = 'light' | 'dark' | 'system';
```
