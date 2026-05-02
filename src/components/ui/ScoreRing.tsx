"use client";

import { useEffect, useState } from "react";
import "./ScoreRing.css";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
  className?: string;
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  animated = true,
  className = "",
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
  const center = size / 2;

  let color = "var(--color-primary)";
  if (score >= 90) color = "var(--color-success)";
  else if (score >= 75) color = "var(--color-primary)";
  else if (score >= 60) color = "var(--color-warning)";
  else color = "var(--color-danger)";

  useEffect(() => {
    if (!animated) return;
    const timer = setTimeout(() => setDisplayScore(score), 100);
    return () => clearTimeout(timer);
  }, [score, animated]);

  return (
    <div
      className={["score-ring", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="score-ring__svg">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className="score-ring__progress"
        />
      </svg>
      <div className="score-ring__content">
        <span className="score-ring__score">{displayScore}</span>
        {label && <span className="score-ring__label">{label}</span>}
      </div>
    </div>
  );
}
