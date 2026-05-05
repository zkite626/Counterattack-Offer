"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import Button from "@/components/ui/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("正在验证邮箱...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      const token = searchParams.get("token") ?? "";
      if (!token) {
        setError("验证链接缺少 token");
        setMessage("");
        return;
      }
      try {
        const result = await authApi.verifyEmail(token);
        setMessage(result.message || "邮箱验证成功。");
      } catch (err) {
        setError(err instanceof Error ? err.message : "验证失败");
        setMessage("");
      }
    }
    verify();
  }, [searchParams]);

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">邮箱验证</h2>
      {message && <div className="auth-card__success">{message}</div>}
      {error && <div className="auth-card__error">{error}</div>}
      <div className="auth-card__footer">
        <Button onClick={() => { window.location.href = "/login"; }} fullWidth>
          返回登录
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="auth-card">加载中...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
