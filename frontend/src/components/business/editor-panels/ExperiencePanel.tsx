"use client";

import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import type { ResumeExperience } from "@/types";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function ExperiencePanel() {
  const { activeResume, dispatch } = useResumeBuilder();

  if (!activeResume) return null;
  const { experience } = activeResume;

  function addExperience() {
    const item: ResumeExperience = {
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      visible: true,
    };
    dispatch({ type: "ADD_EXPERIENCE", payload: item });
  }

  function update(id: string, data: Partial<ResumeExperience>) {
    dispatch({ type: "UPDATE_EXPERIENCE", payload: { id, data } });
  }

  return (
    <div className="editor-panel">
      <h3 className="editor-panel__card-title" style={{ marginBottom: "var(--space-3)" }}>
        实习/工作经历
      </h3>
      <div className="editor-panel__list">
        {experience.map((exp) => (
          <div key={exp.id} className="editor-panel__list-item">
            <div className="editor-panel__list-item-header">
              <span className="editor-panel__item-title">
                {exp.company || "新经历"}
              </span>
              <div className="editor-panel__item-actions">
                <button
                  className="editor-panel__delete-btn"
                  onClick={() => dispatch({ type: "DELETE_EXPERIENCE", payload: exp.id })}
                >
                  删除
                </button>
              </div>
            </div>
            <div className="editor-panel__form-grid">
              <div className="editor-panel__field">
                <label className="editor-panel__label">公司</label>
                <input
                  className="editor-panel__input"
                  value={exp.company}
                  onChange={(e) => update(exp.id, { company: e.target.value })}
                  placeholder="公司名称"
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">职位</label>
                <input
                  className="editor-panel__input"
                  value={exp.position}
                  onChange={(e) => update(exp.id, { position: e.target.value })}
                  placeholder="职位名称"
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">开始时间</label>
                <input
                  className="editor-panel__input"
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => update(exp.id, { startDate: e.target.value })}
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">结束时间</label>
                <input
                  className="editor-panel__input"
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => update(exp.id, { endDate: e.target.value })}
                />
              </div>
              <div className="editor-panel__field editor-panel__field--full">
                <label className="editor-panel__label">工作描述</label>
                <textarea
                  className="editor-panel__textarea"
                  value={exp.description}
                  onChange={(e) => update(exp.id, { description: e.target.value })}
                  placeholder="描述你的工作内容和成果..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="editor-panel__add-btn" onClick={addExperience}>
        + 添加经历
      </button>
    </div>
  );
}
