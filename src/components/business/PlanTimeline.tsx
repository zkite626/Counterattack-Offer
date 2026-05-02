"use client";

import Timeline from "@/components/ui/Timeline";
import type { ImprovementPlan } from "@/types";
import "./PlanTimeline.css";

interface PlanTimelineProps {
  plan: ImprovementPlan;
}

export default function PlanTimeline({ plan }: PlanTimelineProps) {
  const timelineItems = [
    {
      label: "7天冲刺",
      color: "green" as const,
      icon: "🏃",
      content: (
        <ul className="plan-timeline__task-list">
          {plan.sevenDayPlan.map((task, i) => (
            <li key={i} className="plan-timeline__task">
              {task}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "14天提升",
      color: "blue" as const,
      icon: "📈",
      content: (
        <ul className="plan-timeline__task-list">
          {plan.fourteenDayPlan.map((task, i) => (
            <li key={i} className="plan-timeline__task">
              {task}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "30天突破",
      color: "purple" as const,
      icon: "🚀",
      content: (
        <ul className="plan-timeline__task-list">
          {plan.thirtyDayPlan.map((task, i) => (
            <li key={i} className="plan-timeline__task">
              {task}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="plan-timeline">
      <Timeline items={timelineItems} />

      {/* 推荐产出清单 */}
      {plan.recommendedOutputs.length > 0 && (
        <div className="plan-timeline__outputs">
          <h4 className="plan-timeline__outputs-title">推荐产出清单</h4>
          <ul className="plan-timeline__checklist">
            {plan.recommendedOutputs.map((item, i) => (
              <li key={i} className="plan-timeline__check-item">
                <span className="plan-timeline__check-icon">☐</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
