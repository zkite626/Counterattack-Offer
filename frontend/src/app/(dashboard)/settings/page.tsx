"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useAI } from "@/contexts/AIContext";
import type { AIModelConfig } from "@/types/ai";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Tag from "@/components/ui/Tag";
import Icon from "@/components/ui/Icon";
import "./settings.css";

const PROVIDER_LABELS: Record<string, string> = {
  deepseek: "DeepSeek",
  openai: "OpenAI",
  zhipu: "智谱",
  alibaba: "阿里云",
  custom: "自定义",
};

const PROVIDER_ICON: Record<string, string> = {
  deepseek: "D",
  openai: "O",
  zhipu: "Z",
  alibaba: "Q",
  custom: "C",
};

interface ModelFormData {
  displayName: string;
  provider: string;
  baseUrl: string;
  model: string;
  apiKey: string;
}

const EMPTY_FORM: ModelFormData = {
  displayName: "",
  provider: "custom",
  baseUrl: "",
  model: "",
  apiKey: "",
};

export default function SettingsPage() {
  const {
    models,
    activeModelId,
    isLoading,
    error,
    fallbackToGlobal,
    addModel,
    updateModel,
    removeModel,
    setActiveModel,
    testModel,
  } = useAI();

  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModelConfig | null>(null);
  const [form, setForm] = useState<ModelFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  const handleOpenAdd = useCallback(() => {
    setEditingModel(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((model: AIModelConfig) => {
    setEditingModel(model);
    setForm({
      displayName: model.displayName,
      provider: model.provider,
      baseUrl: model.baseUrl,
      model: model.model,
      apiKey: "",
    });
    setFormError("");
    setShowModal(true);
  }, []);

  const handleSave = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!form.displayName.trim() || !form.baseUrl.trim() || !form.model.trim()) {
        setFormError("请填写模型名称、API 地址和 Model ID");
        return;
      }
      if (!editingModel && !form.apiKey.trim()) {
        setFormError("新增模型需要填写 API Key，保存后前端只显示掩码");
        return;
      }

      setSaving(true);
      setFormError("");
      try {
        const payload = {
          displayName: form.displayName.trim(),
          provider: form.provider.trim() || "custom",
          baseUrl: form.baseUrl.trim(),
          model: form.model.trim(),
          apiKey: form.apiKey.trim() || undefined,
        };
        if (editingModel) {
          await updateModel(editingModel.id, payload);
        } else {
          await addModel(payload);
        }
        setShowModal(false);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "保存失败");
      } finally {
        setSaving(false);
      }
    },
    [addModel, editingModel, form, updateModel]
  );

  const handleDelete = useCallback(
    async (model: AIModelConfig) => {
      if (model.scope === "global") return;
      if (window.confirm("确定删除该模型？后端会同步删除密钥配置。")) {
        await removeModel(model.id);
      }
    },
    [removeModel]
  );

  const handleTest = useCallback(
    async (model: AIModelConfig) => {
      setTestingId(model.id);
      setTestResult(null);
      try {
        const result = await testModel(model.id);
        setTestResult({ id: model.id, ...result });
      } catch (err) {
        setTestResult({
          id: model.id,
          success: false,
          message: err instanceof Error ? err.message : "请求失败，请检查网络",
        });
      } finally {
        setTestingId(null);
      }
    },
    [testModel]
  );

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">模型管理</h1>
        <p className="settings__subtitle">
          API Key 由后端加密保存，前端只展示掩码和连接状态
        </p>
      </div>

      <div className="settings__active-banner">
        <span className="settings__active-icon">✦</span>
        <span className="settings__active-label">
          当前使用模型：
          <strong>{models.find((model) => model.id === activeModelId)?.displayName ?? "未选择"}</strong>
        </span>
        {fallbackToGlobal && <Tag size="sm">支持全局兜底</Tag>}
      </div>

      {error && <div className="settings__test-result settings__test-result--error">{error}</div>}

      <section className="settings__section">
        <div className="settings__section-header">
          <h2 className="settings__section-title">全部模型</h2>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            + 添加模型
          </Button>
        </div>

        {isLoading ? (
          <Card className="settings__model-card">模型加载中...</Card>
        ) : (
          <div className="settings__model-grid">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isActive={model.id === activeModelId}
                onSetActive={() => setActiveModel(model.id)}
                onEdit={() => handleOpenEdit(model)}
                onDelete={() => handleDelete(model)}
                onTest={() => handleTest(model)}
                testingId={testingId}
                testResult={testResult}
              />
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingModel ? "编辑模型" : "添加模型"}
        size="md"
      >
        <form className="settings__form" onSubmit={handleSave}>
          {formError && <div className="settings__test-result settings__test-result--error">{formError}</div>}
          <Input
            label="模型名称"
            placeholder="如：DeepSeek Chat"
            value={form.displayName}
            onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
            required
          />
          <Input
            label="Provider"
            placeholder="deepseek / openai / custom"
            value={form.provider}
            onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
            required
          />
          <Input
            label="API Base URL"
            placeholder="https://api.deepseek.com"
            value={form.baseUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, baseUrl: e.target.value }))}
            required
          />
          <Input
            label="Model ID"
            placeholder="deepseek-chat"
            value={form.model}
            onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
            required
          />
          <Input
            label={editingModel ? "新 API Key（不填则保持原密钥）" : "API Key"}
            type="password"
            placeholder="sk-..."
            value={form.apiKey}
            onChange={(e) => setForm((prev) => ({ ...prev, apiKey: e.target.value }))}
          />
          <div className="settings__form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              {editingModel ? "保存修改" : "添加模型"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

