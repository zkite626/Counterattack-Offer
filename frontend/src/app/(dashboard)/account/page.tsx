"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from "@/lib/labels";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import Tag from "@/components/ui/Tag";
import "./account.css";

type NoticeType = "success" | "error" | "info";

interface Notice {
  type: NoticeType;
  message: string;
}

function formatDate(value: string | null): string {
  if (value === null) return "暂无记录";
  return new Date(value).toLocaleString("zh-CN");
}

function formatError(error: unknown): string {
  if (error instanceof ApiError) {
    return `${error.message}${error.requestId ? `（请求编号：${error.requestId}）` : ""}`;
  }
  return error instanceof Error ? error.message : "操作失败，请稍后重试";
}

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: "",
  });

  if (user === null) {
    return (
      <div className="account-page">
        <Card className="account-page__empty">账号信息加载中...</Card>
      </div>
    );
  }

  async function handleResendVerification() {
    setSendingVerification(true);
    setNotice(null);
    try {
      const result = await authApi.resendVerification();
      setNotice({ type: "success", message: result.message });
    } catch (error) {
      setNotice({ type: "error", message: formatError(error) });
    } finally {
      setSendingVerification(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    if (passwordForm.newPassword.length < 8) {
      setNotice({ type: "error", message: "新密码至少需要 8 位" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotice({ type: "error", message: "两次输入的新密码不一致" });
      return;
    }

    setSavingPassword(true);
    try {
      const result = await authApi.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setNotice({ type: "success", message: result.message });
    } catch (error) {
      setNotice({ type: "error", message: formatError(error) });
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    if (!emailForm.newEmail.includes("@")) {
      setNotice({ type: "error", message: "请填写有效的新邮箱地址" });
      return;
    }

    setSavingEmail(true);
    try {
      const result = await authApi.changeEmail(
        emailForm.currentPassword,
        emailForm.newEmail,
      );
      setEmailForm({ newEmail: "", currentPassword: "" });
      await refreshUser();
      setNotice({ type: "success", message: result.message });
    } catch (error) {
      setNotice({ type: "error", message: formatError(error) });
    } finally {
      setSavingEmail(false);
    }
  }

  return (
    <div className="account-page">
      <div className="account-page__header">
        <div>
          <h1 className="account-page__title">账号中心</h1>
          <p className="account-page__subtitle">
            查看账号状态，维护登录邮箱和密码。
          </p>
        </div>
        <Tag variant={user.emailVerifiedAt ? "success" : "warning"} size="md">
          {user.emailVerifiedAt ? "邮箱已验证" : "邮箱待验证"}
        </Tag>
      </div>

      {notice && (
        <div className={`account-page__notice account-page__notice--${notice.type}`}>
          {notice.message}
        </div>
      )}

      <section className="account-page__hero">
        <div className="account-page__avatar" aria-hidden="true">
          {user.name.charAt(0)}
        </div>
        <div className="account-page__identity">
          <h2 className="account-page__name">{user.name}</h2>
          <p className="account-page__email">{user.email}</p>
          <div className="account-page__chips">
            <Tag size="sm">{USER_ROLE_LABELS[user.role]}</Tag>
            <Tag
              size="sm"
              variant={user.status === "active" ? "success" : user.status === "disabled" ? "danger" : "warning"}
            >
              {USER_STATUS_LABELS[user.status]}
            </Tag>
          </div>
        </div>
        {!user.emailVerifiedAt && (
          <Button
            variant="secondary"
            size="sm"
            loading={sendingVerification}
            icon={<Icon name="mail" size="1em" />}
            onClick={handleResendVerification}
          >
            重发验证邮件
          </Button>
        )}
      </section>

      <section className="account-page__grid">
        <Card className="account-page__info-card">
          <div className="account-page__card-title">
            <Icon name="user" size="1.1em" />
            账号信息
          </div>
          <dl className="account-page__details">
            <div>
              <dt>账号 ID</dt>
              <dd>{user.id}</dd>
            </div>
            <div>
              <dt>注册时间</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt>最近登录</dt>
              <dd>{formatDate(user.lastLoginAt)}</dd>
            </div>
            <div>
              <dt>资料更新时间</dt>
              <dd>{formatDate(user.updatedAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card className="account-page__info-card">
          <div className="account-page__card-title">
            <Icon name="shield" size="1.1em" />
            安全状态
          </div>
          <div className="account-page__security-list">
            <div className="account-page__security-item">
              <span>登录密码</span>
              <Tag variant="success" size="sm">已设置</Tag>
            </div>
            <div className="account-page__security-item">
              <span>邮箱验证</span>
              <Tag variant={user.emailVerifiedAt ? "success" : "warning"} size="sm">
                {user.emailVerifiedAt ? "已完成" : "待完成"}
              </Tag>
            </div>
            <div className="account-page__security-item">
              <span>账号状态</span>
              <Tag
                variant={user.status === "active" ? "success" : user.status === "disabled" ? "danger" : "warning"}
                size="sm"
              >
                {USER_STATUS_LABELS[user.status]}
              </Tag>
            </div>
          </div>
        </Card>
      </section>

      <section className="account-page__forms">
        <Card className="account-page__form-card">
          <div className="account-page__card-title">
            <Icon name="key" size="1.1em" />
            修改密码
          </div>
          <form className="account-page__form" onSubmit={handlePasswordSubmit}>
            <Input
              id="account-current-password"
              label="当前密码"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
              required
            />
            <Input
              id="account-new-password"
              label="新密码"
              type="password"
              minLength={8}
              helper="至少 8 位，建议包含大小写字母、数字和符号。"
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
              required
            />
            <Input
              id="account-confirm-password"
              label="确认新密码"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              required
            />
            <Button type="submit" loading={savingPassword}>
              保存新密码
            </Button>
          </form>
        </Card>

        <Card className="account-page__form-card">
          <div className="account-page__card-title">
            <Icon name="mail" size="1.1em" />
            修改邮箱
          </div>
          <form className="account-page__form" onSubmit={handleEmailSubmit}>
            <Input
              id="account-new-email"
              label="新邮箱"
              type="email"
              placeholder="name@example.com"
              value={emailForm.newEmail}
              onChange={(event) => setEmailForm((prev) => ({ ...prev, newEmail: event.target.value }))}
              required
            />
            <Input
              id="account-email-current-password"
              label="当前登录密码"
              type="password"
              value={emailForm.currentPassword}
              onChange={(event) => setEmailForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
              required
            />
            <p className="account-page__form-note">
              修改邮箱后需要前往新邮箱完成验证。
            </p>
            <Button type="submit" loading={savingEmail}>
              保存新邮箱
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
