import type { ReactNode } from "react";
import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import BasicSection from "../classic/sections/BasicSection";
import EducationSection from "../classic/sections/EducationSection";
import ExperienceSection from "../classic/sections/ExperienceSection";
import ProjectSection from "../classic/sections/ProjectSection";
import SkillSection from "../classic/sections/SkillSection";
import SelfEvaluationSection from "../classic/sections/SelfEvaluationSection";

interface TimelineTemplateProps {
  data: ResumeBuilderData;
  template: ResumeTemplate;
}

export default function TimelineTemplate({ data, template }: TimelineTemplateProps) {
  const themeColor = data.globalSettings.themeColor || template.colorScheme.primary;
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { basic, education, experience, projects, skills, selfEvaluation } = data;

  const contentSections = enabledSections.filter((s) => s.id !== "basic");

  return (
    <div
      className="resume-tpl resume-tpl--timeline"
      style={{
        fontFamily: data.globalSettings.fontFamily,
        fontSize: `${data.globalSettings.baseFontSize}px`,
        lineHeight: data.globalSettings.lineHeight,
        padding: `${data.globalSettings.pagePadding}px`,
      }}
    >
      {/* Basic info at top */}
      {enabledSections.some((s) => s.id === "basic") && (
        <div data-section-id="basic">
          <BasicSection data={basic} settings={data.globalSettings} themeColor={themeColor} />
        </div>
      )}

      {/* Timeline sections */}
      <div className="resume-timeline" style={{ position: "relative", paddingLeft: "24px" }}>
        <div
          className="resume-timeline__line"
          style={{
            position: "absolute",
            left: "6px",
            top: "4px",
            bottom: "4px",
            width: "2px",
            backgroundColor: `${themeColor}30`,
          }}
        />

        {contentSections.map((section) => {
          let content: ReactNode = null;

          switch (section.id) {
            case "education":
              content = <EducationSection items={education} />;
              break;
            case "experience":
              content = <ExperienceSection items={experience} />;
              break;
            case "projects":
              content = <ProjectSection items={projects} />;
              break;
            case "skills":
              content = <SkillSection content={skills} />;
              break;
            case "selfEvaluation":
              content = <SelfEvaluationSection content={selfEvaluation} />;
              break;
            default:
              return null;
          }

          return (
            <div
              key={section.id}
              data-section-id={section.id}
              style={{
                position: "relative",
                marginBottom: `${data.globalSettings.sectionSpacing}px`,
              }}
            >
              {/* Timeline dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-22px",
                  top: "6px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: themeColor,
                  border: "2px solid #fff",
                  boxShadow: `0 0 0 2px ${themeColor}40`,
                }}
              />

              <h2
                className="resume-section__heading resume-section__heading--timeline"
                style={{ color: themeColor }}
              >
                <span className="resume-section__heading-icon">{section.icon}</span>
                {section.title}
              </h2>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
