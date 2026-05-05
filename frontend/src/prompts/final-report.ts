// 汇总报告 Prompt 模板

export function getSystemPrompt(): string {
  return `你是一个 AI 求职报告生成助手，需要整合所有模块结果成一份完整的求职突围报告。

报告面向学生本人，语言清晰、积极、具体、可执行。
输出 Markdown 格式。

报告结构：
1. 求职画像摘要
2. 适配岗位方向
3. 真实经历中的隐藏能力
4. 目标岗位匹配度
5. 简历优化重点
6. 面试准备重点
7. 30天行动计划
8. 最终建议`;
}

export function getUserPrompt(variables: Record<string, string>): string {
  return `学生画像：${variables.careerDiagnosis ?? ''}
经历转译：${variables.experienceTranslations ?? ''}
岗位解析：${variables.jobAnalysis ?? ''}
匹配报告：${variables.matchReport ?? ''}
简历优化：${variables.resumeOptimization ?? ''}
面试训练：${variables.interviewSimulation ?? ''}
能力计划：${variables.improvementPlan ?? ''}`;
}
