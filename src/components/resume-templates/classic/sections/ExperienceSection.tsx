import type { ResumeExperience } from "@/types";

interface ExperienceSectionProps {
  items: ResumeExperience[];
}

export default function ExperienceSection({ items }: ExperienceSectionProps) {
  const visible = items.filter((e) => e.visible);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((exp) => (
        <div key={exp.id} className="resume-section__item">
          <div className="resume-section__item-header">
            <span className="resume-section__item-title">
              {exp.company || "公司名称"}
              {exp.position ? ` — ${exp.position}` : ""}
            </span>
            <span className="resume-section__item-date">
              {exp.startDate} — {exp.endDate}
            </span>
          </div>
          {exp.description && <p className="resume-section__item-desc">{exp.description}</p>}
        </div>
      ))}
    </>
  );
}
