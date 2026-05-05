"use client";

import { useEffect, useMemo, useState } from "react";
import { useAI } from "@/contexts/AIContext";
import { useJobFlow } from "@/contexts/JobFlowContext";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Icon from "@/components/ui/Icon";
import CareerQaChat from "@/components/business/CareerQaChat";
import {
  buildCareerQaContextBlocks,
  buildCareerQaContextSummary,
} from "@/lib/utils/career-qa";
import "../shared-page.css";
import "./qa.css";

export default function CareerQaPage() {
  const { state } = useJobFlow();
  const { activeModel } = useAI();
  const [expandedBlockLabel, setExpandedBlockLabel] = useState<string | null>(null);

  const contextBlocks = useMemo(() => buildCareerQaContextBlocks(state), [state]);
  const contextSummary = useMemo(() => buildCareerQaContextSummary(state), [state]);

  useEffect(() => {
    if (!expandedBlockLabel) return;
    const isStillVisible = contextBlocks.some((block) => block.label === expandedBlockLabel);
    if (!isStillVisible) {
      setExpandedBlockLabel(null);
    }
  }, [contextBlocks, expandedBlockLabel]);

  function getPreview(value: string): string {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (normalized.length <= 42) {
      return normalized;
    }

    return `${normalized.slice(0, 42)}…`;
  }

  function handleToggleBlock(label: string): void {
    setExpandedBlockLabel((current) => (current === label ? null : label));
  }

  return (
    <div className="biz-page qa-page">
      <div className="biz-page__header">
        <h1 className="biz-page__title">求职AI问答</h1>
        <p className="biz-page__subtitle">
          可以根据你的个人信息回答，也可以在没有资料时直接聊天提问
        </p>
      </div>

      <div className="qa-page__layout">
        <Card className="qa-page__context-card">
          <div className="qa-page__context-header">
            <h2 className="biz-page__card-title">可用上下文</h2>
            <Tag variant={activeModel ? "success" : "warning"} size="sm">
              {activeModel ? "已连接模型" : "未选择模型"}
            </Tag>
          </div>

          {contextBlocks.length === 0 ? (
            <div className="qa-page__context-empty">
              <Icon name="info" size="1.25em" />
              <p>当前没有接入个人信息，仍然可以直接提问求职问题。</p>
            </div>
          ) : (
            <div className="qa-page__context-list">
              {contextBlocks.map((block) => (
                <div
                  key={block.label}
                  className={`qa-page__context-item ${
                    expandedBlockLabel === block.label ? "qa-page__context-item--active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="qa-page__context-trigger"
                    onClick={() => handleToggleBlock(block.label)}
                    aria-expanded={expandedBlockLabel === block.label}
                  >
                    <span className="qa-page__context-label">{block.label}</span>
                    <Icon
                      name="chevron-down"
                      size="1em"
                      className="qa-page__context-chevron"
                    />
                  </button>
                  {expandedBlockLabel === block.label ? (
                    <div className="qa-page__context-value">{block.value}</div>
                  ) : (
                    <div className="qa-page__context-preview">
                      {getPreview(block.value)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="qa-page__hint">
            <Icon name="lightbulb" size="1em" />
            <span>建议直接问具体问题，AI 会结合你已有的信息给出更贴合的回答。</span>
          </div>
        </Card>

        <div className="qa-page__chat-area">
          <CareerQaChat contextSummary={contextSummary} />
        </div>
      </div>
    </div>
  );
}
