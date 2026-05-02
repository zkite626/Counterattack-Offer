"use client";

import { useResumeBuilder } from "@/hooks/useResumeBuilder";

export default function SelfEvaluationPanel() {
  const { activeResume, dispatch } = useResumeBuilder();

  if (!activeResume) return null;

  return (
    <div className="editor-panel">
      <div className="editor-panel__card">
        <h3 className="editor-panel__card-title">自我评价</h3>
        <div className="editor-panel__field editor-panel__field--full">
          <textarea
            className="editor-panel__textarea"
            style={{ minHeight: "200px" }}
            value={activeResume.selfEvaluation}
            onChange={(e) => dispatch({ type: "UPDATE_SELF_EVALUATION", payload: e.target.value })}
            placeholder="用 2-3 句话描述你的核心优势、职业目标和工作态度..."
          />
        </div>
      </div>
    </div>
  );
}
