"use client";

import { useRouter } from "next/navigation";
import { useJobFlow } from "@/contexts/JobFlowContext";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import type { FlowStep } from "@/types";
import "./StepNav.css";

interface StepItem {
  key: FlowStep;
  label: string;
  icon: IconName;
}

const STEPS: StepItem[] = [
  { key: "profile", label: "信息", icon: "user" },
  { key: "diagnosis", label: "画像", icon: "search" },
  { key: "translation", label: "转译", icon: "translate" },
  { key: "job", label: "JD", icon: "job" },
  { key: "match", label: "匹配", icon: "match" },
  { key: "resume", label: "简历", icon: "resume" },
  { key: "interview", label: "面试", icon: "interview" },
  { key: "plan", label: "计划", icon: "plan" },
  { key: "report", label: "报告", icon: "report" },
];

const STEP_ROUTES: Record<FlowStep, string> = {
  profile: "/profile",
  diagnosis: "/diagnosis",
  translation: "/translation",
  job: "/job",
  match: "/match",
  resume: "/resume",
  interview: "/interview",
  plan: "/plan",
  report: "/report",
};

export default function StepNav() {
  const router = useRouter();
  const { state, canAccessStep } = useJobFlow();

  function getStepStatus(step: StepItem): "completed" | "current" | "locked" {
    if (state.completedSteps.includes(step.key)) return "completed";
    if (state.currentStep === step.key) return "current";
    return "locked";
  }

  function handleClick(step: StepItem) {
    const status = getStepStatus(step);
    if (status === "completed" || status === "current") {
      router.push(STEP_ROUTES[step.key]);
    }
  }

  return (
    <nav className="step-nav">
      <div className="step-nav__track">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step);
          const accessible = canAccessStep(step.key);

          return (
            <div key={step.key} className="step-nav__item-wrapper">
              {index > 0 && (
                <div
                  className={`step-nav__line ${
                    status === "completed" || state.completedSteps.includes(STEPS[index - 1].key)
                      ? "step-nav__line--active"
                      : ""
                  }`}
                />
              )}
              <button
                className={`step-nav__item step-nav__item--${status}`}
                onClick={() => handleClick(step)}
                disabled={!accessible && status === "locked"}
                title={step.label}
              >
                <span className="step-nav__icon">
                  <Icon name={status === "completed" ? "check-circle" : step.icon} size="1.125em" />
                </span>
                <span className="step-nav__label">{step.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
