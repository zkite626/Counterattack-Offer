"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { createElement } from "react";
import { RESUME_TEMPLATES, TEMPLATE_REGISTRY } from "@/components/resume-templates/registry";
import type { ResumeBuilderData } from "@/types";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { buildResumeFromAIResults } from "@/lib/utils/resume-builder";
import Modal from "@/components/ui/Modal";
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

// 模板预览用的示例数据
const PREVIEW_SAMPLE: ResumeBuilderData = {
  id: "preview",
  title: "预览",
  createdAt: "",
  updatedAt: "",
  templateId: "classic",
  basic: {
    name: "张三",
    title: "前端开发工程师",
    email: "zhangsan@email.com",
    phone: "138-0000-0000",
    location: "北京",
    customFields: [],
  },
  education: [{ id: "1", school: "北京大学", major: "计算机科学", degree: "本科", startDate: "2020.09", endDate: "2024.06", description: "", visible: true }],
  experience: [{ id: "1", company: "某科技公司", position: "前端实习生", startDate: "2023.06", endDate: "2023.12", description: "负责公司官网重构，使用 React + TypeScript 技术栈，页面加载速度提升 40%。", visible: true }],
  projects: [{ id: "1", name: "在线协作文档", role: "前端负责人", startDate: "2023.03", endDate: "2023.06", description: "基于 WebSocket 实现实时协同编辑，支持多人同时编辑。", visible: true }],
  skills: "React, TypeScript, Node.js, CSS, Git",
  selfEvaluation: "热爱前端开发，具备良好的团队协作能力和学习能力。",
  sections: [
    { id: "basic", title: "基本信息", icon: "👤", enabled: true, order: 0 },
    { id: "education", title: "教育经历", icon: "🎓", enabled: true, order: 1 },
    { id: "experience", title: "工作经历", icon: "💼", enabled: true, order: 2 },
    { id: "projects", title: "项目经历", icon: "🚀", enabled: true, order: 3 },
    { id: "skills", title: "专业技能", icon: "⚡", enabled: true, order: 4 },
    { id: "selfEvaluation", title: "自我评价", icon: "💬", enabled: true, order: 5 },
  ],
  globalSettings: {
    themeColor: "#6366F1",
    fontFamily: "Inter, Noto Sans SC, sans-serif",
    baseFontSize: 14,
    pagePadding: 40,
    sectionSpacing: 20,
    lineHeight: 1.6,
  },
};

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
    const originalTitle = document.title;
    const name = activeResume?.basic?.name?.trim();
    document.title = name ? `${name} - 简历` : activeResume?.title || "简历";
    window.print();
    document.title = originalTitle;
  }

  function handleRandomStyle() {
    const templateId = RESUME_TEMPLATES[Math.floor(Math.random() * RESUME_TEMPLATES.length)].id;
    const color = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
    const font = FONTS[Math.floor(Math.random() * FONTS.length)].value;
    dispatch({ type: "SET_TEMPLATE", payload: templateId });
    dispatch({ type: "UPDATE_SETTINGS", payload: { themeColor: color, fontFamily: font } });
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
          className="editor-toolbar__btn"
          onClick={handleRandomStyle}
          title="随机模板、字体和颜色"
        >
          随机样式
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
            {TEMPLATE_REGISTRY.map((entry) => {
              const tpl = entry.config;
              const isActive = activeResume.templateId === tpl.id;
              const previewData: ResumeBuilderData = {
                ...PREVIEW_SAMPLE,
                templateId: tpl.id,
                globalSettings: { ...PREVIEW_SAMPLE.globalSettings, themeColor: tpl.colorScheme.primary },
              };
              return (
                <button
                  key={tpl.id}
                  className={`editor-toolbar__template-card ${isActive ? "editor-toolbar__template-card--active" : ""}`}
                  onClick={() => handleTemplateSelect(tpl.id)}
                >
                  <div
                    className="editor-toolbar__template-preview"
                    style={{ borderColor: isActive ? activeResume.globalSettings.themeColor : undefined }}
                  >
                    <div className="editor-toolbar__template-mini">
                      {createElement(entry.Component, { data: previewData, template: tpl })}
                    </div>
                  </div>
                  <span className="editor-toolbar__template-name">{tpl.name}</span>
                  <span className="editor-toolbar__template-desc">{tpl.description}</span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
