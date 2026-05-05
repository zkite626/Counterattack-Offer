"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/client";
import { adminApi } from "@/lib/api/admin";
import type { BackendAIModelConfig } from "@/lib/api/ai";
import { PROVIDER_OPTIONS, getProviderBaseUrl, getProviderLabel } from "@/lib/labels";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tag from "@/components/ui/Tag";

const EMPTY = { displayName: "", provider: "custom", baseUrl: "", model: "", apiKey: "" };

function formatError(error: unknown): string {
  if (error instanceof ApiError) return `${error.message}${error.requestId ? `（requestId: ${error.requestId}）` : ""}`;
  return error instanceof Error ? error.message : "操作失败";
}

export default function AdminAIModelsPage() {
  const [models, setModels] = useState<BackendAIModelConfig[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadModels() {
    setLoading(true);
    setError("");
    try {
      setModels(await adminApi.listGlobalModels());
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModels();
  }, []);

  function handleProviderChange(provider: string) {
    const baseUrl = getProviderBaseUrl(provider);
    setForm((prev) => ({
      ...prev,
      provider,
      baseUrl: baseUrl || prev.baseUrl,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminApi.createGlobalModel({
        displayName: form.displayName,
        provider: form.provider,
        baseUrl: form.baseUrl,
        model: form.model,
        apiKey: form.apiKey,
        isEnabled: true,
      });
      setForm(EMPTY);
      await loadModels();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSaving(false);
    }
  }

  async function setDefault(id: string) {
    try {
      await adminApi.setGlobalDefault(id);
      await loadModels();
    } catch (err) {
      setError(formatError(err));
    }
  }

  async function test(id: string) {
    try {
      await adminApi.testGlobalModel(id);
      await loadModels();
    } catch (err) {
      setError(formatError(err));
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">全局 AI 模型</h1>
          <p className="admin-page__subtitle">配置平台默认可用模型，密钥仅展示掩码和连接状态</p>
        </div>
        <Button variant="secondary" onClick={loadModels} loading={loading}>刷新</Button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-card admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-card__title">新增全局模型</h2>
        <div className="admin-form__row">
          <Input
            label="名称"
            placeholder="如：DeepSeek Chat - 全局默认"
            helper="用于后台列表和用户兜底模型展示，建议写清服务商和用途。"
            value={form.displayName}
            onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
            required
          />
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="global-provider">模型服务商</label>
            <select
              id="global-provider"
              className="admin-select"
              value={form.provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              required
            >
              {PROVIDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="admin-field__helper">选择常见服务商会自动填入接口地址，仍可手动修改。</span>
          </div>
        </div>
        <div className="admin-form__row">
          <Input
            label="接口地址"
            placeholder="如：https://api.deepseek.com"
            helper="填写 OpenAI 兼容接口地址，不要把模型 ID 填到这里。"
            value={form.baseUrl}
            onChange={(e) => setForm((p) => ({ ...p, baseUrl: e.target.value }))}
            required
          />
          <Input
            label="模型 ID"
            placeholder="如：deepseek-chat"
            helper="填写服务商控制台或文档中的模型标识。"
            value={form.model}
            onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
            required
          />
        </div>
        <Input
          label="密钥"
          type="password"
          placeholder="sk-..."
          helper="保存后会加密存储，列表只展示掩码和连接状态。"
          value={form.apiKey}
          onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
          required
        />
        <Button type="submit" loading={saving}>保存全局模型</Button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>名称</th><th>模型</th><th>密钥</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                <td><strong>{model.displayName}</strong><div className="admin-muted">{getProviderLabel(model.provider)}</div></td>
                <td>{model.model}<div className="admin-muted">{model.baseUrl}</div></td>
                <td>{model.apiKeyHint || "已安全保存"}</td>
                <td>
                  {model.isDefault && <Tag size="sm" variant="success">默认</Tag>}
                  <Tag size="sm" variant={model.isEnabled ? "success" : "warning"}>{model.isEnabled ? "启用" : "停用"}</Tag>
                </td>
                <td className="admin-actions">
                  <Button size="sm" variant="secondary" onClick={() => test(model.id)}>测试</Button>
                  {!model.isDefault && <Button size="sm" onClick={() => setDefault(model.id)}>设默认</Button>}
                </td>
              </tr>
            ))}
            {!loading && models.length === 0 && <tr><td colSpan={5}>暂无全局模型</td></tr>}
            {loading && <tr><td colSpan={5}>加载中...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
