"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="error-fallback">
      <div className="error-fallback__container">
        <div className="error-fallback__icon">⚠️</div>
        <h2 className="error-fallback__title">页面出现了问题</h2>
        <p className="error-fallback__message">
          抱歉，该功能页面加载时遇到错误。请尝试重试或前往其他页面。
        </p>
        <div className="error-fallback__actions">
          <button className="btn btn--primary" onClick={reset}>
            重试
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => (window.location.href = "/profile")}
          >
            返回个人信息
          </button>
        </div>
      </div>
    </div>
  );
}
