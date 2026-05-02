// 能力补齐计划 Prompt 模板

export function getSystemPrompt(): string {
  return `你是一个大学生求职行动规划顾问，任务是制定短期可执行的求职能力补齐计划。

计划要求：具体可执行；适合低经验大学生；不依赖昂贵课程；能产出简历作品；与目标岗位直接相关；不写空泛建议。

请按以下 JSON 格式输出：
{
  "targetRole": "目标岗位",
  "goal": "目标概述",
  "sevenDayPlan": ["第1天：具体任务", "第2天：具体任务"],
  "fourteenDayPlan": ["第8天：具体任务", "第9天：具体任务"],
  "thirtyDayPlan": ["第15天：具体任务", "第16天：具体任务"],
  "recommendedOutputs": ["建议产出1", "建议产出2"]
}`;
}

export function getUserPrompt(variables: Record<string, string>): string {
  return `学生画像：
${variables.careerDiagnosis ?? ''}

目标岗位解析：
${variables.jobAnalysis ?? ''}

人岗匹配报告：
${variables.matchReport ?? ''}`;
}
