# 02 — 数据模型文档

## 概述

升级后数据以 PostgreSQL 为唯一权威存储。TypeScript DTO 与数据库模型必须保持一致，移动端和 Web 共用同一套 API 返回结构。

数据库字段命名建议使用 `snake_case`，TypeScript 类型使用 `camelCase`，通过 DTO 层转换。

---

## 2.1 用户与权限

### `users`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 用户 ID |
| `email` | varchar unique | 登录邮箱 |
| `email_verified_at` | timestamptz nullable | 邮箱验证时间 |
| `password_hash` | varchar | 密码哈希 |
| `name` | varchar | 昵称/姓名 |
| `avatar_url` | text nullable | 头像 |
| `role` | enum | `student` / `admin` |
| `status` | enum | `active` / `pending_email` / `disabled` / `deleted` |
| `last_login_at` | timestamptz nullable | 最近登录时间 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

```typescript
export type UserRole = 'student' | 'admin';
export type UserStatus = 'active' | 'pending_email' | 'disabled' | 'deleted';

export interface User {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### `refresh_tokens`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | Token 记录 ID |
| `user_id` | uuid | 所属用户 |
| `token_hash` | varchar | Refresh Token 哈希，不存明文 |
| `client_type` | enum | `web` / `mobile` |
| `device_name` | varchar nullable | 移动端设备名称 |
| `ip_address` | inet nullable | 登录 IP |
| `user_agent` | text nullable | UA |
| `expires_at` | timestamptz | 过期时间 |
| `revoked_at` | timestamptz nullable | 撤销时间 |

---

## 2.2 邮箱验证与找回密码

### `email_verification_tokens`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 记录 ID |
| `user_id` | uuid | 用户 ID |
| `token_hash` | varchar | 验证 Token 哈希 |
| `email` | varchar | 待验证邮箱 |
| `expires_at` | timestamptz | 过期时间 |
| `used_at` | timestamptz nullable | 使用时间 |

### `password_reset_tokens`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 记录 ID |
| `user_id` | uuid | 用户 ID |
| `token_hash` | varchar | 重置 Token 哈希 |
| `expires_at` | timestamptz | 过期时间 |
| `used_at` | timestamptz nullable | 使用时间 |

---

## 2.3 AI 模型配置

### `ai_model_configs`

该表同时承载用户模型和管理员全局模型。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 配置 ID |
| `scope` | enum | `user` / `global` |
| `owner_user_id` | uuid nullable | 用户模型所属人，全局模型为空 |
| `display_name` | varchar | 展示名称 |
| `provider` | varchar | `deepseek` / `openai` / `zhipu` / `custom` |
| `base_url` | text | OpenAI 兼容 API 地址 |
| `model` | varchar | 模型 ID |
| `encrypted_api_key` | text | 加密后的 API Key |
| `api_key_hint` | varchar | 掩码，如 `sk-***abcd` |
| `api_key_fingerprint` | varchar | Key 哈希指纹，用于重复检测 |
| `temperature` | numeric nullable | 默认温度 |
| `max_tokens` | int nullable | 默认输出上限 |
| `is_default` | boolean | 是否默认 |
| `is_enabled` | boolean | 是否启用 |
| `last_tested_at` | timestamptz nullable | 最近测试时间 |
| `last_test_status` | enum nullable | `success` / `failed` |
| `created_by` | uuid nullable | 创建人 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

```typescript
export type AIModelScope = 'user' | 'global';

