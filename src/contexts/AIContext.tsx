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
  envConfigLoaded: boolean;
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
  const [envConfigLoaded, setEnvConfigLoaded] = useState(false);

  // 初始化：加载 localStorage 合并内置模型 + 应用 .env.local 默认配置
  useEffect(() => {
    const stored = loadModelsFromStorage();
    let initialModels: AIModelConfig[];
    let initialActiveId: string;

    if (stored) {
      const storedIds = new Set(stored.models.map((m) => m.id));
      // 只添加用户未删除的内置模型，保留用户已填写的 apiKey
      const builtinConfigs = BUILTIN_MODELS
        .map(builtinToConfig)
        .filter((b) => storedIds.has(b.id)) // 已保存过的内置模型
        .map((builtin) => {
          const saved = stored.models.find((m) => m.id === builtin.id)!;
          return { ...builtin, apiKey: saved.apiKey, isActive: saved.isActive };
        });
      // 首次使用：添加所有内置模型
      const newBuiltins = storedIds.size === 0
        ? BUILTIN_MODELS.map(builtinToConfig)
        : [];
      const customs = stored.models.filter((m) => !m.isBuiltin);
      initialModels = [...newBuiltins, ...builtinConfigs, ...customs];
      initialActiveId = stored.activeModelId;
    } else {
      initialModels = BUILTIN_MODELS.map(builtinToConfig);
      initialActiveId = BUILTIN_MODELS[0]?.id ?? "";
    }

    // 从 .env.local 获取默认配置并自动应用
    fetch("/api/ai/default-config")
      .then((res) => res.json())
      .then((json) => {
        if (!json.success || !json.data) return;
        const { baseUrl, model, apiKey } = json.data as {
          baseUrl: string;
          model: string;
          apiKey?: string;
        };
        if (!baseUrl || !model) return;

        setModels((prev) => {
          let updated = [...prev];
          // 查找匹配的内置模型（按 baseUrl + model 匹配）
          const matchIdx = updated.findIndex(
            (m) => m.baseUrl === baseUrl && m.model === model
          );
          if (matchIdx >= 0) {
            // 匹配到内置模型：补充 apiKey
            if (apiKey && !updated[matchIdx].apiKey) {
              updated[matchIdx] = { ...updated[matchIdx], apiKey };
            }
          } else if (apiKey) {
            // 未匹配到：添加为新模型
            const newModel: AIModelConfig = {
              id: `env-default`,
              name: `默认模型 (${model})`,
              provider: "custom",
              baseUrl,
              model,
              apiKey,
              isBuiltin: false,
              isActive: false,
              createdAt: new Date().toISOString(),
            };
            updated = [...updated, newModel];
          }

          // 如果当前激活模型没有 apiKey，切换到有 key 的模型
          const currentActive = updated.find((m) => m.id === initialActiveId);
          if (!currentActive?.apiKey) {
            const withKey = updated.find((m) => m.apiKey);
            if (withKey) {
              updated = updated.map((m) => ({ ...m, isActive: m.id === withKey.id }));
              setActiveModelIdState(withKey.id);
            }
          }
          return updated;
        });
      })
      .catch(() => {
        // env 未配置时静默忽略
      })
      .finally(() => {
        setEnvConfigLoaded(true);
      });

    setModels(initialModels);
    setActiveModelIdState(initialActiveId);
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
        setActiveModelIdState(() => {
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
        envConfigLoaded,
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
