"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { adminApi, type AuditLog } from "@/lib/api/admin";
import Button from "@/components/ui/Button";

function formatError(error: unknown): string {
  if (error instanceof ApiError) return `${error.message}${error.requestId ? `（requestId: ${error.requestId}）` : ""}`;
  return error instanceof Error ? error.message : "加载失败";
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.listAuditLogs();
      setLogs(result.items);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">审计日志</h1>
          <p className="admin-page__subtitle">敏感操作、模型配置和 SMTP 测试记录</p>
        </div>
        <Button variant="secondary" onClick={loadLogs} loading={loading}>刷新</Button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>时间</th><th>操作</th><th>目标</th><th>操作者</th><th>摘要</th></tr></thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString("zh-CN")}</td>
                <td>{log.action}</td>
                <td>{log.targetType}{log.targetId ? ` / ${log.targetId}` : ""}</td>
                <td>{log.actorUserId ?? "系统"}</td>
                <td><code>{JSON.stringify(log.metadata)}</code></td>
              </tr>
            ))}
            {!loading && logs.length === 0 && <tr><td colSpan={5}>暂无审计日志</td></tr>}
            {loading && <tr><td colSpan={5}>加载中...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
