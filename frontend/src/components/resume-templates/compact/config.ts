import type { ResumeTemplate } from "@/types";

const compactConfig: ResumeTemplate = {
  id: "compact",
  name: "紧凑高效",
  description: "间距紧凑，信息密度高，适合咨询、金融等注重内容量的行业",
  thumbnail: "/templates/compact.svg",
  layout: "compact",
  colorScheme: {
    primary: "#1F2937",
    secondary: "#4B5563",
    background: "#FFFFFF",
    text: "#111827",
  },
  spacing: {
    sectionGap: 12,
    itemGap: 8,
    contentPadding: 32,
  },
};

export default compactConfig;
