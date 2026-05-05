"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { aiApi, normalizeModel, type SaveModelPayload } from "@/lib/api/ai";
import type { AIModelConfig } from "@/types/ai";

interface AIContextValue {
  models: AIModelConfig[];
  userModels: AIModelConfig[];
  globalModels: AIModelConfig[];
  activeModelId: string;
  activeModel: AIModelConfig | null;
  envConfigLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  fallbackToGlobal: boolean;
  addModel: (model: SaveModelPayload) => Promise<void>;
  updateModel: (id: string, updates: Partial<SaveModelPayload>) => Promise<void>;
  removeModel: (id: string) => Promise<void>;
  setActiveModel: (id: string) => Promise<void>;
  testModel: (id: string) => Promise<{ success: boolean; message: string }>;
  refreshModels: () => Promise<void>;
  getModelConfig: (id: string) => AIModelConfig | undefined;
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [userModels, setUserModels] = useState<AIModelConfig[]>([]);
  const [globalModels, setGlobalModels] = useState<AIModelConfig[]>([]);
  const [activeModelId, setActiveModelIdState] = useState("");
  const [fallbackToGlobal, setFallbackToGlobal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envConfigLoaded, setEnvConfigLoaded] = useState(false);

  const refreshModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await aiApi.listModels();
      const activeId =
        payload.activeModelId ??
        payload.userModels.find((model) => model.isDefault)?.id ??
        payload.globalModels.find((model) => model.isDefault)?.id ??
        payload.userModels[0]?.id ??
        payload.globalModels[0]?.id ??
        "";

      setActiveModelIdState(activeId);
      setFallbackToGlobal(payload.fallbackToGlobal);
      setUserModels(payload.userModels.map((model) => normalizeModel(model, activeId)));
      setGlobalModels(payload.globalModels.map((model) => normalizeModel(model, activeId)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "模型列表加载失败");
      setUserModels([]);
      setGlobalModels([]);
      setActiveModelIdState("");
    } finally {
      setIsLoading(false);
      setEnvConfigLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  const addModel = useCallback(
    async (input: SaveModelPayload) => {
      await aiApi.createModel(input);
      await refreshModels();
    },
    [refreshModels]
  );

  const updateModel = useCallback(
    async (id: string, updates: Partial<SaveModelPayload>) => {
      await aiApi.updateModel(id, updates);
      await refreshModels();
    },
    [refreshModels]
  );

  const removeModel = useCallback(
    async (id: string) => {
      await aiApi.deleteModel(id);
      await refreshModels();
    },
    [refreshModels]
  );

  const setActiveModel = useCallback(
    async (id: string) => {
      await aiApi.setDefault(id);
      await refreshModels();
    },
    [refreshModels]
  );

  const testModel = useCallback(
    async (id: string) => {
      const result = await aiApi.testModel(id);
      await refreshModels();
      return {
        success: result.success,
        message: result.success ? `连接成功，耗时 ${result.latencyMs}ms` : result.errorCode ?? "连接失败",
      };
    },
    [refreshModels]
  );

  const models = useMemo(() => [...userModels, ...globalModels], [userModels, globalModels]);
  const activeModel = useMemo(
    () => models.find((model) => model.id === activeModelId) ?? null,
    [models, activeModelId]
  );
  const getModelConfig = useCallback(
    (id: string) => models.find((model) => model.id === id),
    [models]
  );

  const value = useMemo<AIContextValue>(
    () => ({
      models,
      userModels,
      globalModels,
      activeModelId,
      activeModel,
      envConfigLoaded,
      isLoading,
      error,
      fallbackToGlobal,
      addModel,
      updateModel,
      removeModel,
      setActiveModel,
      testModel,
      refreshModels,
      getModelConfig,
    }),
    [
      models,
      userModels,
      globalModels,
      activeModelId,
      activeModel,
      envConfigLoaded,
      isLoading,
      error,
      fallbackToGlobal,
      addModel,
      updateModel,
      removeModel,
      setActiveModel,
      testModel,
      refreshModels,
      getModelConfig,
    ]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}
