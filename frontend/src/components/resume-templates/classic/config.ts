import type { ResumeTemplate } from "@/types";

const classicConfig: ResumeTemplate = {
  id: "classic",
  name: "经典",
  description: "标准单栏，传统简约，ATS 友好，适合通用求职",
  thumbnail: "/templates/classic.svg",
  layout: "classic",
  colorScheme: {
    primary: "#111827",
    secondary: "#374151",
    background: "#FFFFFF",
    text: "#111827",
  },
  spacing: {
    sectionGap: 20,
    itemGap: 12,
    contentPadding: 40,
  },
};

export default classicConfig;
