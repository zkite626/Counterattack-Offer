"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { adminApi, type AdminUser } from "@/lib/api/admin";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";

function formatError(error: unknown): string {
  if (error instanceof ApiError) {
    return `${error.message}${error.requestId ? `（requestId: ${error.requestId}）` : ""}`;
  }
  return error instanceof Error ? error.message : "加载失败";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.listUsers();
      setUsers(result.items);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleUser(user: AdminUser) {
    if (!window.confirm(`确定${user.status === "disabled" ? "启用" : "禁用"} ${user.email}？`)) return;
    try {
      if (user.status === "disabled") {
        await adminApi.enableUser(user.id);
      } else {
        await adminApi.disableUser(user.id);
      }
      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">用户管理</h1>
          <p className="admin-page__subtitle">查看用户状态、角色和基础运营指标</p>
        </div>
        <Button variant="secondary" onClick={loadUsers} loading={loading}>刷新</Button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>角色</th>
              <th>状态</th>
              <th>邮箱验证</th>
              <th>注册时间</th>
              <th>最近登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                  <div className="admin-muted">{user.email}</div>
                </td>
                <td><Tag size="sm">{user.role}</Tag></td>
                <td><Tag size="sm" variant={user.status === "disabled" ? "danger" : "success"}>{user.status}</Tag></td>
                <td>{user.emailVerifiedAt ? "已验证" : "未验证"}</td>
                <td>{new Date(user.createdAt).toLocaleString("zh-CN")}</td>
                <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("zh-CN") : "暂无"}</td>
                <td>
                  <Button size="sm" variant={user.status === "disabled" ? "secondary" : "danger"} onClick={() => toggleUser(user)}>
                    {user.status === "disabled" ? "启用" : "禁用"}
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan={7}>暂无用户数据</td></tr>
            )}
            {loading && <tr><td colSpan={7}>加载中...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
