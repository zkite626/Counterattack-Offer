import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import BasicSection from "../classic/sections/BasicSection";
import EducationSection from "../classic/sections/EducationSection";
import ExperienceSection from "../classic/sections/ExperienceSection";
import ProjectSection from "../classic/sections/ProjectSection";
import SkillSection from "../classic/sections/SkillSection";
import SelfEvaluationSection from "../classic/sections/SelfEvaluationSection";

interface ElegantTemplateProps {
  data: ResumeBuilderData;
  template: ResumeTemplate;
}

function renderSectionTitle(title: string, icon: string, themeColor: string) {
  return (
    <h2
      className="resume-section__heading resume-section__heading--elegant"
      style={{ color: themeColor }}
    >
      <span className="resume-section__heading-icon">{icon}</span>
      {title}
      <span className="resume-section__heading-line" style={{ backgroundColor: themeColor }} />
    </h2>
  );
}

export default function ElegantTemplate({ data, template }: ElegantTemplateProps) {
  const themeColor = data.globalSettings.themeColor || template.colorScheme.primary;
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { basic, education, experience, projects, skills, selfEvaluation } = data;

  return (
    <div
      className="resume-tpl resume-tpl--elegant"
      style={{
        fontFamily: data.globalSettings.fontFamily,
        fontSize: `${data.globalSettings.baseFontSize}px`,
        lineHeight: data.globalSettings.lineHeight,
        padding: `${data.globalSettings.pagePadding}px`,
      }}
    >
      {enabledSections.map((section) => {
        switch (section.id) {
          case "basic":
            return (
              <div key="basic" data-section-id="basic">
                <BasicSection data={basic} settings={data.globalSettings} themeColor={themeColor} />
              </div>
            );
          case "education":
            return (
              <div key="education" data-section-id="education">
                {renderSectionTitle(section.title, section.icon, themeColor)}
                <EducationSection items={education} />
              </div>
            );
          case "experience":
            return (
              <div key="experience" data-section-id="experience">
                {renderSectionTitle(section.title, section.icon, themeColor)}
                <ExperienceSection items={experience} />
              </div>
            );
          case "projects":
            return (
              <div key="projects" data-section-id="projects">
                {renderSectionTitle(section.title, section.icon, themeColor)}
                <ProjectSection items={projects} />
              </div>
            );
          case "skills":
            return (
              <div key="skills" data-section-id="skills">
                {renderSectionTitle(section.title, section.icon, themeColor)}
                <SkillSection content={skills} />
              </div>
            );
          case "selfEvaluation":
            return (
              <div key="selfEvaluation" data-section-id="selfEvaluation">
                {renderSectionTitle(section.title, section.icon, themeColor)}
                <SelfEvaluationSection content={selfEvaluation} />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
