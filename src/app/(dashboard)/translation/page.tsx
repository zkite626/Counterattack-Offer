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
    if (!translations && state.studentProfile) {
      runTranslation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (error) {
    return (
      <div className="biz-page">
        <div className="biz-page__header">
          <h1 className="biz-page__title">经历转译</h1>
        </div>
        <Card className="biz-page__error-card">
          <p className="biz-page__error-text">{error}</p>
          <div className="biz-page__error-actions">
            <Button onClick={runTranslation}>重新生成</Button>
            <Button variant="secondary" onClick={() => router.push("/profile")}>
              返回修改
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!translations) return null;

  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">经历转译</h1>
        <p className="biz-page__subtitle">
          将你的原始经历转化为企业认可的能力表达
        </p>
      </div>

      <div className="biz-page__cards-list">
        {translations.map((t, i) => (
          <div key={i} className="biz-page__translation-card" style={{ animationDelay: `${i * 100}ms` }}>
          <Card>
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

            {/* Authenticity note */}
            <div className="biz-page__auth-note">
              <span className="biz-page__auth-icon">⚠️</span>
              {t.authenticityNote}
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
