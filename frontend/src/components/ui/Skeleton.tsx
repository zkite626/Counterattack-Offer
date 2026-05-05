"use client";

import "./Skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: "text" | "rect" | "circle";
  count?: number;
  className?: string;
}

export default function Skeleton({
  width,
  height,
  variant = "text",
  count = 1,
  className = "",
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={["skeleton", `skeleton--${variant}`, className].filter(Boolean).join(" ")}
      style={{ width, height: height || (variant === "text" ? "1em" : height) }}
    />
  ));

  return <>{items}</>;
}
