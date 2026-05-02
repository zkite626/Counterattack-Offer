"use client";

import { useEffect, useState, useRef } from "react";
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
  const [started, setStarted] = useState(!animated);
  const containerRef = useRef<HTMLDivElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((started ? displayScore : 0) / 100) * circumference;
  const center = size / 2;

  let color = "var(--color-primary)";
  if (score >= 90) color = "var(--color-success)";
  else if (score >= 75) color = "var(--color-primary)";
  else if (score >= 60) color = "var(--color-warning)";
  else color = "var(--color-danger)";

  // IntersectionObserver 触发计数动画
  useEffect(() => {
    if (!animated) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  // 从 0 递增到目标值
  useEffect(() => {
    if (!animated || !started) return;
    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setDisplayScore(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayScore(score);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated, started]);

  return (
    <div
      ref={containerRef}
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
