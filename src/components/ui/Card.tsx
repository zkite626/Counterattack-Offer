"use client";

import { type ReactNode } from "react";
import "./Card.css";

type CardVariant = "default" | "glass" | "gradient";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export default function Card({
  variant = "default",
  padding = "md",
  hoverable = false,
  className = "",
  children,
  onClick,
}: CardProps) {
  const classes = [
    "card",
    `card--${variant}`,
    `card--pad-${padding}`,
    hoverable && "card--hoverable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick} role={onClick ? "button" : undefined}>
      {children}
    </div>
  );
}
