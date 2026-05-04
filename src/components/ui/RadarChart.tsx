"use client";

import { useId } from "react";
import "./RadarChart.css";

interface RadarDimension {
  label: string;
  value: number;
}

interface RadarChartProps {
  dimensions: RadarDimension[];
  size?: number;
  maxValue?: number;
  className?: string;
}

export default function RadarChart({
  dimensions,
  size = 280,
  maxValue = 100,
  className = "",
}: RadarChartProps) {
  const gradientId = `radar-chart-gradient-${useId().replace(/:/g, "")}`;
  const strokeGradientId = `radar-chart-stroke-${useId().replace(/:/g, "")}`;
  const center = size / 2;
  const radius = size / 2 - 40;
  const count = dimensions.length;
  if (count === 0) return null;
  const angleStep = (2 * Math.PI) / count;

  function getPoint(index: number, value: number) {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];
  const dataPoints = dimensions.map((d, i) => getPoint(i, d.value));
  const pointColors = [
    "var(--color-primary-500)",
    "var(--color-accent-500)",
    "var(--color-warning-500)",
    "var(--color-primary-400)",
    "var(--color-accent-400)",
    "var(--color-danger-500)",
  ];

  return (
    <div className={["radar-chart", className].filter(Boolean).join(" ")}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="45%" r="62%">
            <stop offset="0%" stopColor="var(--color-accent-400)" stopOpacity="0.42" />
            <stop offset="55%" stopColor="var(--color-primary-400)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-primary-600)" stopOpacity="0.10" />
          </radialGradient>
          <linearGradient id={strokeGradientId} x1="8%" y1="10%" x2="92%" y2="90%">
            <stop offset="0%" stopColor="var(--color-accent-500)" />
            <stop offset="52%" stopColor="var(--color-primary-500)" />
            <stop offset="100%" stopColor="var(--color-warning-500)" />
          </linearGradient>
          <filter id={`${gradientId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Grid lines */}
        {gridLevels.map((level) => {
          const points = Array.from({ length: count }, (_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const r = level * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke={level === 1 ? "var(--color-primary-200)" : "var(--color-border)"}
              strokeWidth={1}
              opacity={level === 1 ? 0.9 : 0.55}
              className="radar-chart__grid"
            />
          );
        })}

        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const { x, y } = getPoint(i, maxValue);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--color-primary-200)"
              strokeWidth={1}
              opacity={0.45}
              className="radar-chart__axis"
            />
          );
        })}

        {/* Data area */}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill={`url(#${gradientId})`}
          stroke={`url(#${strokeGradientId})`}
          strokeWidth={3}
          filter={`url(#${gradientId}-glow)`}
          className="radar-chart__area"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={pointColors[i % pointColors.length]}
            stroke="var(--color-surface)"
            strokeWidth={2.5}
            className="radar-chart__point"
          />
        ))}

        {/* Labels */}
        {dimensions.map((d, i) => {
          const { x, y } = getPoint(i, maxValue + 15);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="radar-chart__label"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
