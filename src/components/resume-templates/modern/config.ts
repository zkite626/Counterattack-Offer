import type { ResumeTemplate } from "@/types";

const modernConfig: ResumeTemplate = {
  id: "modern",
  name: "现代",
  description: "现代风格，主题色高亮，视觉感强，适合互联网岗位",
  thumbnail: "/templates/modern.svg",
  layout: "modern",
  colorScheme: {
    primary: "#6366F1",
    secondary: "#818CF8",
    background: "#FFFFFF",
    text: "#111827",
  },
  spacing: {
    sectionGap: 20,
    itemGap: 12,
    contentPadding: 40,
  },
};

export default modernConfig;
