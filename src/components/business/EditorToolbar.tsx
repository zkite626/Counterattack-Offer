"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { RESUME_TEMPLATES } from "@/components/resume-templates/registry";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { buildResumeFromAIResults } from "@/lib/utils/resume-builder";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import "./EditorToolbar.css";

// 预设主题色
const THEME_COLORS = [
  "#6366F1", // 紫
  "#3B82F6", // 蓝
  "#10B981", // 绿
  "#F59E0B", // 黄
  "#EF4444", // 红
  "#8B5CF6", // 深紫
  "#0D9488", // 青
  "#EC4899", // 粉
  "#F97316", // 橙
  "#14B8A6", // 翠绿
  "#64748B", // 灰蓝
  "#0EA5E9", // 天蓝
];

// 可选字体
const FONTS = [
  { label: "Inter", value: "Inter, Noto Sans SC, sans-serif" },
  { label: "思源黑体", value: "Noto Sans SC, sans-serif" },
  { label: "思源宋体", value: "Noto Serif SC, serif" },
  { label: "LXGW 文楷", value: "LXGW WenKai, serif" },
];

export default function EditorToolbar() {
  const router = useRouter();
  const { activeResume, dispatch } = useResumeBuilder();
  const { state: jobFlowState } = useJobFlow();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!activeResume) return null;

  function handleTemplateSelect(templateId: string) {
    dispatch({ type: "SET_TEMPLATE", payload: templateId });
    setShowTemplateModal(false);
  }

  function handleColorSelect(color: string) {
    dispatch({ type: "UPDATE_SETTINGS", payload: { themeColor: color } });
    setShowColorPicker(false);
  }

  function handleFontChange(font: string) {
    dispatch({ type: "UPDATE_SETTINGS", payload: { fontFamily: font } });
  }

  function handlePrint() {
    window.print();
  }

  function handleAIPrefill() {
    if (!activeResume) return;
    const { studentProfile, careerDiagnosis, experienceTranslations, resumeOptimization, jobAnalysis } = jobFlowState;
    if (!studentProfile) {
      alert("请先完成个人信息填写");
      return;
    }
    const resumeData = buildResumeFromAIResults(
      studentProfile,
      careerDiagnosis,
      experienceTranslations,
      resumeOptimization,
      jobAnalysis
    );
    // 保留当前简历的 id 和基本信息
    dispatch({
      type: "LOAD_FROM_AI",
      payload: {
        ...resumeData,
        id: activeResume.id,
        title: activeResume.title || "AI 生成简历",
        createdAt: activeResume.createdAt,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar__left">
        <button
          className="editor-toolbar__back-btn"
          onClick={() => router.push("/resume-builder")}
          title="返回列表"
        >
          ←
        </button>
        <input
          className="editor-toolbar__title-input"
          value={activeResume.title}
          onChange={(e) => dispatch({ type: "UPDATE_TITLE", payload: e.target.value })}
          placeholder="简历标题"
        />
      </div>

      <div className="editor-toolbar__actions">
        <button
          className="editor-toolbar__btn"
          onClick={() => setShowTemplateModal(true)}
          title="切换模板"
        >
          模板
        </button>

        <button
          className="editor-toolbar__btn"
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="主题色"
        >
          <span
            className="editor-toolbar__color-dot"
            style={{ background: activeResume.globalSettings.themeColor }}
          />
          色彩
        </button>

        {showColorPicker && (
          <div className="editor-toolbar__dropdown">
            <div className="editor-toolbar__color-grid">
              {THEME_COLORS.map((c) => (
                <button
                  key={c}
                  className={`editor-toolbar__color-btn ${
                    activeResume.globalSettings.themeColor === c
                      ? "editor-toolbar__color-btn--active"
                      : ""
                  }`}
                  style={{ background: c }}
                  onClick={() => handleColorSelect(c)}
                />
              ))}
            </div>
          </div>
        )}

        <select
          className="editor-toolbar__select"
          value={activeResume.globalSettings.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          title="字体"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <label className="editor-toolbar__range-label" title="页边距">
          边距
          <input
            type="range"
            className="editor-toolbar__range"
            min={20}
            max={60}
            value={activeResume.globalSettings.pagePadding}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_SETTINGS",
                payload: { pagePadding: Number(e.target.value) },
              })
            }
          />
        </label>

        <button
          className="editor-toolbar__btn editor-toolbar__btn--accent"
          onClick={handleAIPrefill}
          title="从 AI 分析结果自动填充"
        >
          AI 填充
        </button>

        <button
          className="editor-toolbar__btn editor-toolbar__btn--primary"
          onClick={handlePrint}
          title="打印/导出 PDF"
        >
          导出 PDF
        </button>
      </div>

      {/* 模板选择弹窗 */}
      {showTemplateModal && (
        <Modal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          title="选择模板"
        >
          <div className="editor-toolbar__template-grid">
            {RESUME_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                className={`editor-toolbar__template-card ${
                  activeResume.templateId === tpl.id
                    ? "editor-toolbar__template-card--active"
                    : ""
                }`}
                onClick={() => handleTemplateSelect(tpl.id)}
              >
                <div
                  className="editor-toolbar__template-preview"
                  style={{
                    borderColor:
                      activeResume.templateId === tpl.id
                        ? activeResume.globalSettings.themeColor
                        : undefined,
                  }}
                >
                  <div className="editor-toolbar__template-placeholder">
                    {tpl.name.charAt(0)}
                  </div>
                </div>
                <span className="editor-toolbar__template-name">{tpl.name}</span>
                <span className="editor-toolbar__template-desc">{tpl.description}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
