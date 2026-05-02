"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import type { ResumeOptimization } from "@/types";
import "./ResumeCompare.css";

interface ResumeCompareProps {
  items: ResumeOptimization[];
}

export default function ResumeCompare({ items }: ResumeCompareProps) {
  return (
    <div className="resume-compare">
      {items.map((item, index) => (
        <ResumeCompareCard key={index} item={item} index={index} />
      ))}
    </div>
  );
}

function ResumeCompareCard({ item, index }: { item: ResumeOptimization; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const riskVariant =
    item.riskLevel === "高" ? "danger" : item.riskLevel === "中" ? "warning" : "success";

  return (
    <div style={{ animationDelay: `${index * 100}ms` }} className="resume-compare__card-wrapper">
    <Card className="resume-compare__card">
      {/* 来源经历标签 */}
      <div className="resume-compare__source">{item.sourceExperience}</div>

      {/* 优化前后对比 */}
      <div className="resume-compare__diff">
        <div className="resume-compare__col resume-compare__col--before">
          <div className="resume-compare__col-header">优化前</div>
          <p className="resume-compare__text resume-compare__text--deleted">{item.before}</p>
        </div>
        <div className="resume-compare__col resume-compare__col--after">
          <div className="resume-compare__col-header">优化后</div>
          <p className="resume-compare__text resume-compare__text--highlighted">{item.after}</p>
        </div>
      </div>

      {/* 能力标签 */}
      <div className="resume-compare__tags">
        {item.targetAbility.map((tag, i) => (
          <Tag key={i} variant="success" size="sm">{tag}</Tag>
        ))}
      </div>

      {/* 风险等级 */}
      <div className="resume-compare__meta">
        <Tag variant={riskVariant} size="sm">
          风险：{item.riskLevel}
        </Tag>
        {item.note && <span className="resume-compare__note">{item.note}</span>}
      </div>

      {/* 面试验证问题（可展开） */}
      {item.verificationQuestions.length > 0 && (
        <div className="resume-compare__verify">
          <button
            className="resume-compare__toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "收起" : "展开"}面试验证问题
            <span className={`resume-compare__arrow ${expanded ? "resume-compare__arrow--open" : ""}`}>
              ▾
            </span>
          </button>
          {expanded && (
            <ul className="resume-compare__questions">
              {item.verificationQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
    </div>
  );
}
