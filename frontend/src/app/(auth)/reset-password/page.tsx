"use client";

import { useState, type FormEvent } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const token = searchParams.get("token") ?? "";
    setMessage("");
    setError("");
    if (!token) {
      setError("重置链接缺少 token");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.resetPassword(token, password);
      setMessage(result.message || "密码已重置，请返回登录。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "重置失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">重置密码</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        {error && <div className="auth-card__error">{error}</div>}
        {message && <div className="auth-card__success">{message}</div>}
        <Input
          label="新密码"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Input
          label="确认新密码"
          type="password"
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          重置密码
        </Button>
      </form>
      <div className="auth-card__footer">
        <a href="/login" className="auth-card__link">返回登录</a>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-card">加载中...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