export interface AIModelConfig {
  id: string;
  scope: AIModelScope;
  ownerUserId: string | null;
  displayName: string;
  provider: string;
  baseUrl: string;
  model: string;
  apiKeyHint: string;
  temperature: number | null;
  maxTokens: number | null;
  isDefault: boolean;
  isEnabled: boolean;
  lastTestedAt: string | null;
  lastTestStatus: 'success' | 'failed' | null;
  createdAt: string;
  updatedAt: string;
}
```

### `ai_call_logs`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 日志 ID |
| `user_id` | uuid | 调用用户 |
| `model_config_id` | uuid nullable | 使用的模型配置 |
| `module` | varchar | `diagnose` / `match` / `resume` 等 |
| `provider` | varchar | 模型服务商 |
| `model` | varchar | 模型 ID |
| `status` | enum | `success` / `failed` |
| `prompt_tokens` | int nullable | 输入 Token |
| `completion_tokens` | int nullable | 输出 Token |
| `latency_ms` | int | 延迟 |
| `error_code` | varchar nullable | 错误码 |
| `created_at` | timestamptz | 调用时间 |

---

## 2.4 SMTP 与邮件

### `smtp_settings`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 配置 ID |
| `host` | varchar | SMTP Host |
| `port` | int | SMTP Port |
| `secure` | boolean | 是否 TLS |
| `username` | varchar | SMTP 账号 |
| `encrypted_password` | text | 加密密码 |
| `from_name` | varchar | 发件人名称 |
| `from_email` | varchar | 发件邮箱 |
| `is_enabled` | boolean | 是否启用 |
| `last_tested_at` | timestamptz nullable | 最近测试时间 |
| `last_test_status` | enum nullable | 测试状态 |
| `updated_by` | uuid nullable | 最近更新管理员 |
| `updated_at` | timestamptz | 更新时间 |

### `mail_events`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 邮件事件 ID |
| `user_id` | uuid nullable | 关联用户 |
| `type` | enum | `verify_email` / `reset_password` / `welcome` / `security_notice` |
| `to_email` | varchar | 收件人 |
| `subject` | varchar | 标题 |
| `status` | enum | `queued` / `sent` / `failed` |
| `error_message` | text nullable | 失败原因 |
| `sent_at` | timestamptz nullable | 发送时间 |
| `created_at` | timestamptz | 创建时间 |

---

## 2.5 学生档案与求职流程

### `student_profiles`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 档案 ID |
| `user_id` | uuid unique | 所属用户 |
| `school_type` | varchar | 学校类型 |
| `major` | varchar | 专业 |
| `grade` | varchar | 年级 |
| `target_cities` | text[] | 目标城市 |
| `target_roles` | text[] | 目标岗位 |
| `education_background` | text | 教育背景描述 |
| `skills` | text[] | 技能 |
| `weaknesses` | text[] | 弱项 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### `experiences`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 经历 ID |
| `user_id` | uuid | 所属用户 |
| `profile_id` | uuid | 关联档案 |
| `raw_content` | text | 原始经历 |
| `type` | varchar | 社团/课程/项目/实习/竞赛等 |
| `sort_order` | int | 排序 |
| `created_at` | timestamptz | 创建时间 |

### `career_flow_runs`

一次完整求职分析流程记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 流程 ID |
| `user_id` | uuid | 所属用户 |
| `target_role` | varchar nullable | 本次目标岗位 |
| `job_description` | text nullable | JD 原文 |
| `status` | enum | `draft` / `running` / `completed` / `failed` |
| `current_step` | varchar | 当前步骤 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### `career_flow_results`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 结果 ID |
| `run_id` | uuid | 所属流程 |
| `step` | varchar | `diagnosis` / `translation` / `job` / `match` / `resume` / `interview` / `plan` / `report` |
| `input_snapshot` | jsonb | 输入快照 |
| `result` | jsonb | AI 结构化输出 |
| `model_config_id` | uuid nullable | 使用模型 |
| `created_at` | timestamptz | 创建时间 |

---

## 2.6 简历

### `resumes`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 简历 ID |
| `user_id` | uuid | 所属用户 |
| `title` | varchar | 简历标题 |
| `template_id` | varchar | 模板 ID |
| `theme` | jsonb | 字体、颜色、布局设置 |
| `content` | jsonb | 简历结构化内容 |
| `source_run_id` | uuid nullable | 来源求职流程 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### `resume_versions`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 版本 ID |
| `resume_id` | uuid | 简历 ID |
| `version_no` | int | 版本号 |
| `content` | jsonb | 内容快照 |
| `created_by` | uuid | 创建人 |
| `created_at` | timestamptz | 创建时间 |

---

## 2.7 管理与审计

### `audit_logs`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 审计 ID |
| `actor_user_id` | uuid nullable | 操作人 |
| `action` | varchar | 操作类型 |
| `target_type` | varchar | 目标类型 |
| `target_id` | uuid nullable | 目标 ID |
| `metadata` | jsonb | 附加信息，禁止写入密钥明文 |
| `ip_address` | inet nullable | IP |
| `user_agent` | text nullable | UA |
| `created_at` | timestamptz | 操作时间 |

### `app_settings`

| 字段 | 类型 | 说明 |
|------|------|------|
| `key` | varchar primary key | 设置键 |
| `value` | jsonb | 设置值 |
| `is_secret` | boolean | 是否敏感 |
| `updated_by` | uuid nullable | 更新人 |
| `updated_at` | timestamptz | 更新时间 |

## 2.8 通用 API 类型

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  requestId?: string;
}
```

