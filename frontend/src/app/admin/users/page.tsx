"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { adminApi, type AdminUser } from "@/lib/api/admin";
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from "@/lib/labels";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Tag from "@/components/ui/Tag";

type UserRole = AdminUser["role"];
type UserStatus = AdminUser["status"];
type NoticeType = "success" | "error";

interface UserDraft {
  role: UserRole;
  status: UserStatus;
}

interface CreateUserForm {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  status: Exclude<UserStatus, "deleted">;
}

interface Notice {
  type: NoticeType;
  message: string;
}

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: "student", label: USER_ROLE_LABELS.student },
  { value: "admin", label: USER_ROLE_LABELS.admin },
];

const STATUS_OPTIONS: Array<{ value: UserStatus; label: string }> = [
  { value: "active", label: USER_STATUS_LABELS.active },
  { value: "pending_email", label: USER_STATUS_LABELS.pending_email },
  { value: "disabled", label: USER_STATUS_LABELS.disabled },
  { value: "deleted", label: USER_STATUS_LABELS.deleted },
];

const CREATE_STATUS_OPTIONS: Array<{ value: CreateUserForm["status"]; label: string; helper: string }> = [
  { value: "pending_email", label: USER_STATUS_LABELS.pending_email, helper: "创建后发送验证邮件" },
  { value: "active", label: USER_STATUS_LABELS.active, helper: "创建后可直接登录" },
  { value: "disabled", label: USER_STATUS_LABELS.disabled, helper: "创建但暂不允许登录" },
];

const EMPTY_CREATE_FORM: CreateUserForm = {
  email: "",
  name: "",
  password: "",
  role: "student",
  status: "pending_email",
};

function formatError(error: unknown): string {
  if (error instanceof ApiError) {
    return `${error.message}${error.requestId ? `（请求编号：${error.requestId}）` : ""}`;
  }
  return error instanceof Error ? error.message : "加载失败";
}

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleString("zh-CN") : "暂无";
}

function getStatusVariant(status: UserStatus): "success" | "warning" | "danger" {
  if (status === "active") return "success";
  if (status === "disabled" || status === "deleted") return "danger";
  return "warning";
}

