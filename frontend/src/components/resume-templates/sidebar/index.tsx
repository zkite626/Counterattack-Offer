import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import BasicSection from "../classic/sections/BasicSection";
import EducationSection from "../classic/sections/EducationSection";
import ExperienceSection from "../classic/sections/ExperienceSection";
import ProjectSection from "../classic/sections/ProjectSection";
import SkillSection from "../classic/sections/SkillSection";
import SelfEvaluationSection from "../classic/sections/SelfEvaluationSection";

interface SidebarTemplateProps {
  data: ResumeBuilderData;
  template: ResumeTemplate;
}

function renderSectionTitle(title: string, icon: string, themeColor: string) {
  return (
    <h2
      className="resume-section__heading resume-section__heading--sidebar"
      style={{ borderBottomColor: themeColor }}
    >
      <span className="resume-section__heading-icon">{icon}</span>
      {title}
    </h2>
  );
}

export default function SidebarTemplate({ data, template }: SidebarTemplateProps) {
  const themeColor = data.globalSettings.themeColor || template.colorScheme.primary;
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { basic, education, experience, projects, skills, selfEvaluation } = data;

  // 侧边栏区域: basic, skills
  const sidebarSections = enabledSections.filter((s) => ["basic", "skills"].includes(s.id));
  // 主区域: education, experience, projects, selfEvaluation
  const mainSections = enabledSections.filter(
    (s) => !["basic", "skills"].includes(s.id)
  );

  function renderSidebarSection(section: (typeof enabledSections)[0]) {
    switch (section.id) {
      case "basic":
        return (
          <div key="basic" data-section-id="basic">
            <BasicSection data={basic} settings={data.globalSettings} themeColor={themeColor} variant="sidebar" />
          </div>
        );
      case "skills":
        return (
          <div key="skills" data-section-id="skills">
            {renderSectionTitle(section.title, section.icon, themeColor)}
            <SkillSection content={skills} />
          </div>
        );
      default:
        return null;
    }
  }

  function renderMainSection(section: (typeof enabledSections)[0]) {
    switch (section.id) {
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
  }

  return (
    <div
      className="resume-tpl resume-tpl--sidebar"
      style={{
        fontFamily: data.globalSettings.fontFamily,
        fontSize: `${data.globalSettings.baseFontSize}px`,
        lineHeight: data.globalSettings.lineHeight,
      }}
    >
      <div className="resume-tpl__sidebar-left" style={{ backgroundColor: themeColor }}>
        <div className="resume-tpl__sidebar-left-inner">
          {sidebarSections.map((section) => renderSidebarSection(section))}
        </div>
      </div>
      <div
        className="resume-tpl__sidebar-right"
        style={{ padding: `${data.globalSettings.pagePadding}px` }}
      >
        {mainSections.map((section) => renderMainSection(section))}
      </div>
    </div>
  );
}
