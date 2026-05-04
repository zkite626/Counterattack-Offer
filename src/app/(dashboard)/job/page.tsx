"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";
import type { JobAnalysis } from "@/types";
import { normalizeJobAnalysis } from "@/lib/utils/ai-results";
import "../shared-page.css";

const SAMPLE_JOB_DESCRIPTION = `岗位名称：用户运营实习生
岗位职责：
1. 负责社群用户日常维护，提升用户活跃度；
2. 协助完成用户调研、反馈收集和数据整理；
3. 参与活动策划与内容发布；
4. 支持运营数据统计和复盘。

任职要求：
1. 本科及以上在读，专业不限；
2. 有社团、活动运营、新媒体运营经验优先；
3. 具备良好的沟通表达能力和执行力；
4. 熟悉 Excel、PPT、问卷工具者优先；
5. 对互联网产品和用户增长感兴趣。`;

const importanceColor: Record<string, string> = {
  "高": "var(--color-danger-500)",
  "中高": "var(--color-warning-500)",
  "中": "var(--color-primary-500)",
  "低": "var(--color-gray-400)",
};

const importanceValue: Record<string, number> = {
  "高": 95,
  "中高": 75,
  "中": 50,
  "低": 25,
};

export default function JobPage() {
  const router = useRouter();
  const { state, dispatch } = useJobFlow();
  const { activeModel } = useAI();
  const [jdText, setJdText] = useState(state.jobDescription || "");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(
    normalizeJobAnalysis(state.jobAnalysis)
  );
  const [loading, setLoading] = useState(false);
  const [generatingJd, setGeneratingJd] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerateJd(jobTitle: string) {
    if (!jobTitle.trim()) return;
    if (!activeModel?.apiKey) {
      setError("请先在模型管理中配置 AI 模型");
      return;
    }
    setGeneratingJd(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobTitle: jobTitle.trim(), modelConfig: activeModel }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "生成失败");
      setJdText(json.data.jd);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setGeneratingJd(false);
    }
  }

  async function handleAnalyze() {
    if (!jdText.trim()) {
      setError("请粘贴岗位 JD");
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
      dispatch({ type: "SET_JOB_DESCRIPTION", payload: jdText });

      const res = await fetch("/api/ai/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobDescription: jdText, modelConfig }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "解析失败");

      const normalized = normalizeJobAnalysis(json.data);
      if (!normalized) throw new Error("JD 解析结果格式不正确");

      setAnalysis(normalized);
      dispatch({ type: "SET_JOB_ANALYSIS", payload: normalized });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  if (loading || generatingJd) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">JD 解析</h1>
          <p className="biz-page__subtitle">{generatingJd ? "AI 正在生成参考 JD..." : "AI 正在解析岗位要求..."}</p>
        </div>
        <Card className="biz-page__skeleton-card">
          <Skeleton variant="rect" width="200px" height="28px" />
          <div style={{ marginTop: "var(--space-4)" }}>
            <Skeleton variant="text" count={5} />
          </div>
        </Card>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">JD 解析结果</h1>
          <p className="biz-page__subtitle">岗位：{analysis.jobTitle}</p>
        </div>

        {/* Requirements */}
        <div className="biz-page__grid-2">
          <Card className="biz-page__section biz-page__spotlight-card">
            <h3 className="biz-page__card-title">硬性要求</h3>
            <ul className="biz-page__list">
              {(analysis.hardRequirements ?? []).map((r, i) => (
                <li key={i} className="biz-page__list-item">{r}</li>
              ))}
            </ul>
          </Card>
          <Card className="biz-page__section biz-page__accent-card">
            <h3 className="biz-page__card-title">软性要求</h3>
            <ul className="biz-page__list">
              {(analysis.softRequirements ?? []).map((r, i) => (
                <li key={i} className="biz-page__list-item">{r}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Bonus points */}
        {(analysis.bonusPoints ?? []).length > 0 && (
          <Card className="biz-page__section biz-page__tinted-card">
            <h3 className="biz-page__card-title">加分项</h3>
            <div className="biz-page__tag-list">
              {(analysis.bonusPoints ?? []).map((b, i) => (
                <Tag key={i} variant="success">{b}</Tag>
              ))}
            </div>
          </Card>
        )}

        {/* Core abilities */}
        <Card className="biz-page__section biz-page__hero-panel">
          <div className="biz-page__hero-glow" />
          <h3 className="biz-page__card-title">核心能力要求</h3>
          <div className="biz-page__abilities">
            {(analysis.coreAbilities ?? []).map((a, i) => (
              <div key={i} className="biz-page__ability-row">
                <ProgressBar
                  label={a.ability}
                  value={importanceValue[a.importance] || 50}
                  showValue={false}
                  color={importanceColor[a.importance] || "var(--color-primary)"}
                />
                <Tag size="sm">{a.importance}</Tag>
              </div>
            ))}
          </div>
        </Card>

        {/* Hidden expectations */}
        <Card className="biz-page__section biz-page__tinted-card">
          <h3 className="biz-page__card-title">隐性期待</h3>
          <ul className="biz-page__list">
            {(analysis.hiddenExpectations ?? []).map((h, i) => (
              <li key={i} className="biz-page__list-item">{h}</li>
            ))}
          </ul>
        </Card>

        <div className="biz-page__actions">
          <Button size="lg" onClick={() => router.push("/match")}>
            下一步：人岗匹配
          </Button>
          <Button variant="secondary" onClick={() => { setAnalysis(null); setJdText(""); }}>
            重新解析
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">JD 解析</h1>
        <p className="biz-page__subtitle">粘贴岗位 JD，AI 将自动拆解要求和能力模型</p>
      </div>

      {/* AI 生成参考 JD */}
      {state.studentProfile?.targetRoles && state.studentProfile.targetRoles.length > 0 && (
        <Card className="biz-page__section">
          <h3 className="biz-page__card-title">AI 生成参考 JD</h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-3)" }}>
            点击你的目标岗位，AI 将为你生成一份参考 JD
          </p>
          <div className="biz-page__tag-list">
            {state.studentProfile.targetRoles.map((role, i) => (
              <button
                key={i}
                className="biz-page__role-chip"
                onClick={() => handleGenerateJd(role)}
                disabled={generatingJd}
              >
                {role}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card className="biz-page__section biz-page__spotlight-card">
        <textarea
          className="biz-page__textarea"
          placeholder="粘贴岗位 JD，或使用上方 AI 生成..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={12}
        />
        <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)" }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setJdText(SAMPLE_JOB_DESCRIPTION)}
          >
            填充示例 JD
          </Button>
        </div>
      </Card>

      {error && (
        <div className="biz-page__error-msg">{error}</div>
      )}

      <div className="biz-page__actions">
        <Button size="lg" onClick={handleAnalyze}>
          开始解析
        </Button>
        <Button variant="secondary" onClick={() => router.push("/resume")}>
          跳过 JD，直接优化简历
        </Button>
      </div>
    </div>
  );
}
