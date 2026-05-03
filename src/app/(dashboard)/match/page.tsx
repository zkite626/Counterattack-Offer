"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ScoreRing from "@/components/ui/ScoreRing";
import RadarChart from "@/components/ui/RadarChart";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";
import type { MatchReport } from "@/types";
import "../shared-page.css";

export default function MatchPage() {
  const router = useRouter();
  const { state, dispatch } = useJobFlow();
  const { activeModel } = useAI();
  const [report, setReport] = useState<MatchReport | null>(state.matchReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runMatch = useCallback(async () => {
    if (!state.careerDiagnosis || !state.jobAnalysis) {
      setError("请先完成画像诊断和 JD 解析");
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
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          careerDiagnosis: state.careerDiagnosis,
          experienceTranslations: state.experienceTranslations,
          jobAnalysis: state.jobAnalysis,
          modelConfig,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "匹配分析失败");

      setReport(json.data);
      dispatch({ type: "SET_MATCH_REPORT", payload: json.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.careerDiagnosis, state.experienceTranslations, state.jobAnalysis, activeModel, dispatch]);

  useEffect(() => {
    if (!report && state.careerDiagnosis && state.jobAnalysis) {
      runMatch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getScoreLevel(score: number): string {
    if (score >= 90) return "高度匹配";
    if (score >= 75) return "较匹配";
    if (score >= 60) return "部分匹配";
    return "不建议投递";
  }

  if (loading) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">人岗匹配</h1>
          <p className="biz-page__subtitle">AI 正在进行多维度匹配分析...</p>
        </div>
        <div className="biz-page__loading-center">
          <Skeleton variant="circle" width="140px" height="140px" />
          <div style={{ marginTop: "var(--space-4)" }}>
            <Skeleton variant="text" count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">人岗匹配</h1>
        </div>
        <Card className="biz-page__error-card">
          <p className="biz-page__error-text">{error}</p>
          <div className="biz-page__error-actions">
            <Button onClick={runMatch}>重新生成</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  const radarData = report.dimensionScores.map((d) => ({
    label: d.dimension,
    value: d.score,
  }));

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">人岗匹配</h1>
        <p className="biz-page__subtitle">基于画像、经历和岗位的多维度匹配分析</p>
      </div>

      {/* Score overview */}
      <Card className="biz-page__score-overview">
        <div className="biz-page__score-center">
          <ScoreRing score={report.overallMatchScore} size={160} strokeWidth={10} label="匹配分" />
        </div>
        <div className="biz-page__match-level">
          <Tag size="md">{report.matchLevel}</Tag>
          <span className="biz-page__score-desc">{getScoreLevel(report.overallMatchScore)}</span>
        </div>
      </Card>

      {/* Radar chart */}
      <Card className="biz-page__section">
        <h3 className="biz-page__card-title">维度评分</h3>
        <div className="biz-page__radar-wrapper">
          <RadarChart dimensions={radarData} size={280} />
        </div>
        <div className="biz-page__dimension-bars">
          {report.dimensionScores.map((d, i) => (
            <div key={i} className="biz-page__dimension-row">
              <ProgressBar
                label={d.dimension}
                value={d.score}
                showValue
                animated
              />
              <p className="biz-page__dimension-reason">{d.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Advantages & Gaps */}
      <div className="biz-page__grid-2">
        <Card className="biz-page__section">
          <h3 className="biz-page__card-title biz-page__card-title--green">优势匹配</h3>
          <ul className="biz-page__list">
            {report.advantages.map((a, i) => (
              <li key={i} className="biz-page__list-item biz-page__list-item--green">{a}</li>
            ))}
          </ul>
        </Card>
        <Card className="biz-page__section">
          <h3 className="biz-page__card-title biz-page__card-title--orange">短板差距</h3>
          <ul className="biz-page__list">
            {report.gaps.map((g, i) => (
              <li key={i} className="biz-page__list-item biz-page__list-item--orange">{g}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Strategy */}
      <Card variant="gradient" className="biz-page__section">
        <h3 className="biz-page__card-title">投递策略</h3>
        <p className="biz-page__advice">{report.applicationStrategy}</p>
      </Card>

      {/* Risk warning */}
      {report.riskWarning && (
        <Card className="biz-page__warning-card">
          <h3 className="biz-page__card-title biz-page__card-title--red">避坑提醒</h3>
          <p>{report.riskWarning}</p>
        </Card>
      )}

      <div className="biz-page__actions">
        <Button size="lg" onClick={() => router.push("/resume")}>
          下一步：简历优化
        </Button>
        <Button variant="secondary" onClick={runMatch}>
          重新生成
        </Button>
      </div>
    </div>
  );
}
