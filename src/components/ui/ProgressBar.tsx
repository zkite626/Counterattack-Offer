"use client";

import { useEffect, useState, useRef } from "react";
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
  const [visible, setVisible] = useState(!animated);
  const ref = useRef<HTMLDivElement>(null);

  // IntersectionObserver 触发动画
  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div ref={ref} className={["progress-bar", className].filter(Boolean).join(" ")}>
      {label && <div className="progress-bar__label">{label}</div>}
      <div className="progress-bar__track">
        <div
          className={[
            "progress-bar__fill",
            visible && "progress-bar__fill--animated",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: visible ? `${clamped}%` : "0%",
            background: color,
          }}
        />
      </div>
      {showValue && <span className="progress-bar__value">{clamped}%</span>}
    </div>
  );
}
