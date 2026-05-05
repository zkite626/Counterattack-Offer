import type { ResumeProject } from "@/types";

interface ProjectSectionProps {
  items: ResumeProject[];
}

export default function ProjectSection({ items }: ProjectSectionProps) {
  const visible = items.filter((p) => p.visible);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((proj) => (
        <div key={proj.id} className="resume-section__item">
          <div className="resume-section__item-header">
            <span className="resume-section__item-title">
              {proj.name || "项目名称"}
              {proj.role ? ` — ${proj.role}` : ""}
            </span>
            <span className="resume-section__item-date">
              {proj.startDate} — {proj.endDate}
            </span>
          </div>
          {proj.link && (
            <a className="resume-section__item-link" href={proj.link}>
              {proj.link}
            </a>
          )}
          {proj.description && <p className="resume-section__item-desc">{proj.description}</p>}
        </div>
      ))}
    </>
  );
}
