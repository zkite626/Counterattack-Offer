import type { ReactNode } from "react";
import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import BasicSection from "../classic/sections/BasicSection";
import EducationSection from "../classic/sections/EducationSection";
import ExperienceSection from "../classic/sections/ExperienceSection";
import ProjectSection from "../classic/sections/ProjectSection";
import SkillSection from "../classic/sections/SkillSection";
import SelfEvaluationSection from "../classic/sections/SelfEvaluationSection";

interface MinimalTemplateProps {
  data: ResumeBuilderData;
  template: ResumeTemplate;
}

function renderSectionTitle(title: string) {
  return (
    <h2 className="resume-section__heading resume-section__heading--minimal">
      {title}
    </h2>
  );
}

export default function MinimalTemplate({ data, template }: MinimalTemplateProps) {
  const themeColor = data.globalSettings.themeColor || template.colorScheme.primary;
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { basic, education, experience, projects, skills, selfEvaluation } = data;

  return (
    <div
      className="resume-tpl resume-tpl--minimal"
      style={{
        fontFamily: data.globalSettings.fontFamily,
        fontSize: `${data.globalSettings.baseFontSize}px`,
        lineHeight: data.globalSettings.lineHeight,
        padding: `${data.globalSettings.pagePadding}px`,
      }}
    >
      {enabledSections.map((section, idx) => {
        const isFirst = idx === 0;
        let content: ReactNode = null;

        switch (section.id) {
          case "basic":
            content = (
              <div key="basic" data-section-id="basic">
                <BasicSection data={basic} settings={data.globalSettings} themeColor={themeColor} />
              </div>
            );
            break;
          case "education":
            content = (
              <div key="education" data-section-id="education">
                {renderSectionTitle(section.title)}
                <EducationSection items={education} />
              </div>
            );
            break;
          case "experience":
            content = (
              <div key="experience" data-section-id="experience">
                {renderSectionTitle(section.title)}
                <ExperienceSection items={experience} />
              </div>
            );
            break;
          case "projects":
            content = (
              <div key="projects" data-section-id="projects">
                {renderSectionTitle(section.title)}
                <ProjectSection items={projects} />
              </div>
            );
            break;
          case "skills":
            content = (
              <div key="skills" data-section-id="skills">
                {renderSectionTitle(section.title)}
                <SkillSection content={skills} />
              </div>
            );
            break;
          case "selfEvaluation":
            content = (
              <div key="selfEvaluation" data-section-id="selfEvaluation">
                {renderSectionTitle(section.title)}
                <SelfEvaluationSection content={selfEvaluation} />
              </div>
            );
            break;
          default:
            return null;
        }

        if (!content) return null;

        return (
          <div key={section.id}>
            {!isFirst && (
              <hr
                style={{
                  border: "none",
                  borderTop: `1px solid ${themeColor}22`,
                  margin: `${data.globalSettings.sectionSpacing}px 0`,
                }}
              />
            )}
            {content}
          </div>
        );
      })}
    </div>
  );
}
