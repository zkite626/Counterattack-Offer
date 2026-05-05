"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/client";
import { adminApi } from "@/lib/api/admin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tag from "@/components/ui/Tag";

function formatError(error: unknown): string {
  if (error instanceof ApiError) return `${error.message}${error.requestId ? `（requestId: ${error.requestId}）` : ""}`;
  return error instanceof Error ? error.message : "操作失败";
}

export default function AdminSmtpPage() {
  const [form, setForm] = useState({
    host: "",
    port: 465,
    secure: true,
    username: "",
    password: "",
    fromName: "逆袭Offer",
    fromEmail: "",
    isEnabled: true,
  });
  const [testEmail, setTestEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const setting = await adminApi.getSmtp();
        if (setting) {
          setForm({
            host: setting.host,
            port: setting.port,
            secure: setting.secure,
            username: setting.username,
            password: "",
            fromName: setting.fromName,
            fromEmail: setting.fromEmail,
            isEnabled: setting.isEnabled,
          });
        }
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await adminApi.saveSmtp(form);
      setMessage("SMTP 配置已保存");
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSaving(false);
    }
  }

  async function test() {
    setMessage("");
    setError("");
    try {
      const result = await adminApi.testSmtp(testEmail);
      setMessage(result.message || "测试邮件已发送");
    } catch (err) {
      setError(formatError(err));
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">SMTP 设置</h1>
          <p className="admin-page__subtitle">用于邮箱验证、找回密码和系统邮件</p>
        </div>
        <Tag variant={form.isEnabled ? "success" : "warning"}>{form.isEnabled ? "启用" : "停用"}</Tag>
      </div>
      {loading && <div className="admin-card">加载中...</div>}
      {error && <div className="admin-error">{error}</div>}
      {message && <div className="admin-card">{message}</div>}

      <form className="admin-card admin-form" onSubmit={save}>
        <div className="admin-form__row">
          <Input label="Host" value={form.host} onChange={(e) => setForm((p) => ({ ...p, host: e.target.value }))} required />
          <Input label="Port" type="number" value={String(form.port)} onChange={(e) => setForm((p) => ({ ...p, port: Number(e.target.value) }))} required />
        </div>
        <div className="admin-form__row">
          <Input label="Username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required />
          <Input label="Password（不填则保持原密码）" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        </div>
        <div className="admin-form__row">
          <Input label="From Name" value={form.fromName} onChange={(e) => setForm((p) => ({ ...p, fromName: e.target.value }))} required />
          <Input label="From Email" type="email" value={form.fromEmail} onChange={(e) => setForm((p) => ({ ...p, fromEmail: e.target.value }))} required />
        </div>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.secure} onChange={(e) => setForm((p) => ({ ...p, secure: e.target.checked }))} />
          使用 TLS/SSL
        </label>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.isEnabled} onChange={(e) => setForm((p) => ({ ...p, isEnabled: e.target.checked }))} />
          启用 SMTP
        </label>
        <Button type="submit" loading={saving}>保存 SMTP</Button>
      </form>

      <div className="admin-card admin-form">
        <h2 className="admin-card__title">发送测试邮件</h2>
        <Input label="测试收件邮箱" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
        <Button variant="secondary" onClick={test} disabled={!testEmail}>发送测试</Button>
      </div>
    </div>
  );
}
