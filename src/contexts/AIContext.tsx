"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AIModelConfig } from "@/types/ai";
import { BUILTIN_MODELS } from "@/lib/ai/models";
import { encryptApiKey, decryptApiKey } from "@/lib/utils/crypto";

const STORAGE_KEY = "nixi-offer-ai-models";

interface AIModelStorage {
  models: AIModelConfig[];
  activeModelId: string;
}

interface AIContextValue {
  models: AIModelConfig[];
  activeModelId: string;
  activeModel: AIModelConfig | null;
  addModel: (model: Omit<AIModelConfig, "id" | "createdAt" | "isBuiltin" | "isActive">) => void;
  updateModel: (id: string, updates: Partial<AIModelConfig>) => void;
  removeModel: (id: string) => void;
  setActiveModel: (id: string) => void;
  getModelConfig: (id: string) => AIModelConfig | undefined;
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

// 从 localStorage 加载模型数据
function loadModelsFromStorage(): AIModelStorage | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AIModelStorage;
    // 解密所有 API Key
    parsed.models = parsed.models.map((m) => ({
      ...m,
      apiKey: decryptApiKey(m.apiKey),
    }));
    return parsed;
  } catch {
    return null;
  }
}

// 将模型数据持久化到 localStorage
function saveModelsToStorage(models: AIModelConfig[], activeModelId: string) {
  const toSave: AIModelStorage = {
    models: models.map((m) => ({
      ...m,
      apiKey: encryptApiKey(m.apiKey),
    })),
    activeModelId,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

// 将内置模型转换为 AIModelConfig（apiKey 留空待用户填写）
function builtinToConfig(builtin: (typeof BUILTIN_MODELS)[number]): AIModelConfig {
  return {
    id: builtin.id,
    name: builtin.name,
    provider: builtin.provider,
    baseUrl: builtin.baseUrl,
    model: builtin.model,
    apiKey: "",
    isBuiltin: true,
    isActive: false,
    createdAt: new Date().toISOString(),
  };
}

export function AIProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<AIModelConfig[]>([]);
  const [activeModelId, setActiveModelIdState] = useState<string>(
    BUILTIN_MODELS[0]?.id ?? ""
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化：加载 localStorage 合并内置模型
  useEffect(() => {
    const stored = loadModelsFromStorage();
    if (stored) {
      // 合并内置模型：保留用户填写的 apiKey
      const builtinConfigs = BUILTIN_MODELS.map(builtinToConfig);
      const merged = builtinConfigs.map((builtin) => {
        const saved = stored.models.find((m) => m.id === builtin.id);
        return saved ? { ...builtin, apiKey: saved.apiKey, isActive: saved.isActive } : builtin;
      });
      // 追加自定义模型
      const customs = stored.models.filter((m) => !m.isBuiltin);
      setModels([...merged, ...customs]);
      setActiveModelIdState(stored.activeModelId);
    } else {
      setModels(BUILTIN_MODELS.map(builtinToConfig));
    }
    setIsInitialized(true);
  }, []);

  // 每次变更自动持久化
  useEffect(() => {
    if (!isInitialized) return;
    saveModelsToStorage(models, activeModelId);
  }, [models, activeModelId, isInitialized]);

  const addModel = useCallback(
    (input: Omit<AIModelConfig, "id" | "createdAt" | "isBuiltin" | "isActive">) => {
      const newModel: AIModelConfig = {
        ...input,
        id: `custom-${Date.now()}`,
        isBuiltin: false,
        isActive: false,
        createdAt: new Date().toISOString(),
      };
      setModels((prev) => [...prev, newModel]);
    },
    []
  );

  const updateModel = useCallback((id: string, updates: Partial<AIModelConfig>) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const removeModel = useCallback(
    (id: string) => {
      setModels((prev) => prev.filter((m) => m.id !== id));
      // 如果删除的是当前激活模型，切换到第一个
      if (id === activeModelId) {
        setActiveModelIdState((prev) => {
          const remaining = models.filter((m) => m.id !== id);
          return remaining[0]?.id ?? "";
        });
      }
    },
    [activeModelId, models]
  );

  const setActiveModel = useCallback((id: string) => {
    setModels((prev) =>
      prev.map((m) => ({ ...m, isActive: m.id === id }))
    );
    setActiveModelIdState(id);
  }, []);

  const getModelConfig = useCallback(
    (id: string) => models.find((m) => m.id === id),
    [models]
  );

  const activeModel = models.find((m) => m.id === activeModelId) ?? null;

  return (
    <AIContext.Provider
      value={{
        models,
        activeModelId,
        activeModel,
        addModel,
        updateModel,
        removeModel,
        setActiveModel,
        getModelConfig,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}
