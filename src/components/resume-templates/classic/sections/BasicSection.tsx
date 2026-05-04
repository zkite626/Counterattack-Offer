import Image from "next/image";
import type { ResumeBasicInfo, ResumeGlobalSettings } from "@/types";

interface BasicSectionProps {
  data: ResumeBasicInfo;
  settings: ResumeGlobalSettings;
  themeColor: string;
  variant?: "default" | "sidebar";
}

export default function BasicSection({ data, themeColor, variant = "default" }: BasicSectionProps) {
  if (variant === "sidebar") {
    return (
      <div className="resume-section__basic resume-section__basic--sidebar">
        {data.photo && (
          <div className="resume-section__photo-wrap resume-section__photo-wrap--sidebar">
            <Image
              src={data.photo}
              alt=""
              width={80}
              height={100}
              className="resume-section__photo"
              unoptimized
            />
          </div>
        )}
        <h1 className="resume-section__name resume-section__name--sidebar" style={{ color: themeColor }}>
          {data.name || "姓名"}
        </h1>
        {data.title && (
          <p className="resume-section__title resume-section__title--sidebar" style={{ color: themeColor }}>
            {data.title}
          </p>
        )}
        <div className="resume-section__contact resume-section__contact--sidebar">
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

  return (
    <div className="resume-section__basic">
      {data.photo && (
        <div className="resume-section__photo-wrap">
          <Image
            src={data.photo}
            alt=""
            width={80}
            height={100}
            className="resume-section__photo"
            unoptimized
          />
        </div>
      )}
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
