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
          <Input
            label="SMTP 主机"
            placeholder="如：smtp.exmail.qq.com"
            helper="填写邮件服务商提供的 SMTP 服务器地址。"
            value={form.host}
            onChange={(e) => setForm((p) => ({ ...p, host: e.target.value }))}
            required
          />
          <Input
            label="端口"
            type="number"
            placeholder="465"
            helper="SSL 常用 465，STARTTLS 常用 587，请以服务商说明为准。"
            value={String(form.port)}
            onChange={(e) => setForm((p) => ({ ...p, port: Number(e.target.value) }))}
            required
          />
        </div>
        <div className="admin-form__row">
          <Input
            label="登录账号"
            placeholder="如：no-reply@nixioffer.com"
            helper="通常与发件邮箱一致，部分服务商会使用独立账号。"
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            required
          />
          <Input
            label="SMTP 密码（不填则保持原密码）"
            type="password"
            placeholder="授权码或应用专用密码"
            helper="首次配置或更换密码时填写，保存后会加密存储并只展示掩码。"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
        </div>
        <div className="admin-form__row">
          <Input
            label="发件人名称"
            placeholder="如：逆袭Offer"
            helper="用户在邮件客户端中看到的发件人名称。"
            value={form.fromName}
            onChange={(e) => setForm((p) => ({ ...p, fromName: e.target.value }))}
            required
          />
          <Input
            label="发件邮箱"
            type="email"
            placeholder="如：no-reply@nixioffer.com"
            helper="应使用服务商允许的发件地址，避免邮件被拒收。"
            value={form.fromEmail}
            onChange={(e) => setForm((p) => ({ ...p, fromEmail: e.target.value }))}
            required
          />
        </div>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.secure} onChange={(e) => setForm((p) => ({ ...p, secure: e.target.checked }))} />
          使用 TLS/SSL
        </label>
        <p className="admin-field__helper">开启后将使用加密连接，常见于 465 端口；如服务商要求 STARTTLS，请按官方说明配置。</p>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.isEnabled} onChange={(e) => setForm((p) => ({ ...p, isEnabled: e.target.checked }))} />
          启用 SMTP
        </label>
        <p className="admin-field__helper">关闭后系统将不会发送注册验证、找回密码和测试邮件。</p>
        <Button type="submit" loading={saving}>保存 SMTP</Button>
      </form>

      <div className="admin-card admin-form">
        <h2 className="admin-card__title">发送测试邮件</h2>
        <Input
          label="测试收件邮箱"
          type="email"
          placeholder="如：admin@nixioffer.com"
          helper="保存配置后，向这个邮箱发送一封测试邮件确认 SMTP 可用。"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
        />
        <Button variant="secondary" onClick={test} disabled={!testEmail}>发送测试</Button>
      </div>
    </div>
  );
}
