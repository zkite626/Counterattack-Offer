import type { ResumeTemplate } from "@/types";

const elegantConfig: ResumeTemplate = {
  id: "elegant",
  name: "优雅简约",
  description: "精致排版，适合设计师、市场营销等需要展现品味的岗位",
  thumbnail: "/templates/elegant.svg",
  layout: "elegant",
  colorScheme: {
    primary: "#7C3AED",
    secondary: "#A78BFA",
    background: "#FFFFFF",
    text: "#1F2937",
  },
  spacing: {
    sectionGap: 20,
    itemGap: 12,
    contentPadding: 44,
  },
};

export default elegantConfig;
