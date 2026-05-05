import type { ResumeTemplate } from "@/types";

const techConfig: ResumeTemplate = {
  id: "tech",
  name: "科技感",
  description: "深色头部，技术风格，适合程序员、数据分析师等技术岗位",
  thumbnail: "/templates/tech.svg",
  layout: "tech",
  colorScheme: {
    primary: "#0EA5E9",
    secondary: "#38BDF8",
    background: "#FFFFFF",
    text: "#0F172A",
  },
  spacing: {
    sectionGap: 18,
    itemGap: 10,
    contentPadding: 36,
  },
};

export default techConfig;
