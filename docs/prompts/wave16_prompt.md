# Wave 16 开发提示词 — 安全加固 + 运维观测

```
你是一个资深安全与平台工程师，正在为《逆袭Offer》完成上线后的安全加固和可观测能力。

## 必读文档

- AGENTS.md
- docs/14_TEST_ACCEPTANCE.md
- docs/15_DEPLOYMENT_GUIDE.md
- docs/16_SECURITY_NOTES.md
- docs/17_OPERATIONS_OBSERVABILITY.md

## 技能辅助建议

鼓励根据任务使用相关 Codex Skills/Plugins 辅助开发。本 Wave 涉及限流、审计、日志脱敏、备份恢复和线上观测，可优先使用系统化调试、安全检查、验证、代码审查和 CI/运维排障相关技能；技能建议必须服务于可观测、可回滚和可审计目标。

## 目标

1. 登录、注册、AI、邮件接口具备限流能力
2. 敏感操作审计完整
3. 日志结构化且脱敏
4. RequestId 能贯穿前端错误和后端日志
5. 数据库备份和恢复演练可执行

## 任务

### 16.1 限流

- 登录 5 次/分钟/IP + 邮箱
- 注册 3 次/小时/IP
- 找回密码 3 次/小时/邮箱
- 模型测试 10 次/小时/用户
- AI 调用 60 次/小时/用户

### 16.2 审计日志

- 用户禁用/启用
- 角色变更
- 全局模型变更
- API Key 更新
- SMTP 配置变更
- 管理员登录

### 16.3 日志脱敏

- Authorization
- Cookie
- apiKey
- password
- token
- encrypted secrets

### 16.4 观测面板

- AI 调用成功率
- AI 延迟 P50/P95
- SMTP 发送成功率
- 登录失败次数
- API 错误码分布

### 16.5 备份恢复

- PostgreSQL 备份脚本
- 测试库恢复流程
- 恢复演练记录模板

## 验收标准

- 超限接口返回 `RATE_LIMITED`
- 日志中无 API Key、SMTP 密码、Token 明文
- 前端错误展示 requestId
- 管理员后台可查审计日志
- 数据库备份可恢复到测试库
```
