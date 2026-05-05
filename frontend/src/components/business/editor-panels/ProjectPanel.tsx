"use client";

import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import type { ResumeProject } from "@/types";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function ProjectPanel() {
  const { activeResume, dispatch } = useResumeBuilder();

  if (!activeResume) return null;
  const { projects } = activeResume;

  function addProject() {
    const item: ResumeProject = {
      id: generateId(),
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      link: "",
      visible: true,
    };
    dispatch({ type: "ADD_PROJECT", payload: item });
  }

  function update(id: string, data: Partial<ResumeProject>) {
    dispatch({ type: "UPDATE_PROJECT", payload: { id, data } });
  }

  return (
    <div className="editor-panel">
      <h3 className="editor-panel__card-title" style={{ marginBottom: "var(--space-3)" }}>
        项目经历
      </h3>
      <div className="editor-panel__list">
        {projects.map((proj) => (
          <div key={proj.id} className="editor-panel__list-item">
            <div className="editor-panel__list-item-header">
              <span className="editor-panel__item-title">
                {proj.name || "新项目"}
              </span>
              <div className="editor-panel__item-actions">
                <button
                  className="editor-panel__delete-btn"
                  onClick={() => dispatch({ type: "DELETE_PROJECT", payload: proj.id })}
                >
                  删除
                </button>
              </div>
            </div>
            <div className="editor-panel__form-grid">
              <div className="editor-panel__field">
                <label className="editor-panel__label">项目名称</label>
                <input
                  className="editor-panel__input"
                  value={proj.name}
                  onChange={(e) => update(proj.id, { name: e.target.value })}
                  placeholder="项目名称"
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">角色</label>
                <input
                  className="editor-panel__input"
                  value={proj.role}
                  onChange={(e) => update(proj.id, { role: e.target.value })}
                  placeholder="你的角色"
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">开始时间</label>
                <input
                  className="editor-panel__input"
                  type="month"
                  value={proj.startDate}
                  onChange={(e) => update(proj.id, { startDate: e.target.value })}
                />
              </div>
              <div className="editor-panel__field">
                <label className="editor-panel__label">结束时间</label>
                <input
                  className="editor-panel__input"
                  type="month"
                  value={proj.endDate}
                  onChange={(e) => update(proj.id, { endDate: e.target.value })}
                />
              </div>
              <div className="editor-panel__field editor-panel__field--full">
                <label className="editor-panel__label">项目链接</label>
                <input
                  className="editor-panel__input"
                  value={proj.link || ""}
                  onChange={(e) => update(proj.id, { link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="editor-panel__field editor-panel__field--full">
                <label className="editor-panel__label">项目描述</label>
                <textarea
                  className="editor-panel__textarea"
                  value={proj.description}
                  onChange={(e) => update(proj.id, { description: e.target.value })}
                  placeholder="描述项目内容、技术栈和成果..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="editor-panel__add-btn" onClick={addProject}>
        + 添加项目
      </button>
    </div>
  );
}
