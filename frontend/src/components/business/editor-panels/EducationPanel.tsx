"use client";

import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import type { ResumeEducation } from "@/types";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function EducationPanel() {
  const { activeResume, dispatch } = useResumeBuilder();

  if (!activeResume) return null;
  const { education } = activeResume;

  function addEducation() {
    const item: ResumeEducation = {
      id: generateId(),
      school: "",
      major: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
      visible: true,
    };
    dispatch({ type: "ADD_EDUCATION", payload: item });
  }

  function update(id: string, data: Partial<ResumeEducation>) {
    dispatch({ type: "UPDATE_EDUCATION", payload: { id, data } });
  }

  return (
    <div className="editor-panel">
      <h3 className="editor-panel__card-title" style={{ marginBottom: "var(--space-3)" }}>
        教育经历
      </h3>
      <div className="editor-panel__list">
        {education.map((edu) => (
          <div key={edu.id} className="editor-panel__list-item">
            <div className="editor-panel__list-item-header">
              <span className="editor-panel__item-title">
                {edu.school || "新教育经历"}
              </span>
              <div className="editor-panel__item-actions">
                <button
                  className="editor-panel__delete-btn"
                  onClick={() => dispatch({ type: "DELETE_EDUCATION", payload: edu.id })}
                >
                  删除
                </button>
              </div>
            </div>
            <div className="editor-panel__form-grid">
              <div className="editor-panel__field">
                <label className="editor-panel__label">学校</label>
                <input
                  className="editor-panel__input"
                  value={edu.school}
                  onChange={(e) => update(edu.id, { school: e.target.value })}
                  placeholder="学校名称"
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">专业</label>
                <input
                  className="editor-panel__input"
                  value={edu.major}
                  onChange={(e) => update(edu.id, { major: e.target.value })}
                  placeholder="专业名称"
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">学位</label>
                <input
                  className="editor-panel__input"
                  value={edu.degree}
                  onChange={(e) => update(edu.id, { degree: e.target.value })}
                  placeholder="如：本科"
                />
              </div>
              <div className="editor-panel__field" />
              <div className="editor-panel__field">
                <label className="editor-panel__label">开始时间</label>
                <input
                  className="editor-panel__input"
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => update(edu.id, { startDate: e.target.value })}
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">结束时间</label>
                <input
                  className="editor-panel__input"
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => update(edu.id, { endDate: e.target.value })}
                />
              </div>
              <div className="editor-panel__field editor-panel__field--full">
                <label className="editor-panel__label">描述</label>
                <textarea
                  className="editor-panel__textarea"
                  value={edu.description}
                  onChange={(e) => update(edu.id, { description: e.target.value })}
                  placeholder="GPA、荣誉、课程等..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="editor-panel__add-btn" onClick={addEducation}>
        + 添加教育经历
      </button>
    </div>
  );
}
