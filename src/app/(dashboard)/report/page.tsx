"use client";

import { useState, useEffect, useCallback } from "react";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import { DEMO_REPORT } from "@/data/demo-results";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ScoreRing from "@/components/ui/ScoreRing";
import ProgressBar from "@/components/ui/ProgressBar";
import Timeline from "@/components/ui/Timeline";
import Icon from "@/components/ui/Icon";
import type { FlowStep } from "@/types";
import { useRouter } from "next/navigation";
import "../shared-page.css";
import "./report.css";

const ALL_STEPS: FlowStep[] = [
  "profile", "diagnosis", "translation", "job", "match", "resume", "interview", "plan", "report",
];

export default function ReportPage() {
  const router = useRouter();
  const { state, getCompletionPercentage } = useJobFlow();
  const { activeModel } = useAI();
  const [reportMarkdown, setReportMarkdown] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  const completedCount = state.completedSteps.length;
  const completionPct = getCompletionPercentage();

  // Demo 模式：自动加载预填充报告
  useEffect(() => {
    if (sessionStorage.getItem("isDemoMode") === "true" && !reportMarkdown) {
      setReportMarkdown(DEMO_REPORT);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateReport = useCallback(async () => {
    if (!state.careerDiagnosis) {
      setReportError("请先完成至少画像诊断步骤");
      return;
    }

    if (!activeModel?.apiKey) {
      setReportError("请先在模型管理中配置 AI 模型");
      return;
    }

    setReportLoading(true);
    setReportError("");

    try {
      const res = await fetch("/api/ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          careerDiagnosis: state.careerDiagnosis,
          experienceTranslations: state.experienceTranslations,
          jobAnalysis: state.jobAnalysis,
          matchReport: state.matchReport,
          resumeOptimization: state.resumeOptimization,
          interviewSimulation: state.interviewSimulation,
          improvementPlan: state.improvementPlan,
          modelConfig: activeModel,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "报告生成失败");

      setReportMarkdown(json.data.markdown);
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setReportLoading(false);
    }
  }, [state, activeModel]);

  // 隐藏能力标签云：从经历转译中提取
  const allAbilityTags = (state.experienceTranslations ?? []).flatMap((t) => t.abilityTags);
  const uniqueTags = [...new Set(allAbilityTags)];

  // 简历优化精简版
  const resumeItems = state.resumeOptimization?.resumeOptimization?.slice(0, 3) ?? [];

  // 面试关键问题
  const interviewQuestions = (state.interviewSimulation ?? []).map((s) => s.mainQuestion).slice(0, 5);

  // 计划精简版时间轴
  const planItems = state.improvementPlan
    ? [
        {
          label: "7天冲刺",
          color: "green" as const,
          icon: "run" as const,
          content: (
            <ul className="report-page__mini-list">
              {state.improvementPlan.sevenDayPlan.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ),
        },
        {
          label: "14天提升",
          color: "blue" as const,
          icon: "trending" as const,
          content: (
            <ul className="report-page__mini-list">
              {state.improvementPlan.fourteenDayPlan.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ),
        },
        {
          label: "30天突破",
          color: "purple" as const,
          icon: "rocket" as const,
          content: (
            <ul className="report-page__mini-list">
              {state.improvementPlan.thirtyDayPlan.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
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
      <Card className="report-page__progress-card">
        <div className="report-page__progress-header">
          <span className="report-page__progress-label">流程完成度</span>
          <span className="report-page__progress-count">{completedCount}/{ALL_STEPS.length} 步骤</span>
        </div>
        <ProgressBar value={completionPct} showValue animated />
      </Card>

      {/* 1. 求职画像摘要 */}
      {state.careerDiagnosis && (
        <Card className="report-page__section">
          <h3 className="report-page__section-title"><Icon name="diagnosis" size="1.25em" /> 求职画像摘要</h3>
          <Tag size="md">{state.careerDiagnosis.studentType}</Tag>
          <p className="report-page__summary">{state.careerDiagnosis.summary}</p>
        </Card>
      )}

      {/* 2. 适配岗位方向 */}
      {state.careerDiagnosis?.recommendedRoles && (
        <Card className="report-page__section">
          <h3 className="report-page__section-title"><Icon name="briefcase" size="1.25em" /> 适配岗位方向</h3>
          <div className="report-page__roles-grid">
            {state.careerDiagnosis.recommendedRoles.map((role, i) => (
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
        <Card className="report-page__section">
          <h3 className="report-page__section-title"><Icon name="search" size="1.25em" /> 隐藏能力发现</h3>
          <div className="report-page__tag-cloud">
            {uniqueTags.map((tag, i) => (
              <Tag key={i} variant="success" size="md">{tag}</Tag>
            ))}
          </div>
        </Card>
      )}

      {/* 4. 目标岗位匹配度 */}
      {state.matchReport && (
        <Card className="report-page__section">
          <h3 className="report-page__section-title"><Icon name="target" size="1.25em" /> 目标岗位匹配度</h3>
          <div className="report-page__match-overview">
            <ScoreRing score={state.matchReport.overallMatchScore} size={100} strokeWidth={6} label="匹配分" />
          </div>
          <div className="report-page__dimensions">
            {state.matchReport.dimensionScores.map((d, i) => (
              <div key={i} className="report-page__dim-row">
                <ProgressBar label={d.dimension} value={d.score} showValue animated />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 5. 简历优化重点 */}
      {resumeItems.length > 0 && (
        <Card className="report-page__section">
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
        <Card className="report-page__section">
          <h3 className="report-page__section-title"><Icon name="mic" size="1.25em" /> 面试准备重点</h3>
          <ol className="report-page__question-list">
            {interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
          </ol>
        </Card>
      )}

      {/* 7. 30天行动计划 */}
      {planItems.length > 0 && (
        <Card className="report-page__section">
          <h3 className="report-page__section-title"><Icon name="plan" size="1.25em" /> 30天行动计划</h3>
          <Timeline items={planItems} />
        </Card>
      )}

      {/* 8. 生成简历入口 */}
      {state.studentProfile && (
        <Card className="report-page__section">
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
      <Card className="report-page__section">
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
            <pre className="report-page__markdown-content">{reportMarkdown}</pre>
          </div>
        )}
      </Card>
    </div>
  );
}
