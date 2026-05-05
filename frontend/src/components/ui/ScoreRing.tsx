"use client";

import { useEffect, useId, useState, useRef } from "react";
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
  const gradientId = `score-ring-gradient-${useId().replace(/:/g, "")}`;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((started ? displayScore : 0) / 100) * circumference;
  const center = size / 2;

  const color = `url(#${gradientId})`;
  let gradientStart = "var(--color-primary-500)";
  let gradientEnd = "var(--color-primary-400)";
  if (score >= 90) {
    gradientStart = "var(--color-accent-500)";
    gradientEnd = "var(--color-primary-500)";
  } else if (score >= 60 && score < 75) {
    gradientStart = "var(--color-warning-500)";
    gradientEnd = "var(--color-primary-500)";
  } else if (score < 60) {
    gradientStart = "var(--color-danger-500)";
    gradientEnd = "var(--color-warning-500)";
  }

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
        <defs>
          <linearGradient id={gradientId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
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
