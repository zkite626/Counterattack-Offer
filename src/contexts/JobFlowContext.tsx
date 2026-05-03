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
import { DEMO_STUDENT_PROFILE, DEMO_JOB_DESCRIPTION } from "@/data/demo-case";
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

function loadState(): JobFlowState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...INITIAL_STATE, ...JSON.parse(saved) };
  } catch {
    // ignore
  }
  return INITIAL_STATE;
}

function markCompleted(state: JobFlowState, step: FlowStep): FlowStep[] {
  return state.completedSteps.includes(step)
    ? state.completedSteps
    : [...state.completedSteps, step];
}

function reducer(state: JobFlowState, action: JobFlowAction): JobFlowState {
  switch (action.type) {
    case "SET_PROFILE":
      return {
        ...state,
        studentProfile: action.payload,
        currentStep: "diagnosis",
        completedSteps: markCompleted(state, "profile"),
      };
    case "SET_DIAGNOSIS":
      return {
        ...state,
        careerDiagnosis: action.payload,
        currentStep: "translation",
        completedSteps: markCompleted(state, "diagnosis"),
      };
    case "SET_TRANSLATIONS":
      return {
        ...state,
        experienceTranslations: action.payload,
        currentStep: "job",
        completedSteps: markCompleted(state, "translation"),
      };
    case "SET_JOB_DESCRIPTION":
      return { ...state, jobDescription: action.payload };
    case "SET_JOB_ANALYSIS":
      return {
        ...state,
        jobAnalysis: action.payload,
        currentStep: "match",
        completedSteps: markCompleted(state, "job"),
      };
    case "SET_MATCH_REPORT":
      return {
        ...state,
        matchReport: action.payload,
        currentStep: "resume",
        completedSteps: markCompleted(state, "match"),
      };
    case "SET_RESUME_OPTIMIZATION":
      return {
        ...state,
        resumeOptimization: action.payload,
        currentStep: "interview",
        completedSteps: markCompleted(state, "resume"),
      };
    case "SET_INTERVIEW":
      return {
        ...state,
        interviewSimulation: action.payload,
        currentStep: "plan",
        completedSteps: markCompleted(state, "interview"),
      };
    case "SET_IMPROVEMENT_PLAN":
      return {
        ...state,
        improvementPlan: action.payload,
        currentStep: "report",
        completedSteps: markCompleted(state, "plan"),
      };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return INITIAL_STATE;
    case "LOAD_DEMO":
      return {
        ...INITIAL_STATE,
        studentProfile: DEMO_STUDENT_PROFILE,
        careerDiagnosis: DEMO_DIAGNOSIS,
        experienceTranslations: DEMO_TRANSLATIONS,
        jobDescription: DEMO_JOB_DESCRIPTION,
        jobAnalysis: DEMO_JOB_ANALYSIS,
        matchReport: DEMO_MATCH_REPORT,
        resumeOptimization: DEMO_RESUME_OPTIMIZATION,
        interviewSimulation: DEMO_INTERVIEW,
        improvementPlan: DEMO_IMPROVEMENT_PLAN,
        currentStep: "report",
        completedSteps: [
          "profile",
          "diagnosis",
          "translation",
          "job",
          "match",
          "resume",
          "interview",
          "plan",
        ],
      };
    default:
      return state;
  }
}

interface JobFlowContextValue {
  state: JobFlowState;
  dispatch: Dispatch<JobFlowAction>;
  loadDemoCase: () => void;
  resetFlow: () => void;
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

  function loadDemoCase() {
    dispatch({ type: "LOAD_DEMO" });
  }

  function resetFlow() {
    dispatch({ type: "RESET" });
    localStorage.removeItem(STORAGE_KEY);
  }

  function canAccessStep(step: FlowStep): boolean {
    switch (step) {
      case "profile":
        return true;
      case "diagnosis":
        return state.studentProfile !== null;
      case "translation":
        return state.careerDiagnosis !== null;
      case "job":
        return true;
      case "match":
        return state.careerDiagnosis !== null && state.jobAnalysis !== null;
      case "resume":
        return state.matchReport !== null;
      case "interview":
        return state.resumeOptimization !== null;
      case "plan":
        return state.matchReport !== null;
      case "report":
        return state.completedSteps.length >= 5;
      default:
        return false;
    }
  }

  function getCompletionPercentage(): number {
    const steps: FlowStep[] = [
      "profile",
      "diagnosis",
      "translation",
      "job",
      "match",
      "resume",
      "interview",
      "plan",
      "report",
    ];
    return Math.round((state.completedSteps.length / steps.length) * 100);
  }

  return (
    <JobFlowContext.Provider
      value={{ state, dispatch, loadDemoCase, resetFlow, canAccessStep, getCompletionPercentage }}
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
