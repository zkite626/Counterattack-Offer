"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/client";
import { adminApi } from "@/lib/api/admin";
import type { BackendAIModelConfig } from "@/lib/api/ai";
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
          <p className="admin-page__subtitle">配置平台兜底模型，Key 只展示掩码</p>
        </div>
        <Button variant="secondary" onClick={loadModels} loading={loading}>刷新</Button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-card admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-card__title">新增全局模型</h2>
        <div className="admin-form__row">
          <Input label="名称" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} required />
          <Input label="Provider" value={form.provider} onChange={(e) => setForm((p) => ({ ...p, provider: e.target.value }))} required />
        </div>
        <div className="admin-form__row">
          <Input label="Base URL" value={form.baseUrl} onChange={(e) => setForm((p) => ({ ...p, baseUrl: e.target.value }))} required />
          <Input label="Model" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} required />
        </div>
        <Input label="API Key" type="password" value={form.apiKey} onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))} required />
        <Button type="submit" loading={saving}>保存全局模型</Button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>名称</th><th>模型</th><th>Key</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                <td><strong>{model.displayName}</strong><div className="admin-muted">{model.provider}</div></td>
                <td>{model.model}<div className="admin-muted">{model.baseUrl}</div></td>
                <td>{model.apiKeyHint}</td>
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