interface ModelCardProps {
  model: AIModelConfig;
  isActive: boolean;
  onSetActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTest: () => void;
  testingId: string | null;
  testResult: { id: string; success: boolean; message: string } | null;
}

function ModelCard({
  model,
  isActive,
  onSetActive,
  onEdit,
  onDelete,
  onTest,
  testingId,
  testResult,
}: ModelCardProps) {
  const isTesting = testingId === model.id;
  const currentTestResult = testResult?.id === model.id ? testResult : null;

  return (
    <Card
      className={`settings__model-card ${isActive ? "settings__model-card--active" : ""}`}
      hoverable
    >
      <div className="settings__model-card-header">
        <div className="settings__model-icon">
          {PROVIDER_ICON[model.provider] ?? model.displayName.charAt(0)}
        </div>
        <div className="settings__model-info">
          <h3 className="settings__model-name">{model.displayName}</h3>
          <span className="settings__model-provider">
            {PROVIDER_LABELS[model.provider] ?? model.provider}
          </span>
        </div>
        {isActive && <Tag variant="success" size="sm">默认</Tag>}
        {model.scope === "global" && <Tag size="sm">全局</Tag>}
      </div>

      <div className="settings__model-meta">
        <span className="settings__model-id">{model.model}</span>
      </div>
      <p className="settings__model-url">{model.baseUrl}</p>

      <div className="settings__key-warning">
        <Icon name="warning" size="1.125em" className="settings__key-warning-icon" />
        <span>Key：{model.apiKeyHint || "已由后端保存"}</span>
      </div>

      {model.lastTestStatus && (
        <div className={`settings__test-result settings__test-result--${model.lastTestStatus === "success" ? "success" : "error"}`}>
          最近测试：{model.lastTestStatus === "success" ? "成功" : "失败"}
        </div>
      )}

      {currentTestResult && (
        <div className={`settings__test-result ${currentTestResult.success ? "settings__test-result--success" : "settings__test-result--error"}`}>
          {currentTestResult.message}
        </div>
      )}

      <div className="settings__model-actions">
        {!isActive && (
          <Button variant="primary" size="sm" onClick={onSetActive}>
            设为默认
          </Button>
        )}
        <Button variant="secondary" size="sm" loading={isTesting} onClick={onTest}>
          测试连接
        </Button>
        {model.scope === "user" && (
          <>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              编辑
            </Button>
            <Button variant="danger" size="sm" onClick={onDelete}>
              删除
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
