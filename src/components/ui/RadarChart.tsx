"use client";

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
  const center = size / 2;
  const radius = size / 2 - 40;
  const count = dimensions.length;
  const angleStep = (2 * Math.PI) / count;

  function getPoint(index: number, value: number) {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = dimensions.map((d, i) => getPoint(i, d.value));

  return (
    <div className={["radar-chart", className].filter(Boolean).join(" ")}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
              stroke="var(--color-border)"
              strokeWidth={1}
              opacity={0.5}
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
              stroke="var(--color-border)"
              strokeWidth={1}
              opacity={0.3}
            />
          );
        })}

        {/* Data area */}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="var(--color-primary)"
          fillOpacity={0.15}
          stroke="var(--color-primary)"
          strokeWidth={2}
          className="radar-chart__area"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="var(--color-primary)"
            stroke="var(--color-bg-primary)"
            strokeWidth={2}
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
