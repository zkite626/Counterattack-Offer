import type { StudentProfile } from "@/types/student";

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  id: "demo-student-001",
  name: "李同学",
  schoolType: "普通本科",
  major: "市场营销",
  grade: "大四",
  targetCities: ["杭州", "上海", "深圳"],
  targetRoles: ["运营助理", "用户运营", "产品助理"],
  educationBackground: "本科，市场营销专业",
  rawExperiences: [
    "大二时在学校新媒体社团做过宣传，负责公众号推文排版和活动海报文案。",
    "市场调研课程中，小组做过一个关于校园二手交易需求的问卷调查，我负责收集问卷和整理结果。",
    "寒假在奶茶店做过兼职，负责点单、收银、客户沟通。",
    "参加过一次创新创业比赛，但没有获奖，项目是校园闲置物品交换平台。",
    "英语四级，熟悉 Excel、PPT，会使用剪映和基础设计工具。",
  ],
  skills: ["Excel", "PPT", "剪映", "公众号排版", "问卷整理"],
  weaknesses: ["没有正式实习", "项目经历少", "不清楚适合岗位", "面试紧张"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_JOB_DESCRIPTION = `岗位名称：用户运营实习生
岗位职责：
1. 负责社群用户日常维护，提升用户活跃度；
2. 协助完成用户调研、反馈收集和数据整理；
3. 参与活动策划与内容发布；
4. 支持运营数据统计和复盘。

任职要求：
1. 本科及以上在读，专业不限；
2. 有社团、活动运营、新媒体运营经验优先；
3. 具备良好的沟通表达能力和执行力；
4. 熟悉 Excel、PPT、问卷工具者优先；
5. 对互联网产品和用户增长感兴趣。`;
