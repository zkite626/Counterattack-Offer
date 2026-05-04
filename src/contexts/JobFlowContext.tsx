"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import type { JobFlowState, JobFlowAction, FlowStep } from "@/types";
import {
  normalizeCareerDiagnosis,
  normalizeImprovementPlan,
  normalizeInterviewSimulations,
  normalizeJobAnalysis,
  normalizeMatchReport,
} from "@/lib/utils/ai-results";
import { DEMO_STUDENT_PROFILE } from "@/data/demo-case";
import {
  DEMO_DIAGNOSIS,
  DEMO_TRANSLATIONS,
  DEMO_JOB_ANALYSIS,
  DEMO_MATCH_REPORT,
  DEMO_RESUME_OPTIMIZATION,
  DEMO_INTERVIEW,
  DEMO_IMPROVEMENT_PLAN,
} from "@/data/demo-results";

const STORAGE_KEY = "nixi-job-flow";

const INITIAL_STATE: JobFlowState = {
  currentStep: "profile",
  completedSteps: [],
  studentProfile: null,
  careerDiagnosis: null,
  experienceTranslations: null,
  jobDescription: null,
  jobAnalysis: null,
  matchReport: null,
  resumeOptimization: null,
  interviewSimulation: null,
  improvementPlan: null,
  isLoading: false,
  error: null,
};

// 根据实际数据计算已完成的步骤
function deriveCompletedSteps(state: JobFlowState): FlowStep[] {
  const steps: FlowStep[] = [];
  if (state.studentProfile) steps.push("profile");
  if (state.careerDiagnosis) steps.push("diagnosis");
  if (state.experienceTranslations) steps.push("translation");
  if (state.jobAnalysis) steps.push("job");
  if (state.matchReport) steps.push("match");
  if (state.resumeOptimization) steps.push("resume");
  if (state.interviewSimulation) steps.push("interview");
  if (state.improvementPlan) steps.push("plan");
  if (steps.length >= 5) steps.push("report");
  return steps;
}

// 完成一轮完整流程的核心步骤（不含 report）
const CORE_STEPS: FlowStep[] = ["profile", "diagnosis", "translation", "resume", "interview", "plan"];

function isFlowUnlocked(state: JobFlowState): boolean {
  return CORE_STEPS.every((s) => state.completedSteps.includes(s));
}

function withDerivedSteps(state: JobFlowState): JobFlowState {
  const interviewSimulation = normalizeInterviewSimulations(state.interviewSimulation);
  const normalized: JobFlowState = {
    ...state,
    careerDiagnosis: normalizeCareerDiagnosis(state.careerDiagnosis),
    jobAnalysis: normalizeJobAnalysis(state.jobAnalysis),
    matchReport: normalizeMatchReport(state.matchReport),
    interviewSimulation: interviewSimulation.length ? interviewSimulation : null,
    improvementPlan: normalizeImprovementPlan(state.improvementPlan),
  };
  return { ...normalized, completedSteps: deriveCompletedSteps(normalized) };
}

function loadState(): JobFlowState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as JobFlowState;
      // 清除旧版 demo 模式遗留的 completedSteps，用实际数据重新计算
      const merged = { ...INITIAL_STATE, ...parsed, completedSteps: [] };
      return withDerivedSteps(merged);
    }
  } catch {
    // ignore
  }
  return INITIAL_STATE;
}

function reducer(state: JobFlowState, action: JobFlowAction): JobFlowState {
  let next: JobFlowState;
  switch (action.type) {
    case "SET_PROFILE":
      next = { ...state, studentProfile: action.payload };
      break;
    case "SET_DIAGNOSIS":
      next = { ...state, careerDiagnosis: action.payload };
      break;
    case "SET_TRANSLATIONS":
      next = { ...state, experienceTranslations: action.payload };
      break;
    case "SET_JOB_DESCRIPTION":
      next = { ...state, jobDescription: action.payload };
      break;
    case "SET_JOB_ANALYSIS":
      next = { ...state, jobAnalysis: action.payload };
      break;
    case "SET_MATCH_REPORT":
      next = { ...state, matchReport: action.payload };
      break;
    case "SET_RESUME_OPTIMIZATION":
      next = { ...state, resumeOptimization: action.payload };
      break;
    case "SET_INTERVIEW":
      next = { ...state, interviewSimulation: action.payload };
      break;
    case "SET_IMPROVEMENT_PLAN":
      next = { ...state, improvementPlan: action.payload };
      break;
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "LOAD_SAMPLE":
      next = {
        ...INITIAL_STATE,
        studentProfile: DEMO_STUDENT_PROFILE,
        careerDiagnosis: DEMO_DIAGNOSIS,
        experienceTranslations: DEMO_TRANSLATIONS,
        jobDescription: "用户运营实习生",
        jobAnalysis: DEMO_JOB_ANALYSIS,
        matchReport: DEMO_MATCH_REPORT,
        resumeOptimization: DEMO_RESUME_OPTIMIZATION,
        interviewSimulation: DEMO_INTERVIEW,
        improvementPlan: DEMO_IMPROVEMENT_PLAN,
      };
      break;
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
  return withDerivedSteps(next);
}

interface JobFlowContextValue {
  state: JobFlowState;
  dispatch: Dispatch<JobFlowAction>;
  resetFlow: () => void;
  loadSampleData: () => void;
  canAccessStep: (step: FlowStep) => boolean;
  getCompletionPercentage: () => number;
}

const JobFlowContext = createContext<JobFlowContextValue | null>(null);

export function JobFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  function resetFlow() {
    dispatch({ type: "RESET" });
    localStorage.removeItem(STORAGE_KEY);
  }

  function loadSampleData() {
    dispatch({ type: "LOAD_SAMPLE" });
  }

  // 未完成一轮：按顺序解锁；完成后：自由访问
  function canAccessStep(step: FlowStep): boolean {
    if (isFlowUnlocked(state)) return true;
    const completed = state.completedSteps;
    switch (step) {
      case "profile":
        return true;
      case "diagnosis":
        return completed.includes("profile");
      case "translation":
        return completed.includes("diagnosis");
      case "job":
        return completed.includes("translation");
      case "match":
        // 需要诊断完成，JD 可选
        return completed.includes("diagnosis");
      case "resume":
        // 经历转译完成即可（JD/匹配可跳过）
        return completed.includes("translation");
      case "interview":
        return completed.includes("resume");
      case "plan":
        return completed.includes("interview");
      case "report":
        return completed.length >= 5;
      default:
        return false;
    }
  }

  function getCompletionPercentage(): number {
    return Math.round((state.completedSteps.length / 9) * 100);
  }

  return (
    <JobFlowContext.Provider
      value={{ state, dispatch, resetFlow, loadSampleData, canAccessStep, getCompletionPercentage }}
    >
      {children}
    </JobFlowContext.Provider>
  );
}

export function useJobFlow(): JobFlowContextValue {
  const ctx = useContext(JobFlowContext);
  if (!ctx) throw new Error("useJobFlow must be used within JobFlowProvider");
  return ctx;
}
