import Image from "next/image";
import type { ReactNode } from "react";
import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import EducationSection from "../classic/sections/EducationSection";
import ExperienceSection from "../classic/sections/ExperienceSection";
import ProjectSection from "../classic/sections/ProjectSection";
import SkillSection from "../classic/sections/SkillSection";
import SelfEvaluationSection from "../classic/sections/SelfEvaluationSection";

interface TechTemplateProps {
  data: ResumeBuilderData;
  template: ResumeTemplate;
}

function renderSectionTitle(title: string, icon: string, themeColor: string) {
  return (
    <h2
      className="resume-section__heading resume-section__heading--tech"
      style={{
        color: themeColor,
        borderLeft: `3px solid ${themeColor}`,
        paddingLeft: "10px",
      }}
    >
      <span className="resume-section__heading-icon">{icon}</span>
      {title}
    </h2>
  );
}

export default function TechTemplate({ data, template }: TechTemplateProps) {
  const themeColor = data.globalSettings.themeColor || template.colorScheme.primary;
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { basic, education, experience, projects, skills, selfEvaluation } = data;

  return (
    <div
      className="resume-tpl resume-tpl--tech"
      style={{
        fontFamily: data.globalSettings.fontFamily,
        fontSize: `${data.globalSettings.baseFontSize}px`,
        lineHeight: data.globalSettings.lineHeight,
      }}
    >
      {/* Dark header with basic info */}
      {enabledSections.some((s) => s.id === "basic") && (
        <div
          data-section-id="basic"
          style={{
            background: `linear-gradient(135deg, ${themeColor}, ${themeColor}CC)`,
            color: "#fff",
            padding: `${data.globalSettings.pagePadding}px`,
            borderRadius: "0 0 8px 8px",
            marginBottom: `${data.globalSettings.sectionSpacing}px`,
          }}
        >
          {basic.photo && (
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              <Image
                src={basic.photo}
                alt=""
                width={64}
                height={64}
                unoptimized
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              />
            </div>
          )}
          <h1 style={{ fontSize: "1.5em", fontWeight: 700, textAlign: "center", margin: "0 0 4px" }}>
            {basic.name || "姓名"}
          </h1>
          {basic.title && (
            <p style={{ textAlign: "center", opacity: 0.9, margin: "0 0 10px", fontSize: "0.9em" }}>
              {basic.title}
            </p>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "0.85em",
              opacity: 0.85,
            }}
          >
            {basic.phone && <span>{basic.phone}</span>}
            {basic.email && <span>{basic.email}</span>}
            {basic.location && <span>{basic.location}</span>}
            {basic.birthDate && <span>{basic.birthDate}</span>}
            {basic.customFields
              .filter((f) => f.visible && f.value)
              .map((f) => (
                <span key={f.id}>{f.label}：{f.value}</span>
              ))}
          </div>
        </div>
      )}

      {/* Content sections */}
      <div style={{ padding: `0 ${data.globalSettings.pagePadding}px ${data.globalSettings.pagePadding}px` }}>
        {enabledSections.map((section) => {
          if (section.id === "basic") return null;

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
              style={{ marginBottom: `${data.globalSettings.sectionSpacing}px` }}
            >
              {renderSectionTitle(section.title, section.icon, themeColor)}
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
