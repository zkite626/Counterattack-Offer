"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import { aiApi } from "@/lib/api/ai";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ScoreRing from "@/components/ui/ScoreRing";
import RadarChart from "@/components/ui/RadarChart";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";
import Icon from "@/components/ui/Icon";
import type { MatchReport } from "@/types";
import { normalizeMatchReport } from "@/lib/utils/ai-results";
import "../shared-page.css";
import "../match.css";

export default function MatchPage() {
  const router = useRouter();
  const { state, dispatch, ensureActiveRun } = useJobFlow();
  const { activeModel } = useAI();
  const [report, setReport] = useState<MatchReport | null>(
    normalizeMatchReport(state.matchReport)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runMatch = useCallback(async () => {
    if (!state.careerDiagnosis) {
      setError("请先完成画像诊断");
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
      const result = await aiApi.run<unknown>(
        "match",
        {
          careerDiagnosis: state.careerDiagnosis,
          experienceTranslations: state.experienceTranslations,
          jobAnalysis: state.jobAnalysis,
        },
        runId,
        activeModel.id
      );
      const normalized = normalizeMatchReport(result);
      if (!normalized) throw new Error("人岗匹配结果格式不正确");

      setReport(normalized);
      dispatch({ type: "SET_MATCH_REPORT", payload: normalized });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.careerDiagnosis, state.experienceTranslations, state.jobAnalysis, state.jobDescription, activeModel, dispatch, ensureActiveRun]);

  function getScoreLevel(score: number): string {
    if (score >= 90) return "高度匹配";
    if (score >= 75) return "较匹配";
    if (score >= 60) return "部分匹配";
    return "不建议投递";
  }

  function getMatchLevelLabel(level: string, score: number): string {
    const normalized = level.trim().toLowerCase();
    const levelMap: Record<string, string> = {
      high: "高度匹配",
      medium: "较匹配",
      low: "谨慎投递",
      高: "高度匹配",
      中: "较匹配",
      低: "谨慎投递",
    };
    return levelMap[normalized] || level || getScoreLevel(score);
  }

  function getTagVariant(score: number): "success" | "default" | "warning" | "danger" {
    if (score >= 90) return "success";
    if (score >= 75) return "default";
    if (score >= 60) return "warning";
    return "danger";
  }

  function getScoreHint(score: number): string {
    if (score >= 90) return "可以作为主投岗位，重点补强面试故事和细节证据。";
    if (score >= 75) return "值得投递，建议先补齐 1-2 个关键短板再冲刺。";
    if (score >= 60) return "可作为探索岗位，投递前需要明显强化简历证据。";
    return "当前风险偏高，建议先选择更稳妥的岗位方向。";
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

  if (error && !report) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">人岗匹配</h1>
          <p className="biz-page__subtitle">多维度匹配分析</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-danger-500)", marginBottom: "var(--space-4)" }}>{error}</p>
            <Button onClick={runMatch}>重试</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">人岗匹配</h1>
          <p className="biz-page__subtitle">多维度匹配分析</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
              {state.careerDiagnosis ? "点击下方按钮开始匹配分析，或跳过此步骤" : "请先完成画像诊断"}
            </p>
            {state.careerDiagnosis && (
              <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center" }}>
                <Button onClick={runMatch} disabled={!activeModel}>
                  开始匹配分析
                </Button>
                <Button variant="secondary" onClick={() => router.push("/resume")}>
                  跳过匹配
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const radarData = (report.dimensionScores ?? []).map((d) => ({
    label: d.dimension,
    value: d.score,
  }));
  const dimensionColors = [
    "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-400))",
    "linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))",
    "linear-gradient(135deg, var(--color-warning-500), var(--color-primary-500))",
    "linear-gradient(135deg, var(--color-primary-400), var(--color-accent-500))",
    "linear-gradient(135deg, var(--color-accent-400), var(--color-primary-500))",
    "linear-gradient(135deg, var(--color-danger-500), var(--color-warning-500))",
  ];
  const matchLevelLabel = getMatchLevelLabel(report.matchLevel, report.overallMatchScore);

  return (
    <div className="biz-page match-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">人岗匹配</h1>
        <p className="biz-page__subtitle">基于画像、经历和岗位的多维度匹配分析</p>
      </div>

      {/* Score overview */}
      <Card className="match-page__score-panel" padding="none">
        <div className="match-page__score-glow" />
        <div className="match-page__score-ring">
          <ScoreRing
            score={report.overallMatchScore}
            size={176}
            strokeWidth={12}
            label="匹配分"
            className="match-page__score-ring-inner"
          />
        </div>
        <div className="match-page__score-content">
          <div className="match-page__eyebrow">
            <Icon name="radar" size="1rem" />
            综合匹配结论
          </div>
          <div className="match-page__level-row">
            <Tag size="md" variant={getTagVariant(report.overallMatchScore)} className="match-page__level-tag">
              {matchLevelLabel}
            </Tag>
            <span className="match-page__score-desc">{state.jobAnalysis?.jobTitle || "目标岗位"}</span>
          </div>
          <p className="match-page__score-hint">{getScoreHint(report.overallMatchScore)}</p>
          <div className="match-page__quick-stats">
            <div>
              <span>优势项</span>
              <strong>{(report.advantages ?? []).length}</strong>
            </div>
            <div>
              <span>待补齐</span>
              <strong>{(report.gaps ?? []).length}</strong>
            </div>
            <div>
              <span>维度</span>
              <strong>{(report.dimensionScores ?? []).length}</strong>
            </div>
          </div>
        </div>
      </Card>

      {/* Radar chart */}
      <Card className="match-page__radar-card">
        <div className="match-page__section-head">
          <div>
            <h3 className="biz-page__card-title">六维能力雷达</h3>
            <p className="match-page__section-desc">颜色越饱满，说明该维度对目标岗位越有支撑。</p>
          </div>
          <span className="match-page__radar-badge">
            <Icon name="sparkle" size="0.95rem" />
            彩色评分
          </span>
        </div>
        <div className="match-page__radar-wrapper">
          <RadarChart dimensions={radarData} size={320} />
        </div>
        <div className="match-page__dimension-bars">
          {(report.dimensionScores ?? []).map((d, i) => (
            <div key={i} className="match-page__dimension-row">
              <ProgressBar
                label={d.dimension}
                value={d.score}
                showValue
                animated
                color={dimensionColors[i % dimensionColors.length]}
              />
              <p className="match-page__dimension-reason">{d.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Advantages & Gaps */}
      <div className="biz-page__grid-2">
        <Card className="biz-page__section biz-page__spotlight-card">
          <h3 className="biz-page__card-title biz-page__card-title--green">优势匹配</h3>
          <ul className="biz-page__list">
            {(report.advantages ?? []).map((a, i) => (
              <li key={i} className="biz-page__list-item biz-page__list-item--green">{a}</li>
            ))}
          </ul>
        </Card>
        <Card className="biz-page__section biz-page__accent-card">
          <h3 className="biz-page__card-title biz-page__card-title--orange">短板差距</h3>
          <ul className="biz-page__list">
            {(report.gaps ?? []).map((g, i) => (
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
