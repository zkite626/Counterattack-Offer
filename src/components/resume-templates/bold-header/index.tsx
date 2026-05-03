import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import EducationSection from "../classic/sections/EducationSection";
import ExperienceSection from "../classic/sections/ExperienceSection";
import ProjectSection from "../classic/sections/ProjectSection";
import SkillSection from "../classic/sections/SkillSection";
import SelfEvaluationSection from "../classic/sections/SelfEvaluationSection";

interface BoldHeaderTemplateProps {
  data: ResumeBuilderData;
  template: ResumeTemplate;
}

function renderSectionTitle(title: string, icon: string, themeColor: string) {
  return (
    <h2
      className="resume-section__heading resume-section__heading--bold"
      style={{ color: themeColor }}
    >
      <span
        className="resume-section__heading-dot"
        style={{ backgroundColor: themeColor }}
      />
      <span className="resume-section__heading-icon">{icon}</span>
      {title}
    </h2>
  );
}

export default function BoldHeaderTemplate({ data, template }: BoldHeaderTemplateProps) {
  const themeColor = data.globalSettings.themeColor || template.colorScheme.primary;
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { basic, education, experience, projects, skills, selfEvaluation } = data;

  // 除了 basic 的其他 section
  const contentSections = enabledSections.filter((s) => s.id !== "basic");

  return (
    <div
      className="resume-tpl resume-tpl--bold-header"
      style={{
        fontFamily: data.globalSettings.fontFamily,
        fontSize: `${data.globalSettings.baseFontSize}px`,
        lineHeight: data.globalSettings.lineHeight,
      }}
    >
      {/* 全宽渐变头部 */}
      <div
        className="resume-tpl__banner"
        style={{
          background: `linear-gradient(135deg, ${themeColor}, ${template.colorScheme.secondary || themeColor}cc)`,
        }}
      >
        <div className="resume-tpl__banner-inner" data-section-id="basic">
          <div className="resume-tpl__banner-content">
            {basic.photo && (
              <div className="resume-tpl__banner-photo">
                <img src={basic.photo} alt="" />
              </div>
            )}
            <div className="resume-tpl__banner-text">
              <h1 className="resume-tpl__banner-name">{basic.name || "姓名"}</h1>
              {basic.title && (
                <p className="resume-tpl__banner-title">{basic.title}</p>
              )}
            </div>
          </div>
          <div className="resume-tpl__banner-contact">
            {basic.phone && <span>{basic.phone}</span>}
            {basic.email && <span>{basic.email}</span>}
            {basic.location && <span>{basic.location}</span>}
            {basic.birthDate && <span>{basic.birthDate}</span>}
            {basic.customFields
              .filter((f) => f.visible && f.value)
              .map((f) => (
                <span key={f.id}>
                  {f.label}：{f.value}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div
        className="resume-tpl__banner-body"
        style={{ padding: `${data.globalSettings.pagePadding}px` }}
      >
        {contentSections.map((section) => {
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
    </div>
  );
}
