import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import BasicSection from "./sections/BasicSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectSection from "./sections/ProjectSection";
import SkillSection from "./sections/SkillSection";
import SelfEvaluationSection from "./sections/SelfEvaluationSection";

interface ClassicTemplateProps {
  data: ResumeBuilderData;
  template: ResumeTemplate;
}

function renderSectionTitle(title: string, icon: string, themeColor: string) {
  return (
    <h2 className="resume-section__heading" style={{ borderBottomColor: themeColor }}>
      <span className="resume-section__heading-icon">{icon}</span>
      {title}
    </h2>
  );
}

export default function ClassicTemplate({ data, template }: ClassicTemplateProps) {
  const themeColor = data.globalSettings.themeColor || template.colorScheme.primary;
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { basic, education, experience, projects, skills, selfEvaluation } = data;

  return (
    <div
      className="resume-tpl resume-tpl--classic"
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
