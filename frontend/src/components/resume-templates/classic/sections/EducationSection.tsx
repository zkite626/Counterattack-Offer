import type { ResumeEducation } from "@/types";

interface EducationSectionProps {
  items: ResumeEducation[];
}

export default function EducationSection({ items }: EducationSectionProps) {
  const visible = items.filter((e) => e.visible);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((edu) => (
        <div key={edu.id} className="resume-section__item">
          <div className="resume-section__item-header">
            <span className="resume-section__item-title">{edu.school || "学校名称"}</span>
            <span className="resume-section__item-date">
              {edu.startDate} — {edu.endDate}
            </span>
          </div>
          <div className="resume-section__item-sub">
            {edu.major && <span>{edu.major}</span>}
            {edu.degree && <span>· {edu.degree}</span>}
          </div>
          {edu.description && <p className="resume-section__item-desc">{edu.description}</p>}
        </div>
      ))}
    </>
  );
}
