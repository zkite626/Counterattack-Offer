import type { ResumeTemplate } from "@/types";

const minimalConfig: ResumeTemplate = {
  id: "minimal",
  name: "极简留白",
  description: "大量留白，细线分隔，极简主义，适合注重品味的创意岗位",
  thumbnail: "/templates/minimal.svg",
  layout: "minimal",
  colorScheme: {
    primary: "#171717",
    secondary: "#737373",
    background: "#FFFFFF",
    text: "#171717",
  },
  spacing: {
    sectionGap: 28,
    itemGap: 16,
    contentPadding: 52,
  },
};

export default minimalConfig;
