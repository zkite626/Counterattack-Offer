"use client";

import "./Tag.css";

type TagVariant = "default" | "success" | "warning" | "danger";
type TagSize = "sm" | "md";

interface TagProps {
  variant?: TagVariant;
  size?: TagSize;
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Tag({
  variant = "default",
  size = "sm",
  removable = false,
  onRemove,
  children,
  className = "",
}: TagProps) {
  const classes = [
    "tag",
    `tag--${variant}`,
    `tag--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <span className="tag__text">{children}</span>
      {removable && (
        <button
          type="button"
          className="tag__remove"
          onClick={onRemove}
          aria-label="移除标签"
        >
          ×
        </button>
      )}
    </span>
  );
}
