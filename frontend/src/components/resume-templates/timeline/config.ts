import type { ResumeTemplate } from "@/types";

const timelineConfig: ResumeTemplate = {
  id: "timeline",
  name: "时间轴",
  description: "左侧时间轴连接各模块，动态感强，适合展示成长轨迹",
  thumbnail: "/templates/timeline.svg",
  layout: "timeline",
  colorScheme: {
    primary: "#059669",
    secondary: "#34D399",
    background: "#FFFFFF",
    text: "#111827",
  },
  spacing: {
    sectionGap: 20,
    itemGap: 12,
    contentPadding: 40,
  },
};

export default timelineConfig;
