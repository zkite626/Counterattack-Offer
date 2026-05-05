"use client";

import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import BasicInfoPanel from "./editor-panels/BasicInfoPanel";
import EducationPanel from "./editor-panels/EducationPanel";
import ExperiencePanel from "./editor-panels/ExperiencePanel";
import ProjectPanel from "./editor-panels/ProjectPanel";
import SkillsPanel from "./editor-panels/SkillsPanel";
import SelfEvaluationPanel from "./editor-panels/SelfEvaluationPanel";
import "./SectionEditor.css";

export default function SectionEditor() {
  const { state } = useResumeBuilder();

  function renderPanel() {
    switch (state.activeSection) {
      case "basic":
        return <BasicInfoPanel />;
      case "education":
        return <EducationPanel />;
      case "experience":
        return <ExperiencePanel />;
      case "projects":
        return <ProjectPanel />;
      case "skills":
        return <SkillsPanel />;
      case "selfEvaluation":
        return <SelfEvaluationPanel />;
      default:
        return <div className="editor-panel__empty">请选择一个模块开始编辑</div>;
    }
  }

  return <div className="section-editor">{renderPanel()}</div>;
}
