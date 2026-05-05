"use client";

import { useResumeBuilder } from "@/hooks/useResumeBuilder";

export default function SkillsPanel() {
  const { activeResume, dispatch } = useResumeBuilder();

  if (!activeResume) return null;

  return (
    <div className="editor-panel">
      <div className="editor-panel__card">
        <h3 className="editor-panel__card-title">专业技能</h3>
        <div className="editor-panel__field editor-panel__field--full">
          <textarea
            className="editor-panel__textarea"
            style={{ minHeight: "200px" }}
            value={activeResume.skills}
            onChange={(e) => dispatch({ type: "UPDATE_SKILLS", payload: e.target.value })}
            placeholder={"列出你的专业技能，例如：\n• JavaScript / TypeScript\n• React / Next.js\n• Python\n• SQL / MongoDB"}
          />
        </div>
      </div>
    </div>
  );
}
