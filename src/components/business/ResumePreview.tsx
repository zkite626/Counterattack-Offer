"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { getTemplateComponent, RESUME_TEMPLATES } from "@/components/resume-templates/registry";
import "./ResumePreview.css";

// A4 尺寸：210mm × 297mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export default function ResumePreview() {
  const { activeResume, setActiveSection } = useResumeBuilder();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(0.5);

  // 根据容器宽度自动计算缩放因子
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 32; // 减去 padding
    // A4 宽度 210mm ≈ 793.7px（96dpi）
    const a4WidthPx = A4_WIDTH_MM * 96 / 25.4;
    const scale = Math.min(containerWidth / a4WidthPx, 1);
    setScaleFactor(scale);
  }, []);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [updateScale]);

  if (!activeResume) {
    return (
      <div className="resume-preview" ref={containerRef}>
        <div className="resume-preview__empty">暂无简历数据</div>
      </div>
    );
  }

  const template = RESUME_TEMPLATES.find((t) => t.id === activeResume.templateId) || RESUME_TEMPLATES[0];
  const TemplateComponent = getTemplateComponent(template.layout);

  // 点击 section 区域触发编辑面板切换
  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const sectionEl = target.closest("[data-section-id]");
    if (sectionEl) {
      const sectionId = (sectionEl as HTMLElement).dataset.sectionId;
      if (sectionId) setActiveSection(sectionId);
    }
  }

  return (
    <div className="resume-preview" ref={containerRef}>
      <div className="resume-preview__paper-wrapper">
        <div
          className="resume-preview__paper"
          style={{
            width: `${A4_WIDTH_MM}mm`,
            minHeight: `${A4_HEIGHT_MM}mm`,
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top center",
          }}
          onClick={handleClick}
        >
          <TemplateComponent data={activeResume} template={template} />
        </div>
        {/* 分页线提示 */}
        <div
          className="resume-preview__page-break"
          style={{ top: `${A4_HEIGHT_MM * 96 / 25.4 * scaleFactor + 16}px` }}
        >
          第 1 页结束
        </div>
      </div>
    </div>
  );
}
