"use client";

import { useEffect } from "react";
import Icon from "@/components/ui/Icon";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function readRequestId(error: Error): string | null {
  const candidate = error as Error & { requestId?: string };

  if (typeof candidate.requestId === "string") {
    return candidate.requestId;
  }

  return null;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);
  const requestId = readRequestId(error);

  return (
    <div className="error-fallback">
      <div className="error-fallback__container">
        <div className="error-fallback__icon"><Icon name="triangle-warning" size="3rem" /></div>
        <h2 className="error-fallback__title">应用出现了错误</h2>
        <p className="error-fallback__message">
          抱歉，发生了意外错误。请尝试重新加载页面。
        </p>
        {requestId && (
          <p className="error-fallback__message">请求编号：{requestId}</p>
        )}
        <div className="error-fallback__actions">
          <button className="btn btn--primary" onClick={reset}>
            重试
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => (window.location.href = "/")}
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
