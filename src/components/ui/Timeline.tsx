"use client";

import { type ReactNode } from "react";
import "./Timeline.css";

export interface TimelineItem {
  label: string;
  content: ReactNode;
  color?: "green" | "blue" | "purple" | "default";
  icon?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export default function Timeline({
  items,
  orientation = "vertical",
  className = "",
}: TimelineProps) {
  const classes = [
    "timeline",
    `timeline--${orientation}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`timeline__item timeline__item--${item.color ?? "default"}`}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="timeline__marker">
            <span className="timeline__marker-dot">
              {item.icon ?? ""}
            </span>
            {index < items.length - 1 && <div className="timeline__marker-line" />}
          </div>
          <div className="timeline__content">
            <div className="timeline__label">{item.label}</div>
            <div className="timeline__body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
