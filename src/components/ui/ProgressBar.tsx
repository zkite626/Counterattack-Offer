"use client";

import "./ProgressBar.css";

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  showValue = false,
  color,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={["progress-bar", className].filter(Boolean).join(" ")}>
      {label && <div className="progress-bar__label">{label}</div>}
      <div className="progress-bar__track">
        <div
          className={[
            "progress-bar__fill",
            animated && "progress-bar__fill--animated",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showValue && <span className="progress-bar__value">{clamped}%</span>}
    </div>
  );
}
