import type { ResumeTemplate } from "@/types";

const boldHeaderConfig: ResumeTemplate = {
  id: "bold-header",
  name: "醒目头部",
  description: "顶部全宽渐变色条，姓名醒目突出，适合创意、设计、营销岗位",
  thumbnail: "/templates/bold-header.svg",
  layout: "bold-header",
  colorScheme: {
    primary: "#EC4899",
    secondary: "#F472B6",
    background: "#FFFFFF",
    text: "#1F2937",
  },
  spacing: {
    sectionGap: 18,
    itemGap: 10,
    contentPadding: 40,
  },
};

export default boldHeaderConfig;
