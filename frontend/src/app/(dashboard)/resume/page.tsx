"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import { aiApi } from "@/lib/api/ai";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ResumeCompare from "@/components/business/ResumeCompare";
import type { ResumeOptimizationResult } from "@/types";
import "../shared-page.css";
import "./resume.css";

export default function ResumePage() {
  const router = useRouter();
  const { state, dispatch, ensureActiveRun } = useJobFlow();
  const { activeModel } = useAI();
  const [result, setResult] = useState<ResumeOptimizationResult | null>(state.resumeOptimization);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runOptimize = useCallback(async () => {
    if (!state.experienceTranslations) {
      setError("请先完成经历转译");
      return;
    }

    if (!activeModel) {
      setError("请先在模型管理中选择可用 AI 模型");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const runId = await ensureActiveRun(state.jobAnalysis?.jobTitle ?? null, state.jobDescription);
      const result = await aiApi.run<ResumeOptimizationResult>(
        "optimize-resume",
        {
          rawExperiences: state.studentProfile?.rawExperiences,
          experienceTranslations: state.experienceTranslations,
          jobAnalysis: state.jobAnalysis,
          matchReport: state.matchReport,
        },
        runId,
        activeModel.id
      );

      setResult(result);
      dispatch({ type: "SET_RESUME_OPTIMIZATION", payload: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.studentProfile, state.experienceTranslations, state.jobAnalysis, state.matchReport, state.jobDescription, activeModel, dispatch, ensureActiveRun]);

  useEffect(() => {
    if (!result && state.experienceTranslations && activeModel) {
      runOptimize();
    }
  }, [result, state.experienceTranslations, activeModel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">可信简历优化器</h1>
          <p className="biz-page__subtitle">AI 正在优化你的简历表达...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="biz-page__skeleton-card">
            <Skeleton variant="text" count={2} />
            <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)" }}>
              <Skeleton variant="rect" width="80px" height="24px" />
              <Skeleton variant="rect" width="80px" height="24px" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">可信简历优化器</h1>
          <p className="biz-page__subtitle">AI 基于真实经历优化简历表达</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-danger-500)", marginBottom: "var(--space-4)" }}>{error}</p>
            <Button onClick={runOptimize}>重试</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">可信简历优化器</h1>
          <p className="biz-page__subtitle">AI 基于真实经历优化简历表达</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
              {state.experienceTranslations ? "点击下方按钮开始简历优化" : "请先完成经历转译"}
            </p>
            {state.experienceTranslations && (
              <Button onClick={runOptimize} disabled={!activeModel}>
                开始简历优化
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">可信简历优化器</h1>
        <p className="biz-page__subtitle">
          基于真实经历，帮你把简历表达提升到企业认可水平
        </p>
      </div>

      {/* 摘要高亮 */}
      <Card className="biz-page__section biz-page__hero-panel">
        <div className="biz-page__hero-glow" />
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary-600)", fontWeight: 600 }}>简历优化</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {(result.resumeOptimization ?? []).length} 条经历
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--color-border-light)" }} />
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-accent-600)", fontWeight: 600 }}>能力标签</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {[...new Set((result.resumeOptimization ?? []).flatMap(r => r.targetAbility ?? []))].length} 项能力
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--color-border-light)" }} />
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-warning-600)", fontWeight: 600 }}>验证问题</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {(result.resumeOptimization ?? []).reduce((sum, r) => sum + (r.verificationQuestions ?? []).length, 0)} 道题
            </div>
          </div>
        </div>
      </Card>

      {/* 优化对比卡片列表 */}
      <ResumeCompare items={result.resumeOptimization} />

      {/* 整体建议 */}
      {result.resumeSummary && (
        <Card className="resume-page__summary biz-page__section biz-page__spotlight-card">
          <h3 className="biz-page__card-title">简历整体建议</h3>
          <p className="biz-page__advice">{result.resumeSummary}</p>
        </Card>
      )}

      <div className="biz-page__actions">
        <Button size="lg" onClick={() => router.push("/interview")}>
          下一步：面试训练
        </Button>
        <Button variant="secondary" onClick={() => router.push("/resume-builder")}>
          用 AI 结果创建简历
        </Button>
        <Button variant="secondary" onClick={runOptimize}>
          重新生成
        </Button>
      </div>
    </div>
  );
}
