"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Icon from "@/components/ui/Icon";
import "./ThemeToggle.css";

const themes = [
  { value: "light" as const, icon: "sun" as const, label: "亮色模式" },
  { value: "dark" as const, icon: "moon" as const, label: "暗色模式" },
  { value: "system" as const, icon: "monitor" as const, label: "跟随系统" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="主题切换">
      {themes.map((t) => (
        <button
          key={t.value}
          className={`theme-toggle__btn ${
            theme === t.value ? "theme-toggle__btn--active" : ""
          }`}
          onClick={() => setTheme(t.value)}
          aria-label={t.label}
          aria-pressed={theme === t.value}
          title={t.label}
        >
          <Icon name={t.icon} size="1.125em" />
        </button>
      ))}
    </div>
  );
}
