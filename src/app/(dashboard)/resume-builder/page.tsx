"use client";

import { useRouter } from "next/navigation";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { buildResumeFromAIResults } from "@/lib/utils/resume-builder";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import "../shared-page.css";
import "./resume-builder.css";

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
    // 使用 LOAD_FROM_AI 一次性创建包含完整数据的简历
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
          <div className="resume-builder-list__empty-icon">📝</div>
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
              <div className="resume-builder-list__card-thumb">
                <div className="resume-builder-list__card-thumb-inner">
                  <span>{resume.title.charAt(0)}</span>
                </div>
              </div>
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
