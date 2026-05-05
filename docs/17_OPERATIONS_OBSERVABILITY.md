# 17 — 运维、日志、监控与审计

## 17.1 运维目标

平台上线后需要能回答：

- 当前 API 是否可用
- AI 调用是否失败率升高
- 邮件是否发送成功
- 哪个请求出错，对应用户是谁
- 哪个管理员修改了全局配置
- 数据库是否需要备份或扩容

## 17.2 健康检查

### GET `/api/v1/health`

返回：

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "ok",
    "uptime": 12345
  }
}
```

可选增加：

- SMTP 配置状态
- 默认全局模型配置状态
- 数据库延迟

## 17.3 RequestId

每个请求生成 `requestId`：

```http
X-Request-Id: req_...
```

前端错误提示可展示：

```text
请求编号：req_...
```

便于用户反馈时定位日志。

## 17.4 结构化日志

后端日志字段：

| 字段 | 说明 |
|------|------|
| `requestId` | 请求编号 |
| `method` | HTTP 方法 |
| `path` | 路径 |
| `statusCode` | 状态码 |
| `latencyMs` | 耗时 |
| `userId` | 登录用户 |
| `ip` | IP |
| `errorCode` | 业务错误码 |

日志必须脱敏敏感字段。

## 17.5 AI 观测

管理员后台统计：

- 今日调用量
- 成功率
- P50/P95 延迟
- Token 用量
- 失败错误码分布
- 全局模型使用量
- 用户模型测试失败次数

AI 调用异常告警条件：

- 5 分钟内失败率 > 30%
- 全局模型连续失败 > 5 次
- AI 平均延迟 > 30 秒

## 17.6 邮件观测

记录 `mail_events`：

- queued
- sent
- failed

管理员可筛选：

- 邮件类型
- 收件人
- 状态
- 时间范围

## 17.7 审计日志

审计日志与普通日志不同，需长期保留。

必须审计：

- 管理员登录
- 用户禁用/启用
- 用户角色变更
- 全局模型创建/更新/删除
- 全局 API Key 更新
- SMTP 配置更新
- 密码重置成功
- 密钥加密主版本变更

## 17.8 数据库维护

基础维护项：

- 每日备份
- 索引检查
- 慢查询检查
- 表大小监控
- 连接数监控

重点索引：

- `users.email`
- `refresh_tokens.user_id`
- `ai_model_configs.owner_user_id`
- `career_flow_runs.user_id`
- `career_flow_results.run_id`
- `resumes.user_id`
- `audit_logs.actor_user_id`
- `audit_logs.created_at`

## 17.9 事故处理

### AI 服务商故障

1. 管理员后台停用故障全局模型
2. 切换默认全局模型
3. 通知用户稍后重试
4. 保留失败日志便于回溯

### SMTP 故障

1. 测试 SMTP 配置
2. 查看 `mail_events`
3. 暂停强制邮箱验证或切换 SMTP
4. 故障恢复后补发关键邮件

### CORS 故障

1. 检查前端 Origin
2. 检查 `CORS_ORIGINS`
3. 检查 Cookie `SameSite=None; Secure`
4. 使用 OPTIONS 请求复现

