"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
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
import { careerFlowsApi, type CareerFlowResult } from "@/lib/api/career-flows";
import { usersApi } from "@/lib/api/users";

const DRAFT_STEP_KEY = "nixi-job-flow-ui-draft-step";

const INITIAL_STATE: JobFlowState = {
  activeRunId: null,
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

const CORE_STEPS: FlowStep[] = ["profile", "diagnosis", "translation", "resume", "interview", "plan"];

function isFlowUnlocked(state: JobFlowState): boolean {
  return CORE_STEPS.every((step) => state.completedSteps.includes(step));
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

function isFlowStep(value: string | null): value is FlowStep {
  return value === "profile" || value === "diagnosis" || value === "translation" || value === "job" ||
    value === "match" || value === "resume" || value === "interview" || value === "plan" || value === "report";
}

function getInitialState(): JobFlowState {
  if (typeof window === "undefined") return INITIAL_STATE;
  const storedStep = localStorage.getItem(DRAFT_STEP_KEY);
  return isFlowStep(storedStep) ? { ...INITIAL_STATE, currentStep: storedStep } : INITIAL_STATE;
}

function reducer(state: JobFlowState, action: JobFlowAction): JobFlowState {
  let next: JobFlowState;
  switch (action.type) {
    case "SET_RUN_ID":
      return { ...state, activeRunId: action.payload };
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
  restoreFromBackend: () => Promise<void>;
  ensureActiveRun: (targetRole?: string | null, jobDescription?: string | null) => Promise<string>;
  canAccessStep: (step: FlowStep) => boolean;
  getCompletionPercentage: () => number;
}

const JobFlowContext = createContext<JobFlowContextValue | null>(null);

function applyResultToState(base: JobFlowState, item: CareerFlowResult): JobFlowState {
  switch (item.step) {
    case "diagnosis":
      return withDerivedSteps({ ...base, careerDiagnosis: normalizeCareerDiagnosis(item.result) });
    case "translation":
      return withDerivedSteps({ ...base, experienceTranslations: Array.isArray(item.result) ? item.result : null });
    case "job":
      return withDerivedSteps({ ...base, jobAnalysis: normalizeJobAnalysis(item.result) });
    case "match":
      return withDerivedSteps({ ...base, matchReport: normalizeMatchReport(item.result) });
    case "resume":
      return withDerivedSteps({ ...base, resumeOptimization: item.result as JobFlowState["resumeOptimization"] });
    case "interview": {
      const normalized = normalizeInterviewSimulations(item.result);
      return withDerivedSteps({ ...base, interviewSimulation: normalized.length ? normalized : null });
    }
    case "plan":
      return withDerivedSteps({ ...base, improvementPlan: normalizeImprovementPlan(item.result) });
    default:
      return base;
  }
}

export function JobFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, getInitialState);

  const restoreFromBackend = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const [profile, flows] = await Promise.all([usersApi.getProfile(), careerFlowsApi.list()]);
      const latestFlow = flows[0] ?? null;
      let restored = withDerivedSteps({
        ...INITIAL_STATE,
        activeRunId: latestFlow?.id ?? null,
        currentStep: latestFlow?.currentStep ?? "profile",
        studentProfile: profile,
        jobDescription: latestFlow?.jobDescription ?? null,
      });

      if (latestFlow) {
        const detail = await careerFlowsApi.get(latestFlow.id);
        restored = detail.results.reduce(applyResultToState, restored);
      }

      dispatch({ type: "RESET" });
      dispatch({ type: "SET_RUN_ID", payload: restored.activeRunId });
      if (restored.studentProfile) dispatch({ type: "SET_PROFILE", payload: restored.studentProfile });
      if (restored.jobDescription) dispatch({ type: "SET_JOB_DESCRIPTION", payload: restored.jobDescription });
      if (restored.careerDiagnosis) dispatch({ type: "SET_DIAGNOSIS", payload: restored.careerDiagnosis });
      if (restored.experienceTranslations) dispatch({ type: "SET_TRANSLATIONS", payload: restored.experienceTranslations });
      if (restored.jobAnalysis) dispatch({ type: "SET_JOB_ANALYSIS", payload: restored.jobAnalysis });
      if (restored.matchReport) dispatch({ type: "SET_MATCH_REPORT", payload: restored.matchReport });
      if (restored.resumeOptimization) dispatch({ type: "SET_RESUME_OPTIMIZATION", payload: restored.resumeOptimization });
      if (restored.interviewSimulation) dispatch({ type: "SET_INTERVIEW", payload: restored.interviewSimulation });
      if (restored.improvementPlan) dispatch({ type: "SET_IMPROVEMENT_PLAN", payload: restored.improvementPlan });
      dispatch({ type: "SET_STEP", payload: restored.currentStep });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "流程数据恢复失败" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    restoreFromBackend();
  }, [restoreFromBackend]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STEP_KEY, state.currentStep);
    } catch {
      // UI 偏好写入失败不影响主流程。
    }
  }, [state.currentStep]);

  const ensureActiveRun = useCallback(
    async (targetRole?: string | null, jobDescription?: string | null) => {
      if (state.activeRunId) return state.activeRunId;
      const flow = await careerFlowsApi.create({
        targetRole: targetRole ?? state.studentProfile?.targetRoles[0] ?? null,
        jobDescription: jobDescription ?? state.jobDescription,
        currentStep: state.currentStep,
        status: "running",
      });
      dispatch({ type: "SET_RUN_ID", payload: flow.id });
      return flow.id;
    },
    [state.activeRunId, state.currentStep, state.jobDescription, state.studentProfile]
  );

  function resetFlow() {
    dispatch({ type: "RESET" });
    try {
      localStorage.removeItem(DRAFT_STEP_KEY);
    } catch {
      // ignore
    }
  }

  function loadSampleData() {
    dispatch({ type: "LOAD_SAMPLE" });
  }

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
        return completed.includes("diagnosis");
      case "resume":
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
      value={{
        state,
        dispatch,
        resetFlow,
        loadSampleData,
        restoreFromBackend,
        ensureActiveRun,
        canAccessStep,
        getCompletionPercentage,
      }}
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
