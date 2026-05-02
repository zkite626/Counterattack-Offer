# Wave 6 Codex 提示词 — 测试 + 部署 + 性能优化

```
你是一个资深全栈工程师，正在为《逆袭Offer》Web MVP 完成最终的测试、部署和性能优化。

## 必读文档

- AGENTS.md（开发规则）
- docs/14_TEST_ACCEPTANCE.md（测试验收清单）
- docs/15_DEPLOYMENT_GUIDE.md（部署指南）
- docs/16_SECURITY_NOTES.md（安全注意事项）

## 前置条件

Wave 1-5 已完成，所有功能和视觉均已就绪。

## Wave 6 任务

### 任务 6.1：E2E 全流程测试

手动走通完整流程并修复问题：
1. 访问首页 → 点击"开始求职突围" → 跳转登录页
2. 注册新账户 → 自动登录 → 跳转到 Profile 页
3. 进入设置页 → 添加 DeepSeek 模型 → 输入 API Key → 测试连接
4. 返回 Profile → 一键导入李同学 → 表单填充
5. 点击"开始AI诊断" → 等待 AI 返回 → 查看画像结果
6. 进入经历转译 → AI 生成 → 查看卡片
7. 进入 JD 解析 → 填入示例 JD → AI 解析
8. 进入人岗匹配 → AI 生成匹配报告 → 雷达图+分数
9. 进入简历优化 → AI 生成优化建议 → 前后对比
10. 进入面试训练 → AI 生成面试题 → 尝试对话模式
11. 进入能力计划 → AI 生成时间轴
12. 进入汇总报告 → 查看完整报告

记录并修复发现的所有 Bug。

### 任务 6.2：错误边界处理

确保以下场景有友好提示：
- AI 调用超时（60s 超时提示）
- AI 返回非 JSON（解析错误提示）
- API Key 无效（401 错误提示）
- 网络断开（网络错误提示）
- 未配置模型（引导去设置页）
- 前置步骤未完成（引导去完成）

为所有功能页添加 ErrorBoundary 组件。

### 任务 6.3：Lighthouse 性能优化

目标：Performance > 85, Accessibility > 90, Best Practices > 90, SEO > 90

优化措施：
- 图片使用 next/image 优化
- 字体 preconnect + display=swap
- 避免 Layout Shift
- 代码分割（dynamic import 非首屏组件）
- 减少 CSS 文件大小
- 压缩图标

### 任务 6.4：README.md

创建/更新 `README.md`，包含：

1. 项目简介（中文）
2. 核心功能列表
3. 技术栈
4. 在线演示地址（如有）
5. 本地启动步骤
6. 环境变量说明
7. AI 模型配置说明
8. 项目目录结构
9. Demo 演示流程
10. 参赛信息
11. License

### 任务 6.5：Vercel 部署

1. 确保 `next.config.ts` 正确配置
2. 创建 `.env.local.example`
3. 确保 `npm run build` 无错误
4. 部署到 Vercel
5. 验证线上可访问

### 任务 6.6：安全检查

- 确认 .env.local 在 .gitignore 中
- 确认无硬编码 API Key
- 确认无 console.log 泄露敏感信息
- 确认 JWT Cookie 配置正确

### 任务 6.7：最终清理

- 删除无用代码和注释
- 统一代码格式（eslint fix）
- 确保所有页面有 Loading 状态
- 确保所有按钮有 disabled 状态
- 检查所有中文文案无错别字

## 验收标准

1. 完整 E2E 流程无 Bug
2. Lighthouse 四项均 > 85
3. Vercel 部署成功可访问
4. README 完整专业
5. 无安全漏洞
6. 代码整洁无冗余
```
