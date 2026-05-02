import type { ResumeBasicInfo, ResumeGlobalSettings } from "@/types";

interface BasicSectionProps {
  data: ResumeBasicInfo;
  settings: ResumeGlobalSettings;
  themeColor: string;
}

export default function BasicSection({ data, themeColor }: BasicSectionProps) {
  return (
    <div className="resume-section__basic">
      <h1 className="resume-section__name" style={{ color: themeColor }}>
        {data.name || "姓名"}
      </h1>
      {data.title && (
        <p className="resume-section__title" style={{ color: themeColor }}>
          {data.title}
        </p>
      )}
      <div className="resume-section__contact">
        {data.phone && <span>{data.phone}</span>}
        {data.email && <span>{data.email}</span>}
        {data.location && <span>{data.location}</span>}
        {data.birthDate && <span>{data.birthDate}</span>}
        {data.customFields
          .filter((f) => f.visible && f.value)
          .map((f) => (
            <span key={f.id}>
              {f.label}：{f.value}
            </span>
          ))}
      </div>
    </div>
  );
}
