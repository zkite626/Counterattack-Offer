"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { buildResumeFromAIResults } from "@/lib/utils/resume-builder";
import type { ResumeBuilderData } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import "../shared-page.css";
import "./resume-builder.css";

/** 列表卡片缩略图：只渲染简历头部基本信息区域 */
function ResumeCardPreview({ resume }: { resume: ResumeBuilderData }) {
  const themeColor = resume.globalSettings?.themeColor || "#6366F1";
  const { basic } = resume;
  const isSidebar = resume.templateId === "sidebar";
  const isElegant = resume.templateId === "elegant";
  const isBold = resume.templateId === "bold-header";

  return (
    <div className="resume-builder-list__card-thumb">
      <div className="resume-card-preview">
        {/* 主题色装饰条 */}
        {!isBold && !isSidebar && (
          <div className="resume-card-preview__accent" style={{ backgroundColor: themeColor }} />
        )}

        {isSidebar ? (
          <div className="resume-card-preview__sidebar-layout">
            <div className="resume-card-preview__sidebar-left" style={{ backgroundColor: themeColor }}>
              <div className="resume-card-preview__sidebar-photo">
                {basic.photo ? (
                  <Image src={basic.photo} alt="" width={28} height={34} unoptimized />
                ) : (
                  <div className="resume-card-preview__sidebar-avatar" />
                )}
              </div>
              <div className="resume-card-preview__sidebar-name">{basic.name || "姓名"}</div>
            </div>
            <div className="resume-card-preview__sidebar-right">
              <div className="resume-card-preview__name">{basic.name || "姓名"}</div>
              {basic.title && <div className="resume-card-preview__title">{basic.title}</div>}
              <div className="resume-card-preview__lines">
                <span style={{ width: "70%" }} /><span style={{ width: "85%" }} /><span style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        ) : isBold ? (
          <>
            <div
              className="resume-card-preview__bold-banner"
              style={{
                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
              }}
            >
              <div className="resume-card-preview__bold-content">
                {basic.photo && (
                  <div className="resume-card-preview__bold-photo">
                    <Image src={basic.photo} alt="" width={24} height={30} unoptimized />
                  </div>
                )}
                <div>
                  <div className="resume-card-preview__bold-name">{basic.name || "姓名"}</div>
                  {basic.title && <div className="resume-card-preview__bold-title">{basic.title}</div>}
                </div>
              </div>
            </div>
            <div className="resume-card-preview__lines" style={{ alignItems: "flex-start", marginTop: "52px" }}>
              <span className="resume-card-preview__section-heading" style={{ borderBottomColor: themeColor }} />
              <span style={{ width: "90%" }} /><span style={{ width: "70%" }} />
              <span className="resume-card-preview__section-heading" style={{ borderBottomColor: themeColor }} />
              <span style={{ width: "80%" }} />
            </div>
          </>
        ) : (
          <>
            {basic.photo && (
              <div className="resume-card-preview__photo">
                <Image src={basic.photo} alt="" width={32} height={40} unoptimized />
              </div>
            )}
            <div
              className={`resume-card-preview__name ${isElegant ? "resume-card-preview__name--elegant" : ""}`}
              style={{ color: themeColor }}
            >
              {basic.name || "姓名"}
            </div>
            {basic.title && (
              <div className={`resume-card-preview__title ${isElegant ? "resume-card-preview__title--elegant" : ""}`}>
                {basic.title}
              </div>
            )}
            <div className="resume-card-preview__contact">
              {basic.phone && <span>{basic.phone}</span>}
              {basic.email && <span>{basic.email}</span>}
            </div>
            {/* 模拟下方内容线条 */}
            <div className="resume-card-preview__lines">
              <span className="resume-card-preview__section-heading" style={{ borderBottomColor: themeColor }} />
              <span style={{ width: "90%" }} /><span style={{ width: "75%" }} /><span style={{ width: "60%" }} />
              <span className="resume-card-preview__section-heading" style={{ borderBottomColor: themeColor }} />
              <span style={{ width: "85%" }} /><span style={{ width: "70%" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResumeBuilderListPage() {
  const router = useRouter();
  const { state, dispatch, createResume, deleteResume, duplicateResume } = useResumeBuilder();
  const { state: jobFlowState } = useJobFlow();

  const resumeList = Object.values(state.resumes).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function handleCreateBlank() {
    const id = createResume("classic", "未命名简历");
    router.push(`/resume-builder/${id}`);
  }

  function handleCreateFromAI() {
    const { studentProfile, careerDiagnosis, experienceTranslations, resumeOptimization, jobAnalysis } = jobFlowState;
    if (!studentProfile) {
      alert("请先完成个人信息填写和 AI 分析，再使用此功能");
      return;
    }
    const resumeData = buildResumeFromAIResults(
      studentProfile,
      careerDiagnosis,
      experienceTranslations,
      resumeOptimization,
      jobAnalysis
    );
    dispatch({ type: "LOAD_FROM_AI", payload: resumeData });
    router.push(`/resume-builder/${resumeData.id}`);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("确定要删除这份简历吗？")) {
      deleteResume(id);
    }
  }

  function handleDuplicate(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    duplicateResume(id);
  }

  return (
    <div className="biz-page resume-builder-list">
      <div className="biz-page__header">
        <div className="resume-builder-list__header-row">
          <div>
            <h1 className="biz-page__title">我的简历</h1>
            <p className="biz-page__subtitle">管理你的简历，支持多模板编辑和 PDF 导出</p>
          </div>
          <div className="resume-builder-list__actions">
            <Button onClick={handleCreateBlank}>新建空白简历</Button>
            <Button
              variant="secondary"
              onClick={handleCreateFromAI}
              title="从已完成的 AI 分析结果自动创建简历"
            >
              从 AI 结果创建
            </Button>
          </div>
        </div>
      </div>

      {resumeList.length === 0 ? (
        <div className="resume-builder-list__empty">
          <div className="resume-builder-list__empty-icon"><Icon name="resume" size="3rem" /></div>
          <p className="resume-builder-list__empty-text">还没有简历，开始创建你的第一份简历吧</p>
          <Button onClick={handleCreateBlank}>新建空白简历</Button>
        </div>
      ) : (
        <div className="resume-builder-list__grid">
          {resumeList.map((resume) => (
            <Card
              key={resume.id}
              className="resume-builder-list__card"
              onClick={() => router.push(`/resume-builder/${resume.id}`)}
            >
              <ResumeCardPreview resume={resume} />
              <div className="resume-builder-list__card-info">
                <h3 className="resume-builder-list__card-title">{resume.title}</h3>
                <p className="resume-builder-list__card-time">
                  更新于 {new Date(resume.updatedAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <div className="resume-builder-list__card-actions">
                <button
                  className="resume-builder-list__card-btn"
                  onClick={(e) => handleDuplicate(resume.id, e)}
                  title="复制"
                >
                  复制
                </button>
                <button
                  className="resume-builder-list__card-btn resume-builder-list__card-btn--danger"
                  onClick={(e) => handleDelete(resume.id, e)}
                  title="删除"
                >
                  删除
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
