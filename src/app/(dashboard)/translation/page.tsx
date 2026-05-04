"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { useAI } from "@/contexts/AIContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import Skeleton from "@/components/ui/Skeleton";
import type { ExperienceTranslation } from "@/types";
import "../shared-page.css";

export default function TranslationPage() {
  const router = useRouter();
  const { state, dispatch } = useJobFlow();
  const { activeModel } = useAI();
  const [translations, setTranslations] = useState<ExperienceTranslation[] | null>(
    state.experienceTranslations
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runTranslation = useCallback(async () => {
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
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rawExperiences: state.studentProfile.rawExperiences,
          targetRoles: state.studentProfile.targetRoles,
          modelConfig,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "转译失败");

      setTranslations(json.data);
      dispatch({ type: "SET_TRANSLATIONS", payload: json.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }, [state.studentProfile, activeModel, dispatch, router]);

  useEffect(() => {
    if (!translations && state.studentProfile && activeModel?.apiKey) {
      runTranslation();
    }
  }, [translations, state.studentProfile, activeModel?.apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">经历转译</h1>
          <p className="biz-page__subtitle">AI 正在挖掘你的隐藏能力...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="biz-page__skeleton-card">
            <Skeleton variant="text" count={2} />
            <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)" }}>
              <Skeleton variant="rect" width="60px" height="24px" />
              <Skeleton variant="rect" width="60px" height="24px" />
              <Skeleton variant="rect" width="60px" height="24px" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error && !translations) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">经历转译</h1>
          <p className="biz-page__subtitle">AI 将帮你挖掘经历中的隐藏能力</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-danger-500)", marginBottom: "var(--space-4)" }}>{error}</p>
            <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center" }}>
              <Button onClick={runTranslation}>重试</Button>
              <Button variant="secondary" onClick={() => { setError(""); router.push("/profile"); }}>返回修改</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!translations) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">经历转译</h1>
          <p className="biz-page__subtitle">AI 将帮你挖掘经历中的隐藏能力</p>
        </div>
        <Card className="biz-page__section">
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
              {state.studentProfile ? "点击下方按钮，AI 将转译你的经历" : "请先填写个人信息"}
            </p>
            {state.studentProfile ? (
              <Button onClick={runTranslation} disabled={!activeModel?.apiKey}>
                开始经历转译
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
        <h1 className="biz-page__title">经历转译</h1>
        <p className="biz-page__subtitle">
          将你的原始经历转化为企业认可的能力表达
        </p>
      </div>

      {/* 摘要高亮 */}
      <Card className="biz-page__section biz-page__hero-panel">
        <div className="biz-page__hero-glow" />
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary-600)", fontWeight: 600 }}>经历转译</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {translations.length} 段经历
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--color-border-light)" }} />
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-accent-600)", fontWeight: 600 }}>能力标签</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {[...new Set(translations.flatMap(t => t.abilityTags))].length} 项能力
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--color-border-light)" }} />
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-warning-600)", fontWeight: 600 }}>面试问题</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {translations.reduce((sum, t) => sum + t.interviewQuestions.length, 0)} 道题
            </div>
          </div>
        </div>
      </Card>

      <div className="biz-page__cards-list">
        {translations.map((t, i) => (
          <div key={i} className="biz-page__translation-card" style={{ animationDelay: `${i * 100}ms` }}>
          <Card className={i % 2 === 0 ? "biz-page__accent-card" : "biz-page__spotlight-card"}>
            <div className="biz-page__translation-grid">
              {/* Raw experience */}
              <div className="biz-page__translation-col">
                <div className="biz-page__col-label">原始经历</div>
                <p className="biz-page__raw-text">{t.rawExperience}</p>
              </div>

              {/* Ability tags */}
              <div className="biz-page__translation-col">
                <div className="biz-page__col-label">能力标签</div>
                <div className="biz-page__tag-list">
                  {t.abilityTags.map((tag, j) => (
                    <Tag key={j} variant="success" size="sm">{tag}</Tag>
                  ))}
                </div>
              </div>

              {/* Resume & Interview */}
              <div className="biz-page__translation-col">
                <div className="biz-page__col-label">简历表达</div>
                <p className="biz-page__resume-text">{t.resumeBullet}</p>
                <div className="biz-page__col-label" style={{ marginTop: "var(--space-3)" }}>
                  面试验证问题
                </div>
                <ul className="biz-page__question-list">
                  {t.interviewQuestions.map((q, j) => (
                    <li key={j}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
          </div>
        ))}
      </div>

      <div className="biz-page__actions">
        <Button size="lg" onClick={() => router.push("/job")}>
          下一步：JD 解析
        </Button>
        <Button variant="secondary" onClick={runTranslation}>
          重新生成
        </Button>
      </div>
    </div>
  );
}
