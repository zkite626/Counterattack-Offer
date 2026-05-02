interface SkillSectionProps {
  content: string;
}

export default function SkillSection({ content }: SkillSectionProps) {
  if (!content?.trim()) return null;

  return (
    <div className="resume-section__skills">
      <p className="resume-section__skills-text">{content}</p>
    </div>
  );
}
