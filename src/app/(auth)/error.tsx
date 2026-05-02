"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[AuthError]", error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
      <h2 style={{ marginBottom: "0.5rem" }}>认证页面出现错误</h2>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
        请尝试重新加载页面。
      </p>
      <button className="btn btn--primary" onClick={reset}>
        重试
      </button>
    </div>
  );
}
