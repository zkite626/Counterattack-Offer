"use client";

import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import Icon from "@/components/ui/Icon";
import type { ResumeSection } from "@/types";
import "./SectionNavigator.css";

export default function SectionNavigator() {
  const { activeResume, state, setActiveSection, dispatch } = useResumeBuilder();

  if (!activeResume) return null;

  const sorted = [...activeResume.sections].sort((a, b) => a.order - b.order);

  function handleMoveUp(section: ResumeSection) {
    const idx = sorted.findIndex((s) => s.id === section.id);
    if (idx <= 0) return;
    const newSections = sorted.map((s, i) => {
      if (i === idx - 1) return { ...s, order: idx };
      if (i === idx) return { ...s, order: idx - 1 };
      return s;
    });
    dispatch({ type: "REORDER_SECTIONS", payload: newSections });
  }

  function handleMoveDown(section: ResumeSection) {
    const idx = sorted.findIndex((s) => s.id === section.id);
    if (idx >= sorted.length - 1) return;
    const newSections = sorted.map((s, i) => {
      if (i === idx) return { ...s, order: idx + 1 };
      if (i === idx + 1) return { ...s, order: idx };
      return s;
    });
    dispatch({ type: "REORDER_SECTIONS", payload: newSections });
  }

  function handleToggle(sectionId: string) {
    dispatch({ type: "TOGGLE_SECTION", payload: sectionId });
  }

  return (
    <nav className="section-nav">
      <div className="section-nav__title">模块导航</div>
      <ul className="section-nav__list">
        {sorted.map((section, idx) => (
          <li
            key={section.id}
            className={`section-nav__item ${
              state.activeSection === section.id ? "section-nav__item--active" : ""
            } ${!section.enabled ? "section-nav__item--disabled" : ""}`}
          >
            <button
              className="section-nav__label"
              onClick={() => setActiveSection(section.id)}
            >
              <Icon name={section.icon as any} size="1.125em" className="section-nav__icon" />
              <span className="section-nav__text">{section.title}</span>
            </button>
            <div className="section-nav__actions">
              <button
                className="section-nav__btn"
                onClick={() => handleMoveUp(section)}
                disabled={idx === 0}
                title="上移"
              >
                ↑
              </button>
              <button
                className="section-nav__btn"
                onClick={() => handleMoveDown(section)}
                disabled={idx === sorted.length - 1}
                title="下移"
              >
                ↓
              </button>
              <button
                className={`section-nav__btn section-nav__toggle ${
                  section.enabled ? "section-nav__toggle--on" : ""
                }`}
                onClick={() => handleToggle(section.id)}
                title={section.enabled ? "隐藏" : "显示"}
              >
                {section.enabled ? "●" : "○"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
