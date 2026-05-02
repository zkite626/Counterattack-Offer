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
  importance: "高" | "中高" | "中" | "低";
}

export interface MatchReport {
  overallMatchScore: number;
  matchLevel: string;
  dimensionScores: DimensionScore[];
  advantages: string[];
  gaps: string[];
  applicationStrategy: string;
  riskWarning: string;
}

export interface DimensionScore {
  dimension: string;
  score: number;
  reason: string;
}

export interface ResumeOptimization {
  sourceExperience: string;
  before: string;
  after: string;
  targetAbility: string[];
  verificationQuestions: string[];
  riskLevel: "低" | "中" | "高";
  note: string;
}

export interface ResumeOptimizationResult {
  resumeOptimization: ResumeOptimization[];
  resumeSummary: string;
}

export interface InterviewSimulation {
  questionType: string;
  mainQuestion: string;
  followUpQuestions: string[];
  answerStructure: string;
  sampleAnswer: string;
  scoreCriteria: string[];
}

export interface InterviewMessage {
  id: string;
  role: "interviewer" | "student";
  content: string;
  timestamp: string;
  feedback?: string;
}

export interface ImprovementPlan {
  targetRole: string;
  goal: string;
  sevenDayPlan: string[];
  fourteenDayPlan: string[];
  thirtyDayPlan: string[];
  recommendedOutputs: string[];
}
