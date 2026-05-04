"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import SectionNavigator from "@/components/business/SectionNavigator";
import SectionEditor from "@/components/business/SectionEditor";
import ResumePreview from "@/components/business/ResumePreview";
import EditorToolbar from "@/components/business/EditorToolbar";
import "@/components/resume-templates/templates.css";
import "./editor-workspace.css";

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { state, setActiveResume } = useResumeBuilder();
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const resumeId = params.id as string;

  // 设置当前活跃简历（仅在 resumeId 变化时触发）
  useEffect(() => {
    if (resumeId && state.resumes[resumeId]) {
      setActiveResume(resumeId);
    }
  }, [resumeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 简历不存在时跳回列表
  useEffect(() => {
    if (resumeId && !state.resumes[resumeId]) {
      router.replace("/resume-builder");
    }
  }, [resumeId, state.resumes, router]);

  if (!state.resumes[resumeId]) {
    return (
      <div className="editor-workspace__loading">加载中...</div>
    );
  }

  return (
    <div className="editor-workspace">
      {/* 工具栏 */}
      <div className="editor-workspace__toolbar">
        <EditorToolbar />
      </div>

      {/* 移动端 Tab 切换 */}
      <div className="editor-workspace__mobile-tabs">
        <button
          className={`editor-workspace__mobile-tab ${
            mobileTab === "edit" ? "editor-workspace__mobile-tab--active" : ""
          }`}
          onClick={() => setMobileTab("edit")}
        >
          编辑
        </button>
        <button
          className={`editor-workspace__mobile-tab ${
            mobileTab === "preview" ? "editor-workspace__mobile-tab--active" : ""
          }`}
          onClick={() => setMobileTab("preview")}
        >
          预览
        </button>
      </div>

      <div className="editor-workspace__body">
        {/* 左栏：模块导航 */}
        <aside className={`editor-workspace__nav ${mobileTab === 'preview' ? 'editor-workspace__nav--hidden-mobile' : ''}`}>
          <SectionNavigator />
        </aside>

        {/* 中栏：编辑面板 */}
        <div
          className={`editor-workspace__editor ${
            mobileTab === "edit" ? "" : "editor-workspace__editor--hidden-mobile"
          }`}
        >
          <SectionEditor />
        </div>

        {/* 右栏：A4 预览 */}
        <div
          className={`editor-workspace__preview ${
            mobileTab === "preview" ? "" : "editor-workspace__preview--hidden-mobile"
          }`}
        >
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
