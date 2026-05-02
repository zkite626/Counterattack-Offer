"use client";

import { useState, useCallback } from "react";
import { useAI } from "@/contexts/AIContext";
import type { AIModelConfig } from "@/types/ai";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Tag from "@/components/ui/Tag";
import Icon from "@/components/ui/Icon";
import "./settings.css";

// 提供商显示信息
const PROVIDER_LABELS: Record<string, string> = {
  deepseek: "DeepSeek",
  openai: "OpenAI",
  zhipu: "智谱",
  alibaba: "阿里云",
};

// 提供商默认图标字母
const PROVIDER_ICON: Record<string, string> = {
  deepseek: "D",
  openai: "O",
  zhipu: "Z",
  alibaba: "Q",
};

interface ModelFormData {
  name: string;
  baseUrl: string;
  model: string;
  apiKey: string;
}

const EMPTY_FORM: ModelFormData = { name: "", baseUrl: "", model: "", apiKey: "" };

export default function SettingsPage() {
  const {
    models,
    activeModelId,
    addModel,
    updateModel,
    removeModel,
    setActiveModel,
  } = useAI();

  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModelConfig | null>(null);
  const [form, setForm] = useState<ModelFormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<ModelFormData>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // 内置模型 vs 自定义模型
  const builtinModels = models.filter((m) => m.isBuiltin);
  const customModels = models.filter((m) => !m.isBuiltin);

  // 验证表单
  const validateForm = useCallback((): boolean => {
    const errors: Partial<ModelFormData> = {};
    if (!form.name.trim()) errors.name = "请输入模型名称";
    if (!form.baseUrl.trim()) errors.baseUrl = "请输入 API 地址";
    if (!form.model.trim()) errors.model = "请输入模型 ID";
    if (!form.apiKey.trim()) errors.apiKey = "请输入 API Key";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  // 打开添加模型弹窗
  const handleOpenAdd = useCallback(() => {
    setEditingModel(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  }, []);

  // 打开编辑模型弹窗
  const handleOpenEdit = useCallback((model: AIModelConfig) => {
    setEditingModel(model);
    setForm({
      name: model.name,
      baseUrl: model.baseUrl,
      model: model.model,
      apiKey: model.apiKey,
    });
    setFormErrors({});
    setShowModal(true);
  }, []);

  // 保存模型
  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    if (editingModel) {
      // 编辑模式
      updateModel(editingModel.id, {
        name: form.name,
        baseUrl: form.baseUrl,
        model: form.model,
        apiKey: form.apiKey,
      });
    } else {
      // 新增模式
      addModel({
        name: form.name,
        provider: "custom",
        baseUrl: form.baseUrl,
        model: form.model,
        apiKey: form.apiKey,
      });
    }

    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditingModel(null);
  }, [form, editingModel, validateForm, addModel, updateModel]);

  // 删除模型
  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm("确定删除该自定义模型？")) {
        removeModel(id);
      }
    },
    [removeModel]
  );

  // 测试连接
  const handleTest = useCallback(
    async (model: AIModelConfig) => {
      setTestingId(model.id);
      setTestResult(null);
      try {
        const res = await fetch("/api/ai/test-connection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            baseUrl: model.baseUrl,
            model: model.model,
            apiKey: model.apiKey,
          }),
        });
        const data = await res.json();
        setTestResult({
          id: model.id,
          success: data.success,
          message: data.success ? "连接成功" : data.error?.message ?? "连接失败",
        });
      } catch {
        setTestResult({ id: model.id, success: false, message: "请求失败，请检查网络" });
      } finally {
        setTestingId(null);
      }
    },
    []
  );

  // 更新内置模型的 API Key
  const handleUpdateApiKey = useCallback(
    (modelId: string, apiKey: string) => {
      updateModel(modelId, { apiKey });
    },
    [updateModel]
  );

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">模型管理</h1>
        <p className="settings__subtitle">
          配置 AI 模型，选择最适合你的大语言模型服务
        </p>
      </div>

      {/* 当前激活模型提示 */}
      <div className="settings__active-banner">
        <span className="settings__active-icon">✦</span>
        <span className="settings__active-label">
          当前使用模型：
          <strong>{models.find((m) => m.id === activeModelId)?.name ?? "未选择"}</strong>
        </span>
      </div>

      {/* 内置模型 */}
      <section className="settings__section">
        <h2 className="settings__section-title">内置模型</h2>
        <div className="settings__model-grid">
          {builtinModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isActive={model.id === activeModelId}
              onSetActive={() => setActiveModel(model.id)}
              onEdit={() => handleOpenEdit(model)}
              onTest={() => handleTest(model)}
              onUpdateApiKey={(key) => handleUpdateApiKey(model.id, key)}
              testingId={testingId}
              testResult={testResult}
            />
          ))}
        </div>
      </section>

      {/* 自定义模型 */}
      <section className="settings__section">
        <div className="settings__section-header">
          <h2 className="settings__section-title">自定义模型</h2>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            + 添加模型
          </Button>
        </div>
        {customModels.length === 0 ? (
          <Card className="settings__empty-card">
            <p className="settings__empty-text">
              暂无自定义模型，点击上方按钮添加 OpenAI 兼容的模型
            </p>
          </Card>
        ) : (
          <div className="settings__model-grid">
            {customModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isActive={model.id === activeModelId}
                onSetActive={() => setActiveModel(model.id)}
                onEdit={() => handleOpenEdit(model)}
                onDelete={() => handleDelete(model.id)}
                onTest={() => handleTest(model)}
                onUpdateApiKey={(key) => handleUpdateApiKey(model.id, key)}
                testingId={testingId}
                testResult={testResult}
              />
            ))}
          </div>
        )}
      </section>

      {/* 添加/编辑模型弹窗 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingModel ? "编辑模型" : "添加自定义模型"}
        size="md"
      >
        <div className="settings__form">
          <Input
            label="模型名称"
            placeholder="如：我的 DeepSeek"
            value={form.name}
            error={formErrors.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="API Base URL"
            placeholder="https://api.deepseek.com"
            value={form.baseUrl}
            error={formErrors.baseUrl}
            onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
            required
          />
          <Input
            label="Model ID"
            placeholder="deepseek-chat"
            value={form.model}
            error={formErrors.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            required
          />
          <Input
            label="API Key"
            type="password"
            placeholder="sk-..."
            value={form.apiKey}
            error={formErrors.apiKey}
            onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
            required
          />
          <div className="settings__form-actions">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingModel ? "保存修改" : "添加模型"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── 模型卡片组件 ── */

interface ModelCardProps {
  model: AIModelConfig;
  isActive: boolean;
  onSetActive: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onTest: () => void;
  onUpdateApiKey: (key: string) => void;
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
  onUpdateApiKey,
  testingId,
  testResult,
}: ModelCardProps) {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyValue, setKeyValue] = useState(model.apiKey);

  const isTesting = testingId === model.id;
  const currentTestResult = testResult?.id === model.id ? testResult : null;
  const hasKey = model.apiKey.length > 0;

  return (
    <Card
      className={`settings__model-card ${isActive ? "settings__model-card--active" : ""}`}
      hoverable
    >
      <div className="settings__model-card-header">
        <div className="settings__model-icon">
          {PROVIDER_ICON[model.provider] ?? model.name.charAt(0)}
        </div>
        <div className="settings__model-info">
          <h3 className="settings__model-name">{model.name}</h3>
          <span className="settings__model-provider">
            {PROVIDER_LABELS[model.provider] ?? model.provider}
          </span>
        </div>
        {isActive && (
          <Tag variant="success" size="sm">
            激活中
          </Tag>
        )}
      </div>

      <div className="settings__model-meta">
        <span className="settings__model-id">{model.model}</span>
      </div>

      {!model.isBuiltin && (
        <p className="settings__model-url">{model.baseUrl}</p>
      )}

      {/* API Key 区域 */}
      {!hasKey && !showKeyInput && (
        <div className="settings__key-warning">
          <Icon name="warning" size="1.125em" className="settings__key-warning-icon" />
          <span>未配置 API Key</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKeyInput(true)}
          >
            配置
          </Button>
        </div>
      )}

      {showKeyInput && (
        <div className="settings__key-input-row">
          <Input
            type="password"
            placeholder="输入 API Key"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onUpdateApiKey(keyValue);
              setShowKeyInput(false);
            }}
          >
            保存
          </Button>
        </div>
      )}

      {/* 测试结果 */}
      {currentTestResult && (
        <div
          className={`settings__test-result ${currentTestResult.success ? "settings__test-result--success" : "settings__test-result--error"}`}
        >
          {currentTestResult.message}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="settings__model-actions">
        {!isActive && (
          <Button variant="primary" size="sm" onClick={onSetActive}>
            设为激活
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          loading={isTesting}
          onClick={onTest}
          disabled={!hasKey}
        >
          测试连接
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          编辑
        </Button>
        {hasKey && !showKeyInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setKeyValue(model.apiKey);
              setShowKeyInput(true);
            }}
          >
            修改Key
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" size="sm" onClick={onDelete}>
            删除
          </Button>
        )}
      </div>
    </Card>
  );
}
