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
import type {
  ResumeBuilderData,
  ResumeBasicInfo,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSection,
  ResumeGlobalSettings,
} from "@/types";
import { DEFAULT_RESUME_SECTIONS, DEFAULT_GLOBAL_SETTINGS } from "@/types";

const STORAGE_KEY = "nixi-resume-builder";

// 状态类型
interface ResumeBuilderState {
  resumes: Record<string, ResumeBuilderData>;
  activeResumeId: string | null;
  activeSection: string;
}

// Action 联合类型
type ResumeBuilderAction =
  | { type: "CREATE_RESUME"; payload: { templateId: string; title?: string } }
  | { type: "DELETE_RESUME"; payload: string }
  | { type: "DUPLICATE_RESUME"; payload: string }
  | { type: "SET_ACTIVE_RESUME"; payload: string }
  | { type: "SET_ACTIVE_SECTION"; payload: string }
  | { type: "UPDATE_TITLE"; payload: string }
  | { type: "UPDATE_BASIC"; payload: Partial<ResumeBasicInfo> }
  | { type: "ADD_EDUCATION"; payload: ResumeEducation }
  | { type: "UPDATE_EDUCATION"; payload: { id: string; data: Partial<ResumeEducation> } }
  | { type: "DELETE_EDUCATION"; payload: string }
  | { type: "ADD_EXPERIENCE"; payload: ResumeExperience }
  | { type: "UPDATE_EXPERIENCE"; payload: { id: string; data: Partial<ResumeExperience> } }
  | { type: "DELETE_EXPERIENCE"; payload: string }
  | { type: "ADD_PROJECT"; payload: ResumeProject }
  | { type: "UPDATE_PROJECT"; payload: { id: string; data: Partial<ResumeProject> } }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "UPDATE_SKILLS"; payload: string }
  | { type: "UPDATE_SELF_EVALUATION"; payload: string }
  | { type: "REORDER_SECTIONS"; payload: ResumeSection[] }
  | { type: "TOGGLE_SECTION"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<ResumeGlobalSettings> }
  | { type: "SET_TEMPLATE"; payload: string }
  | { type: "LOAD_FROM_AI"; payload: ResumeBuilderData };

const INITIAL_STATE: ResumeBuilderState = {
  resumes: {},
  activeResumeId: null,
  activeSection: "basic",
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function createEmptyResume(templateId: string, title?: string): ResumeBuilderData {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: title || "未命名简历",
    createdAt: now,
    updatedAt: now,
    templateId,
    basic: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      photo: undefined,
      customFields: [],
    },
    education: [],
    experience: [],
    projects: [],
    skills: "",
    selfEvaluation: "",
    sections: DEFAULT_RESUME_SECTIONS.map((s) => ({ ...s })),
    globalSettings: { ...DEFAULT_GLOBAL_SETTINGS },
  };
}

function withTimestamp(resume: ResumeBuilderData): ResumeBuilderData {
  return { ...resume, updatedAt: new Date().toISOString() };
}

function updateActiveResume(
  state: ResumeBuilderState,
  updater: (resume: ResumeBuilderData) => ResumeBuilderData
): ResumeBuilderState {
  const { activeResumeId, resumes } = state;
  if (!activeResumeId || !resumes[activeResumeId]) return state;
  return {
    ...state,
    resumes: {
      ...resumes,
      [activeResumeId]: withTimestamp(updater(resumes[activeResumeId])),
    },
  };
}

