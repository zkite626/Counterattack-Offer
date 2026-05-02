"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import PlanTimeline from "@/components/business/PlanTimeline";
import type { ImprovementPlan } from "@/types";
import "../shared-page.css";
import "./plan.css";

export default function PlanPage() {
  const router = useRouter();
  const { state, dispatch } = useJobFlow();
  const { activeModel } = useAI();
  const [plan, setPlan] = useState<ImprovementPlan | null>(state.improvementPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runPlan = useCallback(async () => {
    if (!state.careerDiagnosis || !state.jobAnalysis) {
      setError("请先完成画像诊断和 JD 解析");
      return;
    }

    if (!activeModel?.apiKey) {
      setError("请先在模型管理中配置 AI 模型");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerDiagnosis: state.careerDiagnosis,
          jobAnalysis: state.jobAnalysis,
          matchReport: state.matchReport,
          modelConfig: activeModel,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "计划生成失败");

      setPlan(json.data);
      dispatch({ type: "SET_IMPROVEMENT_PLAN", payload: json.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.careerDiagnosis, state.jobAnalysis, state.matchReport, activeModel, dispatch]);

  useEffect(() => {
    if (!plan && state.careerDiagnosis && state.jobAnalysis) {
      runPlan();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">30天求职突围计划</h1>
          <p className="biz-page__subtitle">AI 正在制定个性化行动计划...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="biz-page__skeleton-card">
            <Skeleton variant="text" count={3} />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">30天求职突围计划</h1>
        </div>
        <Card className="biz-page__error-card">
          <p className="biz-page__error-text">{error}</p>
          <div className="biz-page__error-actions">
            <Button onClick={runPlan}>重新生成</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">30天求职突围计划</h1>
        <p className="biz-page__subtitle">针对你的短板，制定可执行的能力提升路线</p>
      </div>

      {/* 目标岗位 + 总目标 */}
      <Card className="plan-page__goal-card">
        <div className="plan-page__goal-header">
          <span className="plan-page__goal-icon">🎯</span>
          <div>
            <h3 className="plan-page__goal-role">{plan.targetRole}</h3>
            <p className="plan-page__goal-desc">{plan.goal}</p>
          </div>
        </div>
      </Card>

      {/* 时间轴 */}
      <PlanTimeline plan={plan} />

      <div className="biz-page__actions">
        <Button size="lg" onClick={() => router.push("/report")}>
          下一步：汇总报告
        </Button>
        <Button variant="secondary" onClick={runPlan}>
          重新生成
        </Button>
      </div>
    </div>
  );
}
