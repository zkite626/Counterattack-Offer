import type { ResumeTemplate } from "@/types";

const sidebarConfig: ResumeTemplate = {
  id: "sidebar",
  name: "双栏侧边",
  description: "左右双栏布局，左侧放基本信息和技能，右侧放经历和项目",
  thumbnail: "/templates/sidebar.svg",
  layout: "sidebar",
  colorScheme: {
    primary: "#0D9488",
    secondary: "#14B8A6",
    background: "#FFFFFF",
    text: "#111827",
  },
  spacing: {
    sectionGap: 16,
    itemGap: 10,
    contentPadding: 0,
  },
};

export default sidebarConfig;
