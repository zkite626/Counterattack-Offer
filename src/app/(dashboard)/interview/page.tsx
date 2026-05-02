"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import Skeleton from "@/components/ui/Skeleton";
import Icon from "@/components/ui/Icon";
import InterviewChat from "@/components/business/InterviewChat";
import type { InterviewSimulation } from "@/types";
import "../shared-page.css";
import "./interview.css";

type InterviewMode = "card" | "chat";

export default function InterviewPage() {
  const router = useRouter();
  const { state, dispatch } = useJobFlow();
  const { activeModel } = useAI();
  const [simulations, setSimulations] = useState<InterviewSimulation[] | null>(state.interviewSimulation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<InterviewMode>("card");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const runInterview = useCallback(async () => {
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
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerDiagnosis: state.careerDiagnosis,
          resumeOptimization: state.resumeOptimization,
          jobAnalysis: state.jobAnalysis,
          modelConfig: activeModel,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "面试训练生成失败");

      setSimulations(json.data);
      dispatch({ type: "SET_INTERVIEW", payload: json.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.careerDiagnosis, state.resumeOptimization, state.jobAnalysis, activeModel, dispatch]);

  useEffect(() => {
    if (!simulations && state.careerDiagnosis && state.jobAnalysis) {
      runInterview();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleCard(index: number) {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  const questionTypeColors: Record<string, "default" | "success" | "warning" | "danger"> = {
    "自我介绍": "default",
    "简历追问": "success",
    "岗位理解": "warning",
    "行为面试": "danger",
    "场景模拟": "default",
  };

  if (loading) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">面试训练</h1>
          <p className="biz-page__subtitle">AI 正在生成面试问题...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="biz-page__skeleton-card">
            <Skeleton variant="text" count={2} />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">面试训练</h1>
        </div>
        <Card className="biz-page__error-card">
          <p className="biz-page__error-text">{error}</p>
          <div className="biz-page__error-actions">
            <Button onClick={runInterview}>重新生成</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">面试训练</h1>
        <p className="biz-page__subtitle">
          {mode === "card" ? "针对目标岗位的面试问题与回答建议" : "与 AI 面试官实时对话练习"}
        </p>
      </div>

      {/* 模式切换 */}
      <div className="interview-page__mode-switch">
        <button
          className={`interview-page__mode-btn ${mode === "card" ? "interview-page__mode-btn--active" : ""}`}
          onClick={() => setMode("card")}
        >
          <Icon name="clipboard" size="1.125em" /> 卡片模式
        </button>
        <button
          className={`interview-page__mode-btn ${mode === "chat" ? "interview-page__mode-btn--active" : ""}`}
          onClick={() => setMode("chat")}
        >
          <Icon name="chat" size="1.125em" /> 对话模式
        </button>
      </div>

      {mode === "card" ? (
        /* 卡片模式 */
        simulations ? (
          <div className="interview-page__cards">
            {simulations.map((sim, index) => {
              const expanded = expandedCards.has(index);
              return (
                <div key={index} style={{ animationDelay: `${index * 80}ms` }} className="interview-page__card-wrapper">
                <Card
                  className="interview-page__card"
                >
                  <div className="interview-page__card-header">
                    <Tag
                      variant={questionTypeColors[sim.questionType] ?? "default"}
                      size="sm"
                    >
                      {sim.questionType}
                    </Tag>
                  </div>

                  <p className="interview-page__main-question">{sim.mainQuestion}</p>

                  {/* 追问列表 */}
                  {sim.followUpQuestions.length > 0 && (
                    <div className="interview-page__followups">
                      <div className="interview-page__section-label">追问</div>
                      <ol className="interview-page__followup-list">
                        {sim.followUpQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* 推荐回答结构 */}
                  <div className="interview-page__structure">
                    <div className="interview-page__section-label">推荐回答结构</div>
                    <p className="interview-page__structure-text">{sim.answerStructure}</p>
                  </div>

                  {/* 示例答案（可展开） */}
                  <div className="interview-page__sample-section">
                    <button
                      className="interview-page__toggle"
                      onClick={() => toggleCard(index)}
                    >
                      {expanded ? "收起" : "查看"}示例答案
                      <span className={`interview-page__arrow ${expanded ? "interview-page__arrow--open" : ""}`}>
                        ▾
                      </span>
                    </button>
                    {expanded && (
                      <div className="interview-page__sample-answer">
                        <p>{sim.sampleAnswer}</p>
                      </div>
                    )}
                  </div>

                  {/* 评分标准 */}
                  {sim.scoreCriteria.length > 0 && (
                    <div className="interview-page__criteria">
                      <div className="interview-page__section-label">评分标准</div>
                      <ul className="interview-page__criteria-list">
                        {sim.scoreCriteria.map((c, i) => (
                          <li key={i}>
                            <span className="interview-page__criteria-check">✓</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
                </div>
              );
            })}
          </div>
        ) : null
      ) : (
        /* 对话模式 */
        <InterviewChat jobTitle={state.jobAnalysis?.jobTitle} />
      )}

      <div className="biz-page__actions">
        <Button size="lg" onClick={() => router.push("/plan")}>
          下一步：能力计划
        </Button>
        {mode === "card" && (
          <Button variant="secondary" onClick={runInterview}>
            重新生成
          </Button>
        )}
      </div>
    </div>
  );
}
