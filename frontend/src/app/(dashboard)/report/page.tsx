"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import { aiApi } from "@/lib/api/ai";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ScoreRing from "@/components/ui/ScoreRing";
import ProgressBar from "@/components/ui/ProgressBar";
import Timeline from "@/components/ui/Timeline";
import Icon from "@/components/ui/Icon";
import type { FlowStep } from "@/types";
import {
  normalizeCareerDiagnosis,
  normalizeImprovementPlan,
  normalizeInterviewSimulations,
  normalizeMatchReport,
} from "@/lib/utils/ai-results";
import { useRouter } from "next/navigation";
import "../shared-page.css";
import "./report.css";

function renderMarkdownToText(md: string): ReactNode[] {
  const lines = md.split("\n");
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} style={{ paddingLeft: "1.5em", margin: "0.5em 0", lineHeight: 1.8 }}>
          {listItems.map((item, i) => (
            <li key={i}>{stripInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function stripInline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/^[-*]\s/, "")
      .trim();
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = stripInline(headingMatch[2]);
      const HeadingTag = `h${Math.min(level + 1, 6)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      elements.push(
        <HeadingTag key={`h-${elements.length}`} style={{ fontWeight: 600, margin: "0.8em 0 0.4em" }}>
          {text}
        </HeadingTag>
      );
      continue;
    }
    // List items
    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*]\s/, "").replace(/^\d+\.\s/, "");
      listItems.push(itemText);
      continue;
    }
    // Normal paragraph
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} style={{ margin: "0.4em 0", lineHeight: 1.8 }}>
        {stripInline(trimmed)}
      </p>
    );
  }
  flushList();
  return elements;
}

const ALL_STEPS: FlowStep[] = [
  "profile", "diagnosis", "translation", "job", "match", "resume", "interview", "plan", "report",
];

export default function ReportPage() {
  const router = useRouter();
  const { state, getCompletionPercentage, ensureActiveRun } = useJobFlow();
  const { activeModel } = useAI();
  const [reportMarkdown, setReportMarkdown] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  const completedCount = state.completedSteps.length;
  const completionPct = getCompletionPercentage();
  const careerDiagnosis = normalizeCareerDiagnosis(state.careerDiagnosis);
  const matchReport = normalizeMatchReport(state.matchReport);
  const improvementPlan = normalizeImprovementPlan(state.improvementPlan);
  const interviewSimulation = normalizeInterviewSimulations(state.interviewSimulation);
  const progressColor = completionPct >= 80
    ? "var(--gradient-accent)"
    : completionPct >= 50
      ? "linear-gradient(135deg, var(--color-warning-500), var(--color-primary-500))"
      : "linear-gradient(135deg, var(--color-danger-500), var(--color-warning-500))";

  const generateReport = useCallback(async () => {
    const normalizedDiagnosis = normalizeCareerDiagnosis(state.careerDiagnosis);
    if (!normalizedDiagnosis) {
      setReportError("请先完成至少画像诊断步骤");
      return;
    }

    if (!activeModel) {
      setReportError("请先在模型管理中选择可用 AI 模型");
      return;
    }

    setReportLoading(true);
    setReportError("");

    try {
      const runId = await ensureActiveRun(state.jobAnalysis?.jobTitle ?? null, state.jobDescription);
      const result = await aiApi.run<{ markdown: string; report: string }>(
        "report",
        {
          careerDiagnosis: normalizedDiagnosis,
          experienceTranslations: state.experienceTranslations,
          jobAnalysis: state.jobAnalysis,
          matchReport: normalizeMatchReport(state.matchReport),
          resumeOptimization: state.resumeOptimization,
          interviewSimulation: normalizeInterviewSimulations(state.interviewSimulation),
          improvementPlan: normalizeImprovementPlan(state.improvementPlan),
        },
        runId,
        activeModel.id
      );

      setReportMarkdown(result.markdown);
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setReportLoading(false);
    }
  }, [state, activeModel, ensureActiveRun]);

  // 隐藏能力标签云：从经历转译中提取
  const allAbilityTags = (state.experienceTranslations ?? []).flatMap((t) => t.abilityTags);
  const uniqueTags = [...new Set(allAbilityTags)];

  // 简历优化精简版
  const resumeItems = state.resumeOptimization?.resumeOptimization?.slice(0, 3) ?? [];

  // 面试关键问题
  const interviewQuestions = interviewSimulation.map((s) => s.mainQuestion).slice(0, 5);

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

  // 计划精简版时间轴
  const planItems = improvementPlan
    ? [
        {
          label: "7天冲刺",
          color: "green" as const,
          icon: "run" as const,
          content: (
            <ul className="report-page__mini-list">
              {(improvementPlan.sevenDayPlan ?? []).slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ),
        },
        {
          label: "14天提升",
          color: "blue" as const,
          icon: "trending" as const,
          content: (
            <ul className="report-page__mini-list">
              {(improvementPlan.fourteenDayPlan ?? []).slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ),
        },
        {
          label: "30天突破",
          color: "purple" as const,
          icon: "rocket" as const,
          content: (
            <ul className="report-page__mini-list">
              {(improvementPlan.thirtyDayPlan ?? []).slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ),
        },
      ]
    : [];

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">汇总报告</h1>
        <p className="biz-page__subtitle">整合所有模块数据，生成你的求职突围全景报告</p>
      </div>

      {/* 完成度进度条 */}
      <Card className="report-page__progress-card biz-page__accent-card">
        <div className="report-page__progress-header">
          <span className="report-page__progress-label">流程完成度</span>
          <span className="report-page__progress-count">{completedCount}/{ALL_STEPS.length} 步骤</span>
        </div>
        <ProgressBar value={completionPct} showValue animated color={progressColor} className="report-page__progress-bar" />
      </Card>

      {/* 1. 求职画像摘要 */}
      {careerDiagnosis && (
        <Card className="report-page__section biz-page__tinted-card">
          <h3 className="report-page__section-title"><Icon name="diagnosis" size="1.25em" /> 求职画像摘要</h3>
          <Tag size="md">{careerDiagnosis.studentType}</Tag>
          <p className="report-page__summary">{careerDiagnosis.summary}</p>
        </Card>
      )}

      {/* 2. 适配岗位方向 */}
      {careerDiagnosis?.recommendedRoles && (
        <Card className="report-page__section biz-page__spotlight-card">
          <h3 className="report-page__section-title"><Icon name="briefcase" size="1.25em" /> 适配岗位方向</h3>
          <div className="report-page__roles-grid">
            {(careerDiagnosis.recommendedRoles ?? []).map((role, i) => (
              <div key={i} className="report-page__role-item">
                <span className="report-page__role-name">{role.role}</span>
                <ScoreRing score={role.fitScore} size={48} strokeWidth={3} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. 隐藏能力发现 */}
      {uniqueTags.length > 0 && (
        <Card className="report-page__section biz-page__accent-card">
          <h3 className="report-page__section-title"><Icon name="search" size="1.25em" /> 隐藏能力发现</h3>
          <div className="report-page__tag-cloud">
            {uniqueTags.map((tag, i) => (
              <Tag key={i} variant="success" size="md">{tag}</Tag>
            ))}
          </div>
        </Card>
      )}

      {/* 4. 目标岗位匹配度 */}
      {matchReport && (
        <Card className="report-page__section biz-page__hero-panel">
          <div className="biz-page__hero-glow" />
          <h3 className="report-page__section-title"><Icon name="target" size="1.25em" /> 目标岗位匹配度</h3>
          <div className="report-page__match-overview">
            <ScoreRing score={matchReport.overallMatchScore} size={112} strokeWidth={7} label="匹配分" />
            <div className="report-page__match-summary">
              <div className="report-page__match-level-row">
                <Tag size="md" variant={getTagVariant(matchReport.overallMatchScore)}>
                  {getMatchLevelLabel(matchReport.matchLevel, matchReport.overallMatchScore)}
                </Tag>
                <span style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", color: "var(--color-text-primary)" }}>
                  {state.jobAnalysis?.jobTitle || "目标岗位"}
                </span>
              </div>
              <p>{matchReport.applicationStrategy}</p>
            </div>
          </div>
          <div className="report-page__dimensions">
            {(matchReport.dimensionScores ?? []).map((d, i) => (
              <div key={i} className="report-page__dim-row">
                <ProgressBar label={d.dimension} value={d.score} showValue animated />
                <p className="report-page__dim-reason">{d.reason}</p>
              </div>
            ))}
          </div>
          <div className="report-page__match-detail-grid">
            <div className="report-page__match-detail">
              <h4>优势信号</h4>
              <ul>
                {(matchReport.advantages ?? []).slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="report-page__match-detail">
              <h4>补齐重点</h4>
              <ul>
                {(matchReport.gaps ?? []).slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* 5. 简历优化重点 */}
      {resumeItems.length > 0 && (
        <Card className="report-page__section biz-page__tinted-card">
          <h3 className="report-page__section-title"><Icon name="document" size="1.25em" /> 简历优化重点</h3>
          {resumeItems.map((item, i) => (
            <div key={i} className="report-page__resume-item">
              <div className="report-page__resume-before">{item.before}</div>
              <div className="report-page__resume-after">{item.after}</div>
            </div>
          ))}
        </Card>
      )}

      {/* 6. 面试准备重点 */}
      {interviewQuestions.length > 0 && (
        <Card className="report-page__section biz-page__accent-card">
          <h3 className="report-page__section-title"><Icon name="mic" size="1.25em" /> 面试准备重点</h3>
          <ol className="report-page__question-list">
            {interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
          </ol>
        </Card>
      )}

      {/* 7. 30天行动计划 */}
      {planItems.length > 0 && (
        <Card className="report-page__section biz-page__spotlight-card">
          <h3 className="report-page__section-title"><Icon name="plan" size="1.25em" /> 30天行动计划</h3>
          <Timeline items={planItems} />
        </Card>
      )}

      {/* 8. 生成简历入口 */}
      {state.studentProfile && (
        <Card className="report-page__section biz-page__tinted-card">
          <h3 className="report-page__section-title"><Icon name="resume-builder" size="1.25em" /> 生成简历</h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
            基于 AI 分析结果一键创建简历，支持多模板编辑和 PDF 导出
          </p>
          <Button onClick={() => router.push("/resume-builder")}>
            进入简历创建器
          </Button>
        </Card>
      )}

      {/* 9. AI 综合建议 */}
      <Card className="report-page__section biz-page__hero-panel">
        <div className="biz-page__hero-glow biz-page__hero-glow--center" />
        <h3 className="report-page__section-title"><Icon name="sparkle" size="1.25em" /> AI 综合建议</h3>
        {!reportMarkdown && !reportLoading && !reportError && (
          <div className="report-page__generate-prompt">
            <p>点击下方按钮，AI 将整合所有数据生成综合建议报告</p>
            <Button onClick={generateReport} loading={reportLoading}>
              生成 AI 综合报告
            </Button>
          </div>
        )}
        {reportLoading && (
          <div className="report-page__generating">
            <p>AI 正在生成综合报告...</p>
          </div>
        )}
        {reportError && (
          <div>
            <p className="biz-page__error-text">{reportError}</p>
            <Button onClick={generateReport} size="sm">重试</Button>
          </div>
        )}
        {reportMarkdown && (
          <div className="report-page__markdown">
            <div className="report-page__markdown-content">
              {renderMarkdownToText(reportMarkdown)}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
