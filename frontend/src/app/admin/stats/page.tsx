"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { adminApi, type AdminStats } from "@/lib/api/admin";

function formatError(error: unknown): string {
  if (error instanceof ApiError) return `${error.message}${error.requestId ? `（requestId: ${error.requestId}）` : ""}`;
  return error instanceof Error ? error.message : "加载失败";
}

const EMPTY_STATS: AdminStats = {
  todayRegistrations: 0,
  emailVerificationRate: 0,
  todayAiCalls: 0,
  aiSuccessRate: 0,
  aiLatencyP50: 0,
  aiLatencyP95: 0,
  estimatedModelCost: 0,
  smtpSuccessRate: 0,
  mailSuccessRate: 0,
  loginFailureCount: 0,
  apiErrorCodeDistribution: [],
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setStats(await adminApi.getStats());
      } catch (err) {
        setError(formatError(err));
      }
    }
    loadStats();
  }, []);

  const items = [
    ["今日注册", stats.todayRegistrations],
    ["邮箱验证率", `${Math.round(stats.emailVerificationRate * 100)}%`],
    ["今日 AI 调用", stats.todayAiCalls],
    ["AI 成功率", `${Math.round(stats.aiSuccessRate * 100)}%`],
    ["P50 延迟", `${stats.aiLatencyP50}ms`],
    ["P95 延迟", `${stats.aiLatencyP95}ms`],
    ["成本估算", `¥${stats.estimatedModelCost.toFixed(2)}`],
    ["SMTP 成功率", `${Math.round(stats.smtpSuccessRate * 100)}%`],
    ["登录失败", stats.loginFailureCount],
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">平台统计</h1>
          <p className="admin-page__subtitle">运营、AI 调用和邮件发送概览</p>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-page__grid admin-page__grid--stats">
        {items.map(([label, value]) => (
          <div className="admin-card admin-stat" key={label}>
            <span className="admin-stat__value">{value}</span>
            <span className="admin-stat__label">{label}</span>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h2 className="admin-card__title">API 错误码分布</h2>
        <div className="admin-error-codes">
          {stats.apiErrorCodeDistribution.length === 0 ? (
            <p className="admin-muted">暂无错误码统计</p>
          ) : (
            stats.apiErrorCodeDistribution.map((item) => (
              <div className="admin-error-code" key={item.errorCode}>
                <span className="admin-error-code__label">{item.errorCode}</span>
                <span className="admin-error-code__value">{item.count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