function toDrafts(users: AdminUser[]): Record<string, UserDraft> {
  return Object.fromEntries(
    users.map((user) => [user.id, { role: user.role, status: user.status }]),
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [drafts, setDrafts] = useState<Record<string, UserDraft>>({});
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>(EMPTY_CREATE_FORM);
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setNotice(null);
    try {
      const result = await adminApi.listUsers();
      setUsers(result.items);
      setDrafts(toDrafts(result.items));
    } catch (err) {
      setNotice({ type: "error", message: formatError(err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openCreateModal() {
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateError("");
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    setShowCreateModal(false);
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateError("");
  }

  function updateDraft(userId: string, patch: Partial<UserDraft>) {
    setDrafts((prev) => {
      const current = prev[userId];
      if (!current) return prev;
      return {
        ...prev,
        [userId]: { ...current, ...patch },
      };
    });
  }

  async function saveUser(user: AdminUser) {
    const draft = drafts[user.id];
    if (!draft) return;

    setSavingUserId(user.id);
    setNotice(null);
    try {
      await adminApi.updateUser(user.id, {
        role: draft.role,
        status: draft.status,
      });
      await loadUsers();
      setNotice({ type: "success", message: "用户信息已保存" });
    } catch (err) {
      setNotice({ type: "error", message: formatError(err) });
    } finally {
      setSavingUserId(null);
    }
  }

  async function submitCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!createForm.email.trim()) {
      setCreateError("请输入邮箱");
      return;
    }
    if (!createForm.name.trim()) {
      setCreateError("请输入姓名");
      return;
    }
    if (createForm.password.trim().length < 8) {
      setCreateError("初始密码至少需要 8 位");
      return;
    }

    setCreateLoading(true);
    setCreateError("");
    setNotice(null);
    try {
      const result = await adminApi.createUser({
        email: createForm.email.trim(),
        name: createForm.name.trim(),
        password: createForm.password,
        role: createForm.role,
        status: createForm.status,
      });
      closeCreateModal();
      await loadUsers();
      setNotice({ type: "success", message: result.message });
    } catch (err) {
      setCreateError(formatError(err));
    } finally {
      setCreateLoading(false);
    }
  }

  async function toggleUser(user: AdminUser) {
    if (!window.confirm(`确定${user.status === "disabled" ? "启用" : "禁用"} ${user.email}？`)) return;
    setSavingUserId(user.id);
    setNotice(null);
    try {
      if (user.status === "disabled") {
        await adminApi.enableUser(user.id);
        await loadUsers();
        setNotice({ type: "success", message: "用户已启用" });
      } else {
        await adminApi.disableUser(user.id);
        await loadUsers();
        setNotice({ type: "success", message: "用户已禁用" });
      }
    } catch (err) {
      setNotice({ type: "error", message: formatError(err) });
    } finally {
      setSavingUserId(null);
    }
  }

  async function deleteUser(user: AdminUser) {
    if (currentUser?.id === user.id) {
      setNotice({ type: "error", message: "不能删除当前登录的管理员账号" });
      return;
    }

    if (!window.confirm(`确定删除 ${user.email}？该操作会将账号标记为已删除并失效旧会话。`)) return;
    setSavingUserId(user.id);
    setNotice(null);
    try {
      const result = await adminApi.deleteUser(user.id);
      await loadUsers();
      setNotice({ type: "success", message: result.message });
    } catch (err) {
      setNotice({ type: "error", message: formatError(err) });
    } finally {
      setSavingUserId(null);
    }
  }

  async function resendVerification(user: AdminUser) {
    setSavingUserId(user.id);
    setNotice(null);
    try {
      const result = await adminApi.resendUserVerification(user.id);
      setNotice({ type: "success", message: result.message });
    } catch (err) {
      setNotice({ type: "error", message: formatError(err) });
    } finally {
      setSavingUserId(null);
    }
  }

  function openResetModal(user: AdminUser) {
    setResetTarget(user);
    setResetPassword("");
    setResetPasswordConfirm("");
    setResetError("");
  }

  function closeResetModal() {
    setResetTarget(null);
    setResetPassword("");
    setResetPasswordConfirm("");
    setResetError("");
  }

  async function submitResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetTarget) return;

    if (resetPassword.length < 8) {
      setResetError("新密码至少需要 8 位");
      return;
    }

    if (resetPassword !== resetPasswordConfirm) {
      setResetError("两次输入的新密码不一致");
      return;
    }

    setResetLoading(true);
    setResetError("");
    setNotice(null);
    try {
      const result = await adminApi.resetUserPassword(resetTarget.id, resetPassword);
      closeResetModal();
      setNotice({ type: "success", message: result.message });
    } catch (err) {
      setResetError(formatError(err));
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">用户管理</h1>
          <p className="admin-page__subtitle">查看和维护用户角色、状态、验证邮件与登录密码</p>
        </div>
        <div className="admin-page__header-actions">
          <Button variant="secondary" onClick={loadUsers} loading={loading}>
            刷新
          </Button>
          <Button variant="primary" onClick={openCreateModal} icon={<Icon name="plus" size="1em" />}>
            新增用户
          </Button>
        </div>
      </div>

      {notice && (
        <div className={`admin-feedback admin-feedback--${notice.type}`}>
          {notice.message}
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table admin-table--users">
          <thead>
            <tr>
              <th>用户</th>
              <th>角色与状态</th>
              <th>邮箱验证</th>
              <th>注册时间</th>
              <th>最近登录</th>
              <th>AI 调用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const draft = drafts[user.id] ?? { role: user.role, status: user.status };
              const dirty = draft.role !== user.role || draft.status !== user.status;
              const rowSaving = savingUserId === user.id;

              return (
                <tr key={user.id}>
                  <td className="admin-user-cell">
                    <strong>{user.name}</strong>
                    <div className="admin-muted">{user.email}</div>
                  </td>
                  <td>
                    <div className="admin-user-edit">
                      <select
                        className="admin-select admin-select--compact"
                        value={draft.role}
                        onChange={(event) => updateDraft(user.id, { role: event.target.value as UserRole })}
                        aria-label={`${user.email} 的角色`}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <select
                        className="admin-select admin-select--compact"
                        value={draft.status}
                        onChange={(event) => updateDraft(user.id, { status: event.target.value as UserStatus })}
                        aria-label={`${user.email} 的状态`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant={dirty ? "primary" : "secondary"}
                        loading={rowSaving && dirty}
                        disabled={!dirty || rowSaving}
                        onClick={() => saveUser(user)}
                      >
                        保存
                      </Button>
                    </div>
                  </td>
                  <td>
                    <Tag size="sm" variant={user.emailVerifiedAt ? "success" : "warning"}>
                      {user.emailVerifiedAt ? "已验证" : "未验证"}
                    </Tag>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastLoginAt)}</td>
                  <td>
                    <strong>{user.aiCallsToday ?? 0}</strong>
                    <div className="admin-muted">累计 {user.aiCallsTotal ?? 0}</div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Button
                        size="sm"
                        variant={user.status === "disabled" ? "secondary" : "danger"}
                        loading={rowSaving && !dirty}
                        disabled={rowSaving}
                        onClick={() => toggleUser(user)}
                      >
                        {user.status === "disabled" ? "启用" : "禁用"}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={rowSaving}
                        onClick={() => openResetModal(user)}
                      >
                        重置密码
                      </Button>
                      {!user.emailVerifiedAt && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={rowSaving}
                          disabled={rowSaving}
                          onClick={() => resendVerification(user)}
                        >
                          重发验证
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        loading={rowSaving}
                        disabled={rowSaving || currentUser?.id === user.id || user.status === "deleted"}
                        onClick={() => deleteUser(user)}
                      >
                        删除
                      </Button>
                      <Tag size="sm" variant={getStatusVariant(user.status)}>
                        {USER_STATUS_LABELS[user.status]}
                      </Tag>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && users.length === 0 && (
              <tr><td colSpan={7}>暂无用户数据</td></tr>
            )}
            {loading && <tr><td colSpan={7}>加载中...</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        title="新增用户"
        size="md"
      >
        <form className="admin-password-form" onSubmit={submitCreateUser}>
          {createError && <div className="admin-feedback admin-feedback--error">{createError}</div>}
          <div className="admin-form__row">
            <Input
              label="邮箱"
              type="email"
              placeholder="如：student@example.com"
              helper="用于登录和接收系统邮件，不能与现有账号重复。"
              value={createForm.email}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <Input
              label="姓名"
              placeholder="如：李同学"
              helper="会显示在后台用户列表和系统邮件中。"
              value={createForm.name}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="admin-form__row">
            <Input
              label="初始密码"
              type="password"
              placeholder="至少 8 位"
              helper="创建后可由用户自己修改，管理员也可后续重置。"
              value={createForm.password}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
            <div className="admin-field">
              <label className="admin-field__label" htmlFor="create-user-role">角色</label>
              <select
                id="create-user-role"
                className="admin-select"
                value={createForm.role}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="admin-field__helper">建议普通成员使用学生角色，管理员角色请谨慎分配。</span>
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="create-user-status">账号状态</label>
            <select
              id="create-user-status"
              className="admin-select"
              value={createForm.status}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, status: event.target.value as CreateUserForm["status"] }))}
            >
              {CREATE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="admin-field__helper">
              {CREATE_STATUS_OPTIONS.find((option) => option.value === createForm.status)?.helper ?? "选择创建后账号的初始状态。"}
            </span>
          </div>
          <div className="admin-password-form__actions">
            <Button variant="ghost" type="button" onClick={closeCreateModal}>
              取消
            </Button>
            <Button variant="primary" type="submit" loading={createLoading}>
              创建用户
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={resetTarget !== null}
        onClose={closeResetModal}
        title="重置用户密码"
        size="sm"
      >
        <form className="admin-password-form" onSubmit={submitResetPassword}>
          {resetTarget && (
            <div className="admin-password-form__target">
              <strong>{resetTarget.name}</strong>
              {resetTarget.email}
            </div>
          )}
          {resetError && <div className="admin-feedback admin-feedback--error">{resetError}</div>}
          <Input
            label="新密码"
            type="password"
            minLength={8}
            value={resetPassword}
            onChange={(event) => setResetPassword(event.target.value)}
            required
          />
          <Input
            label="确认新密码"
            type="password"
            value={resetPasswordConfirm}
            onChange={(event) => setResetPasswordConfirm(event.target.value)}
            required
          />
          <div className="admin-password-form__actions">
            <Button variant="ghost" type="button" onClick={closeResetModal}>
              取消
            </Button>
            <Button variant="danger" type="submit" loading={resetLoading}>
              确认重置
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
