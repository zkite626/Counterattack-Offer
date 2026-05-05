/**
 * Icon — 统一图标组件
 * 基于 iconfont SVG 符号，通过 <use> 引用 IconSprite 中的定义
 * 替代项目中所有 emoji 图标
 */

/** 所有可用图标名称 */
export type IconName =
  /* 导航 */
  | "user" | "diagnosis" | "translate" | "job" | "match"
  | "resume" | "resume-builder" | "interview" | "plan" | "report"
  | "settings"
  /* 功能 */
  | "brain" | "swap" | "radar" | "sparkle" | "rocket"
  /* 状态 */
  | "check-circle" | "check" | "warning" | "error" | "info"
  | "search" | "target"
  /* 操作 */
  | "plus" | "close" | "arrow-right" | "arrow-left" | "arrow-down"
  | "chevron-down"
  /* 通用 */
  | "lightning" | "chart" | "trending" | "menu" | "shield" | "repeat"
  | "document" | "pen" | "flag" | "compass" | "lightbulb"
  | "user-group" | "star" | "eye" | "download" | "copy" | "delete"
  | "refresh" | "globe" | "key"
  /* 新增图标 */
  | "fire" | "mail" | "chat" | "gift" | "check-badge"
  | "mic" | "clipboard" | "briefcase" | "slider" | "bar-chart"
  | "list-doc" | "logout"
  /* 主题 */
  | "sun" | "moon" | "monitor"
  /* 警告 */
  | "triangle-warning"
  /* 品牌 */
  | "logo"
  /* 分类标签 */
  | "run" | "grow" | "breakthrough";

interface IconProps {
  /** 图标名称，对应 SVG sprite 中的 symbol id */
  name: IconName;
  /** 图标尺寸，支持 CSS 尺寸值，默认 "1em" */
  size?: string | number;
  /** 自定义类名 */
  className?: string;
  /** 图标颜色，默认 currentColor 继承父元素 */
  color?: string;
  /** 可访问性标签 */
  ariaLabel?: string;
}

export default function Icon({
  name,
  size = "1em",
  className = "",
  color,
  ariaLabel,
}: IconProps) {
  const sizeStyle = typeof size === "number" ? `${size}px` : size;

  return (
    <svg
      className={`icon ${className}`}
      width={sizeStyle}
      height={sizeStyle}
      fill={color}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : "presentation"}
    >
      <use href={`#icon-${name}`} />
    </svg>
  );
}
