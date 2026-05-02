interface SelfEvaluationSectionProps {
  content: string;
}

export default function SelfEvaluationSection({ content }: SelfEvaluationSectionProps) {
  if (!content?.trim()) return null;

  return (
    <div className="resume-section__self-eval">
      <p className="resume-section__self-eval-text">{content}</p>
    </div>
  );
}
