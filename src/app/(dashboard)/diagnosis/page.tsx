"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ScoreRing from "@/components/ui/ScoreRing";
import Skeleton from "@/components/ui/Skeleton";
import type { CareerDiagnosis } from "@/types";
import { normalizeCareerDiagnosis } from "@/lib/utils/ai-results";
import "../shared-page.css";

export default function DiagnosisPage() {
  const router = useRouter();
  const { state, dispatch } = useJobFlow();
  const { activeModel } = useAI();
  const [diagnosis, setDiagnosis] = useState<CareerDiagnosis | null>(
    normalizeCareerDiagnosis(state.careerDiagnosis)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runDiagnosis = useCallback(async () => {
    if (!state.studentProfile) {
      router.push("/profile");
      return;
    }

    if (!activeModel?.apiKey) {
      setError("请先在模型管理中配置 AI 模型");
      return;
    }

    const modelConfig = activeModel;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentProfile: state.studentProfile,
          modelConfig,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "诊断失败");

      const normalized = normalizeCareerDiagnosis(json.data);
      if (!normalized) throw new Error("画像诊断结果格式不正确");

      setDiagnosis(normalized);
      dispatch({ type: "SET_DIAGNOSIS", payload: normalized });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.studentProfile, activeModel, dispatch, router]);

  useEffect(() => {
    if (!diagnosis && state.studentProfile && activeModel?.apiKey) {
      runDiagnosis();
    }
  }, [diagnosis, state.studentProfile, activeModel?.apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const priorityLabel: Record<string, string> = {
    safe: "稳妥",
    recommended: "推荐",
    challenge: "挑战",
  };
  const priorityVariant: Record<string, "success" | "default" | "warning"> = {
    safe: "success",
    recommended: "default",
    challenge: "warning",
  };

  if (loading) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">画像诊断</h1>
          <p className="biz-page__subtitle">AI 正在分析你的求职画像...</p>
        </div>
        <Card className="biz-page__skeleton-card">
          <Skeleton variant="rect" width="120px" height="32px" />
          <div style={{ marginTop: "var(--space-4)" }}>
            <Skeleton variant="text" count={3} />
          </div>
          <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-3)" }}>
            <Skeleton variant="rect" width="100px" height="80px" />
            <Skeleton variant="rect" width="100px" height="80px" />
            <Skeleton variant="rect" width="100px" height="80px" />
          </div>
        </Card>
      </div>
    );
  }

  if (error && !diagnosis) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">画像诊断</h1>
          <p className="biz-page__subtitle">AI 将基于你的信息生成求职画像分析</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-danger-500)", marginBottom: "var(--space-4)" }}>{error}</p>
            <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center" }}>
              <Button onClick={runDiagnosis}>重试</Button>
              <Button variant="secondary" onClick={() => { setError(""); router.push("/profile"); }}>返回修改</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">画像诊断</h1>
          <p className="biz-page__subtitle">AI 将基于你的信息生成求职画像分析</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
              {state.studentProfile ? "点击下方按钮，AI 将为你生成求职画像" : "请先填写个人信息"}
            </p>
            {state.studentProfile ? (
              <Button onClick={runDiagnosis} disabled={!activeModel?.apiKey}>
                开始 AI 诊断
              </Button>
            ) : (
              <Button onClick={() => router.push("/profile")}>去填写个人信息</Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">画像诊断</h1>
        <p className="biz-page__subtitle">基于你的信息，AI 生成了以下求职画像分析</p>
      </div>

      {/* Summary with student type */}
      <Card className="biz-page__section biz-page__hero-panel">
        <div className="biz-page__hero-glow" />
        <div className="biz-page__student-type" style={{ marginBottom: "var(--space-3)" }}>
          <Tag size="md">{diagnosis.studentType}</Tag>
        </div>
        <p className="biz-page__summary">{diagnosis.summary}</p>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="biz-page__grid-2">
        <Card className="biz-page__strength-card biz-page__spotlight-card">
          <h3 className="biz-page__card-title biz-page__card-title--green">核心优势</h3>
          <ul className="biz-page__list">
            {(diagnosis.coreStrengths ?? []).map((s, i) => (
              <li key={i} className="biz-page__list-item biz-page__list-item--green">{s}</li>
            ))}
          </ul>
        </Card>
        <Card className="biz-page__weakness-card biz-page__accent-card">
          <h3 className="biz-page__card-title biz-page__card-title--orange">主要短板</h3>
          <ul className="biz-page__list">
            {(diagnosis.mainWeaknesses ?? []).map((w, i) => (
              <li key={i} className="biz-page__list-item biz-page__list-item--orange">{w}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recommended roles */}
      <h2 className="biz-page__sub-heading">推荐岗位</h2>
      <div className="biz-page__roles-grid">
        {(diagnosis.recommendedRoles ?? []).map((role, i) => (
          <Card key={i} hoverable className="biz-page__role-card biz-page__tinted-card">
            <div className="biz-page__role-header">
              <span className="biz-page__role-name">{role.role}</span>
              <Tag variant={priorityVariant[role.priority] || "default"} size="sm">
                {priorityLabel[role.priority] || role.priority}
              </Tag>
            </div>
            <div className="biz-page__role-score">
              <ScoreRing score={role.fitScore} size={72} strokeWidth={5} label="匹配" />
            </div>
            <p className="biz-page__role-reason">{role.reason}</p>
          </Card>
        ))}
      </div>

      {/* Career advice */}
      <Card className="biz-page__section biz-page__hero-panel">
        <div className="biz-page__hero-glow biz-page__hero-glow--right" />
        <h3 className="biz-page__card-title">AI 综合建议</h3>
        <p className="biz-page__advice">{diagnosis.careerAdvice}</p>
      </Card>

      {/* Actions */}
      <div className="biz-page__actions">
        <Button size="lg" onClick={() => router.push("/translation")}>
          下一步：经历转译
        </Button>
        <Button variant="secondary" onClick={runDiagnosis}>
          重新生成
        </Button>
      </div>
    </div>
  );
}
