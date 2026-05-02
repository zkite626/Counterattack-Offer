"use client";

import { useTheme } from "@/contexts/ThemeContext";
import "./ThemeToggle.css";

const themes = [
  { value: "light" as const, icon: "☀️", label: "亮色模式" },
  { value: "dark" as const, icon: "🌙", label: "暗色模式" },
  { value: "system" as const, icon: "🖥️", label: "跟随系统" },
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
          {t.icon}
        </button>
      ))}
    </div>
  );
}
