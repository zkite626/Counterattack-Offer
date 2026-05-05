"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useJobFlow } from "@/contexts/JobFlowContext";
import { usersApi } from "@/lib/api/users";
import { careerFlowsApi } from "@/lib/api/career-flows";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Tag from "@/components/ui/Tag";
import type { StudentProfile } from "@/types";
import "../shared-page.css";
import "./profile.css";

const SCHOOL_TYPES = ["普通本科", "985/211", "高职", "专科"];
const GRADES = ["大一", "大二", "大三", "大四", "已毕业"];

export default function ProfilePage() {
  const router = useRouter();
  const { state, dispatch, resetFlow, loadSampleData, ensureActiveRun } = useJobFlow();

  const [name, setName] = useState("");
  const [schoolType, setSchoolType] = useState("普通本科");
  const [major, setMajor] = useState("");
  const [grade, setGrade] = useState("大三");
  const [targetCities, setTargetCities] = useState<string[]>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [rawExperiences, setRawExperiences] = useState<string[]>([""]);
  const [skills, setSkills] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [weaknessInput, setWeaknessInput] = useState("");
  const [formError, setFormError] = useState("");

  // Load existing profile into form
  useEffect(() => {
    const profile = state.studentProfile;
    if (profile) {
      setName(profile.name);
      setSchoolType(profile.schoolType);
      setMajor(profile.major);
      setGrade(profile.grade);
      setTargetCities(profile.targetCities);
      setTargetRoles(profile.targetRoles);
      setRawExperiences(profile.rawExperiences.length > 0 ? profile.rawExperiences : [""]);
      setSkills(profile.skills);
      setWeaknesses(profile.weaknesses);
    }
  }, [state.studentProfile]);

  function addTag(
    input: string,
    list: string[],
    setter: (v: string[]) => void,
    inputSetter: (v: string) => void
  ) {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) {
      setter([...list, trimmed]);
    }
    inputSetter("");
  }

  function removeTag(index: number, list: string[], setter: (v: string[]) => void) {
    setter(list.filter((_, i) => i !== index));
  }

  function addExperience() {
    setRawExperiences([...rawExperiences, ""]);
  }

  function updateExperience(index: number, value: string) {
    const updated = [...rawExperiences];
    updated[index] = value;
    setRawExperiences(updated);
  }

  function removeExperience(index: number) {
    if (rawExperiences.length > 1) {
      setRawExperiences(rawExperiences.filter((_, i) => i !== index));
    }
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setFormError("请填写姓名");
      return;
    }
    if (!major.trim()) {
      setFormError("请填写专业");
      return;
    }
    const filledExperiences = rawExperiences.filter((e) => e.trim());
    if (filledExperiences.length === 0) {
      setFormError("请至少填写一条经历");
      return;
    }

    setFormError("");

    const profile: StudentProfile = {
      id: state.studentProfile?.id || uuidv4(),
      name: name.trim(),
      schoolType,
      major: major.trim(),
      grade,
      targetCities,
      targetRoles,
      educationBackground: `${grade}，${major.trim()}专业`,
      rawExperiences: filledExperiences,
      skills,
      weaknesses,
      createdAt: state.studentProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const savedProfile = await usersApi.saveProfile(profile);
      const runId = await ensureActiveRun(savedProfile.targetRoles[0] ?? null, state.jobDescription);
      await careerFlowsApi.update(runId, {
        targetRole: savedProfile.targetRoles[0] ?? null,
        jobDescription: state.jobDescription,
        currentStep: "diagnosis",
        status: "running",
      });
      dispatch({ type: "SET_PROFILE", payload: savedProfile });
      dispatch({ type: "SET_RUN_ID", payload: runId });
      router.push("/diagnosis");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "保存失败，请稍后重试");
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1 className="profile-page__title">学生信息</h1>
        <p className="profile-page__subtitle">
          填写你的基本信息和经历，AI 将为你生成求职画像
        </p>
      </div>

      {/* Sample data import & clear */}
      <Card className="profile-page__demo-card biz-page__hero-panel">
        <div className="biz-page__hero-glow" />
        <div className="profile-page__demo-content">
          <div>
            <div className="profile-page__demo-title">快速体验</div>
            <div className="profile-page__demo-desc">
              导入完整案例可查看全部模块效果；清除数据可重新开始
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button variant="primary" onClick={loadSampleData}>
              导入完整案例
            </Button>
            <Button variant="secondary" onClick={resetFlow}>
              清除所有数据
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic info */}
      <Card className="profile-page__section biz-page__spotlight-card">
        <h2 className="profile-page__section-title">基本信息</h2>
        <div className="profile-page__form-grid">
          <Input
            label="姓名"
            placeholder="请输入姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="profile-page__field">
            <label className="profile-page__label">
              学校类型 <span className="profile-page__required">*</span>
            </label>
            <select
              className="profile-page__select"
              value={schoolType}
              onChange={(e) => setSchoolType(e.target.value)}
            >
              {SCHOOL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Input
            label="专业"
            placeholder="如：市场营销"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          />
          <div className="profile-page__field">
            <label className="profile-page__label">
              年级 <span className="profile-page__required">*</span>
            </label>
            <select
              className="profile-page__select"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Target */}
      <Card className="profile-page__section biz-page__accent-card">
        <h2 className="profile-page__section-title">求职目标</h2>
        <div className="profile-page__tag-field">
          <label className="profile-page__label">目标城市</label>
          <div className="profile-page__tags">
            {targetCities.map((city, i) => (
              <Tag key={i} removable onRemove={() => removeTag(i, targetCities, setTargetCities)}>
                {city}
              </Tag>
            ))}
          </div>
          <div className="profile-page__tag-input-row">
            <input
              className="profile-page__tag-input"
              placeholder="输入城市名，按回车添加"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(cityInput, targetCities, setTargetCities, setCityInput);
                }
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addTag(cityInput, targetCities, setTargetCities, setCityInput)}
            >
              添加
            </Button>
          </div>
        </div>

        <div className="profile-page__tag-field">
          <label className="profile-page__label">目标岗位</label>
          <div className="profile-page__tags">
            {targetRoles.map((role, i) => (
              <Tag key={i} removable onRemove={() => removeTag(i, targetRoles, setTargetRoles)}>
                {role}
              </Tag>
            ))}
          </div>
          <div className="profile-page__tag-input-row">
            <input
              className="profile-page__tag-input"
              placeholder="输入岗位名，按回车添加"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(roleInput, targetRoles, setTargetRoles, setRoleInput);
                }
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addTag(roleInput, targetRoles, setTargetRoles, setRoleInput)}
            >
              添加
            </Button>
          </div>
        </div>
      </Card>

      {/* Experiences */}
      <Card className="profile-page__section biz-page__tinted-card">
        <h2 className="profile-page__section-title">原始经历</h2>
        <p className="profile-page__section-desc">
          包括课程作业、社团活动、兼职、比赛、项目等任何经历
        </p>
        <div className="profile-page__experiences">
          {rawExperiences.map((exp, i) => (
            <div key={i} className="profile-page__exp-row">
              <textarea
                className="profile-page__textarea"
                placeholder={`经历 ${i + 1}，如：大二在社团做过...`}
                value={exp}
                onChange={(e) => updateExperience(i, e.target.value)}
                rows={2}
              />
              {rawExperiences.length > 1 && (
                <button
                  className="profile-page__exp-remove"
                  onClick={() => removeExperience(i)}
                  aria-label="删除经历"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={addExperience}>
          + 添加经历
        </Button>
      </Card>

      {/* Skills & Weaknesses */}
      <Card className="profile-page__section biz-page__spotlight-card">
        <h2 className="profile-page__section-title">技能与困惑</h2>
        <div className="profile-page__tag-field">
          <label className="profile-page__label">技能</label>
          <div className="profile-page__tags">
            {skills.map((skill, i) => (
              <Tag key={i} variant="success" removable onRemove={() => removeTag(i, skills, setSkills)}>
                {skill}
              </Tag>
            ))}
          </div>
          <div className="profile-page__tag-input-row">
            <input
              className="profile-page__tag-input"
              placeholder="输入技能，按回车添加"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(skillInput, skills, setSkills, setSkillInput);
                }
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addTag(skillInput, skills, setSkills, setSkillInput)}
            >
              添加
            </Button>
          </div>
        </div>

        <div className="profile-page__tag-field">
          <label className="profile-page__label">求职困惑</label>
          <div className="profile-page__tags">
            {weaknesses.map((w, i) => (
              <Tag key={i} variant="warning" removable onRemove={() => removeTag(i, weaknesses, setWeaknesses)}>
                {w}
              </Tag>
            ))}
          </div>
          <div className="profile-page__tag-input-row">
            <input
              className="profile-page__tag-input"
              placeholder="输入困惑，按回车添加"
              value={weaknessInput}
              onChange={(e) => setWeaknessInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(weaknessInput, weaknesses, setWeaknesses, setWeaknessInput);
                }
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addTag(weaknessInput, weaknesses, setWeaknesses, setWeaknessInput)}
            >
              添加
            </Button>
          </div>
        </div>
      </Card>

      {/* Submit */}
      {formError && (
        <div className="profile-page__error">{formError}</div>
      )}

      <div className="profile-page__actions">
        <Button size="lg" fullWidth onClick={handleSubmit}>
          开始 AI 诊断
        </Button>
      </div>
    </div>
  );
}
