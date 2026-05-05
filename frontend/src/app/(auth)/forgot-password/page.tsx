"use client";

import { useState, type FormEvent } from "react";
import { authApi } from "@/lib/api/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const result = await authApi.forgotPassword(email);
      setMessage(result.message || "如果邮箱存在，重置邮件会发送到你的邮箱。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">找回密码</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        {error && <div className="auth-card__error">{error}</div>}
        {message && <div className="auth-card__success">{message}</div>}
        <Input
          label="注册邮箱"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          发送重置邮件
        </Button>
      </form>
      <div className="auth-card__footer">
        <a href="/login" className="auth-card__link">返回登录</a>
      </div>
    </div>
  );
}
