"use client";

import { useRef } from "react";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import type { ResumeCustomField } from "@/types";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function BasicInfoPanel() {
  const { activeResume, dispatch } = useResumeBuilder();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeResume) return null;
  const { basic } = activeResume;

  function updateField(field: string, value: string) {
    dispatch({ type: "UPDATE_BASIC", payload: { [field]: value } });
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    // 限制 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("照片大小不能超过 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: "UPDATE_BASIC", payload: { photo: reader.result as string } });
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    dispatch({ type: "UPDATE_BASIC", payload: { photo: undefined } });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addCustomField() {
    const newField: ResumeCustomField = {
      id: generateId(),
      label: "",
      value: "",
      visible: true,
    };
    dispatch({
      type: "UPDATE_BASIC",
      payload: { customFields: [...basic.customFields, newField] },
    });
  }

  function updateCustomField(id: string, data: Partial<ResumeCustomField>) {
    dispatch({
      type: "UPDATE_BASIC",
      payload: {
        customFields: basic.customFields.map((f) =>
          f.id === id ? { ...f, ...data } : f
        ),
      },
    });
  }

  function deleteCustomField(id: string) {
    dispatch({
      type: "UPDATE_BASIC",
      payload: { customFields: basic.customFields.filter((f) => f.id !== id) },
    });
  }

  return (
    <div className="editor-panel">
      <div className="editor-panel__card">
        <h3 className="editor-panel__card-title">基本信息</h3>

        {/* 照片上传 */}
        <div className="editor-panel__photo-row">
          <div
            className="editor-panel__photo-preview"
            onClick={() => basic.photo ? undefined : fileInputRef.current?.click()}
          >
            {basic.photo ? (
              <img src={basic.photo} alt="证件照" className="editor-panel__photo-img" />
            ) : (
              <span className="editor-panel__photo-placeholder">+</span>
            )}
          </div>
          <div className="editor-panel__photo-actions">
            <button
              className="editor-panel__photo-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              {basic.photo ? "更换照片" : "上传照片"}
            </button>
            {basic.photo && (
              <button
                className="editor-panel__photo-btn editor-panel__photo-btn--remove"
                onClick={removePhoto}
              >
                移除照片
              </button>
            )}
            <p className="editor-panel__photo-hint">可选，支持 JPG/PNG，不超过 2MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
        </div>

        <div className="editor-panel__form-grid">
          <div className="editor-panel__field">
            <label className="editor-panel__label">姓名</label>
            <input
              className="editor-panel__input"
              value={basic.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="你的姓名"
            />
          </div>
          <div className="editor-panel__field">
            <label className="editor-panel__label">求职意向</label>
            <input
              className="editor-panel__input"
              value={basic.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="目标职位"
            />
          </div>
          <div className="editor-panel__field">
            <label className="editor-panel__label">手机号</label>
            <input
              className="editor-panel__input"
              value={basic.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="手机号"
            />
          </div>
          <div className="editor-panel__field">
            <label className="editor-panel__label">邮箱</label>
            <input
              className="editor-panel__input"
              value={basic.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="邮箱地址"
            />
          </div>
          <div className="editor-panel__field">
            <label className="editor-panel__label">所在城市</label>
            <input
              className="editor-panel__input"
              value={basic.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="如：北京"
            />
          </div>
          <div className="editor-panel__field">
            <label className="editor-panel__label">出生日期</label>
            <input
              className="editor-panel__input"
              type="date"
              value={basic.birthDate || ""}
              onChange={(e) => updateField("birthDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 自定义字段 */}
      {basic.customFields.length > 0 && (
        <div className="editor-panel__card">
          <h3 className="editor-panel__card-title">自定义字段</h3>
          <div className="editor-panel__list">
            {basic.customFields.map((field) => (
              <div key={field.id} className="editor-panel__list-item">
                <div className="editor-panel__form-grid">
                  <div className="editor-panel__field">
                    <label className="editor-panel__label">标签</label>
                    <input
                      className="editor-panel__input"
                      value={field.label}
                      onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                      placeholder="如：GitHub"
                    />
                  </div>
                  <div className="editor-panel__field">
                    <label className="editor-panel__label">内容</label>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <input
                        className="editor-panel__input"
                        value={field.value}
                        onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                        placeholder="值"
                        style={{ flex: 1 }}
                      />
                      <button
                        className="editor-panel__delete-btn"
                        onClick={() => deleteCustomField(field.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="editor-panel__add-btn" onClick={addCustomField}>
        + 添加自定义字段
      </button>
    </div>
  );
}