function reducer(state: ResumeBuilderState, action: ResumeBuilderAction): ResumeBuilderState {
  switch (action.type) {
    case "CREATE_RESUME": {
      const resume = createEmptyResume(action.payload.templateId, action.payload.title);
      return {
        ...state,
        resumes: { ...state.resumes, [resume.id]: resume },
        activeResumeId: resume.id,
        activeSection: "basic",
      };
    }
    case "DELETE_RESUME": {
      const { [action.payload]: _, ...rest } = state.resumes;
      return {
        ...state,
        resumes: rest,
        activeResumeId: state.activeResumeId === action.payload ? null : state.activeResumeId,
      };
    }
    case "DUPLICATE_RESUME": {
      const source = state.resumes[action.payload];
      if (!source) return state;
      const now = new Date().toISOString();
      const copy: ResumeBuilderData = {
        ...JSON.parse(JSON.stringify(source)),
        id: generateId(),
        title: `${source.title}（副本）`,
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, resumes: { ...state.resumes, [copy.id]: copy } };
    }
    case "SET_ACTIVE_RESUME":
      return { ...state, activeResumeId: action.payload, activeSection: "basic" };
    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.payload };
    case "UPDATE_TITLE":
      return updateActiveResume(state, (r) => ({ ...r, title: action.payload }));
    case "UPDATE_BASIC":
      return updateActiveResume(state, (r) => ({
        ...r,
        basic: { ...r.basic, ...action.payload },
      }));
    case "ADD_EDUCATION":
      return updateActiveResume(state, (r) => ({
        ...r,
        education: [...r.education, action.payload],
      }));
    case "UPDATE_EDUCATION":
      return updateActiveResume(state, (r) => ({
        ...r,
        education: r.education.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.data } : e
        ),
      }));
    case "DELETE_EDUCATION":
      return updateActiveResume(state, (r) => ({
        ...r,
        education: r.education.filter((e) => e.id !== action.payload),
      }));
    case "ADD_EXPERIENCE":
      return updateActiveResume(state, (r) => ({
        ...r,
        experience: [...r.experience, action.payload],
      }));
    case "UPDATE_EXPERIENCE":
      return updateActiveResume(state, (r) => ({
        ...r,
        experience: r.experience.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.data } : e
        ),
      }));
    case "DELETE_EXPERIENCE":
      return updateActiveResume(state, (r) => ({
        ...r,
        experience: r.experience.filter((e) => e.id !== action.payload),
      }));
    case "ADD_PROJECT":
      return updateActiveResume(state, (r) => ({
        ...r,
        projects: [...r.projects, action.payload],
      }));
    case "UPDATE_PROJECT":
      return updateActiveResume(state, (r) => ({
        ...r,
        projects: r.projects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      }));
    case "DELETE_PROJECT":
      return updateActiveResume(state, (r) => ({
        ...r,
        projects: r.projects.filter((p) => p.id !== action.payload),
      }));
    case "UPDATE_SKILLS":
      return updateActiveResume(state, (r) => ({ ...r, skills: action.payload }));
    case "UPDATE_SELF_EVALUATION":
      return updateActiveResume(state, (r) => ({
        ...r,
        selfEvaluation: action.payload,
      }));
    case "REORDER_SECTIONS":
      return updateActiveResume(state, (r) => ({
        ...r,
        sections: action.payload,
      }));
    case "TOGGLE_SECTION":
      return updateActiveResume(state, (r) => ({
        ...r,
        sections: r.sections.map((s) =>
          s.id === action.payload ? { ...s, enabled: !s.enabled } : s
        ),
      }));
    case "UPDATE_SETTINGS":
      return updateActiveResume(state, (r) => ({
        ...r,
        globalSettings: { ...r.globalSettings, ...action.payload },
      }));
    case "SET_TEMPLATE":
      return updateActiveResume(state, (r) => ({
        ...r,
        templateId: action.payload,
      }));
    case "LOAD_FROM_AI": {
      const resume = action.payload;
      return {
        ...state,
        resumes: { ...state.resumes, [resume.id]: resume },
        activeResumeId: resume.id,
        activeSection: "basic",
      };
    }
    default:
      return state;
  }
}

// 从 localStorage 加载
function loadState(): ResumeBuilderState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ResumeBuilderState;
      return { ...INITIAL_STATE, ...parsed };
    }
  } catch {
    // ignore
  }
  return INITIAL_STATE;
}

// Context 值类型
interface ResumeBuilderContextValue {
  state: ResumeBuilderState;
  dispatch: Dispatch<ResumeBuilderAction>;
  activeResume: ResumeBuilderData | null;
  createResume: (templateId: string, title?: string) => string;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  setActiveResume: (id: string) => void;
  setActiveSection: (sectionId: string) => void;
}

const ResumeBuilderContext = createContext<ResumeBuilderContextValue | null>(null);

export function ResumeBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, loadState);

  // 持久化到 localStorage（防抖 1500ms）
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [state]);

  const activeResume = state.activeResumeId ? state.resumes[state.activeResumeId] ?? null : null;

  const createResume = useCallback((templateId: string, title?: string) => {
    const id = generateId();
    dispatch({ type: "CREATE_RESUME", payload: { templateId, title } });
    return id;
  }, []);

  const deleteResume = useCallback((id: string) => {
    dispatch({ type: "DELETE_RESUME", payload: id });
  }, []);

  const duplicateResume = useCallback((id: string) => {
    dispatch({ type: "DUPLICATE_RESUME", payload: id });
  }, []);

  const setActiveResume = useCallback((id: string) => {
    dispatch({ type: "SET_ACTIVE_RESUME", payload: id });
  }, []);

  const setActiveSection = useCallback((sectionId: string) => {
    dispatch({ type: "SET_ACTIVE_SECTION", payload: sectionId });
  }, []);

  return (
    <ResumeBuilderContext.Provider
      value={{
        state,
        dispatch,
        activeResume,
        createResume,
        deleteResume,
        duplicateResume,
        setActiveResume,
        setActiveSection,
      }}
    >
      {children}
    </ResumeBuilderContext.Provider>
  );
}

export function useResumeBuilder(): ResumeBuilderContextValue {
  const ctx = useContext(ResumeBuilderContext);
  if (!ctx) throw new Error("useResumeBuilder must be used within ResumeBuilderProvider");
  return ctx;
}
