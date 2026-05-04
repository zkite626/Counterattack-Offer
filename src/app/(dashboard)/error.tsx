"use client";

import { useEffect } from "react";
import Icon from "@/components/ui/Icon";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// 根据当前路径推导合适的回退页面
function getFallbackRoute(): { path: string; label: string } {
  if (typeof window === "undefined") return { path: "/profile", label: "返回个人信息" };
  const pathname = window.location.pathname;
  const flowOrder = [
    { path: "/profile", label: "返回个人信息" },
    { path: "/diagnosis", label: "返回画像诊断" },
    { path: "/translation", label: "返回经历转译" },
    { path: "/job", label: "返回 JD 解析" },
    { path: "/match", label: "返回人岗匹配" },
    { path: "/resume", label: "返回简历优化" },
    { path: "/interview", label: "返回面试训练" },
    { path: "/plan", label: "返回能力计划" },
    { path: "/report", label: "返回汇总报告" },
  ];
  const idx = flowOrder.findIndex((f) => pathname.startsWith(f.path));
  // 回退到前一步；如果没有匹配或已在第一步，回到个人信息
  return idx > 0 ? flowOrder[idx - 1] : flowOrder[0];
}

export default function DashboardError({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  const fallback = getFallbackRoute();

  return (
    <div className="error-fallback">
      <div className="error-fallback__container">
        <div className="error-fallback__icon"><Icon name="triangle-warning" size="3rem" /></div>
        <h2 className="error-fallback__title">页面出现了问题</h2>
        <p className="error-fallback__message">
          抱歉，该功能页面加载时遇到错误。请尝试重试或前往其他页面。
        </p>
        <div className="error-fallback__actions">
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            重试
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => (window.location.href = fallback.path)}
          >
            {fallback.label}
          </button>
        </div>
      </div>
    </div>
  );
}
