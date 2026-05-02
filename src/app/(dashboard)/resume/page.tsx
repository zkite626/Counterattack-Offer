"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ResumeCompare from "@/components/business/ResumeCompare";
import type { ResumeOptimizationResult } from "@/types";
import "../shared-page.css";
import "./resume.css";

export default function ResumePage() {
  const router = useRouter();
  const { state, dispatch } = useJobFlow();
  const { activeModel } = useAI();
  const [result, setResult] = useState<ResumeOptimizationResult | null>(state.resumeOptimization);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runOptimize = useCallback(async () => {
    if (!state.experienceTranslations || !state.jobAnalysis) {
      setError("请先完成经历转译和 JD 解析");
      return;
    }

    if (!activeModel?.apiKey) {
      setError("请先在模型管理中配置 AI 模型");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawExperiences: state.studentProfile?.rawExperiences,
          experienceTranslations: state.experienceTranslations,
          jobAnalysis: state.jobAnalysis,
          matchReport: state.matchReport,
          modelConfig: activeModel,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "简历优化失败");

      setResult(json.data);
      dispatch({ type: "SET_RESUME_OPTIMIZATION", payload: json.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.studentProfile, state.experienceTranslations, state.jobAnalysis, state.matchReport, activeModel, dispatch]);

  useEffect(() => {
    if (!result && state.experienceTranslations && state.jobAnalysis) {
      runOptimize();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (error) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">可信简历优化器</h1>
        </div>
        <Card className="biz-page__error-card">
          <p className="biz-page__error-text">{error}</p>
          <div className="biz-page__error-actions">
            <Button onClick={runOptimize}>重新生成</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">可信简历优化器</h1>
        <p className="biz-page__subtitle">
          基于真实经历，帮你把简历表达提升到企业认可水平
        </p>
      </div>

      {/* 优化对比卡片列表 */}
      <ResumeCompare items={result.resumeOptimization} />

      {/* 整体建议 */}
      {result.resumeSummary && (
        <Card variant="gradient" className="resume-page__summary">
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
