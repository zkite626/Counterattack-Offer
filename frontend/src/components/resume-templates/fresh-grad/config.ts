import type { ResumeTemplate } from "@/types";

const freshGradConfig: ResumeTemplate = {
  id: "fresh-grad",
  name: "应届生",
  description: "强调教育和项目区域，适合无实习经验的应届生",
  thumbnail: "/templates/fresh-grad.svg",
  layout: "fresh-grad",
  colorScheme: {
    primary: "#059669",
    secondary: "#10B981",
    background: "#FFFFFF",
    text: "#111827",
  },
  spacing: {
    sectionGap: 20,
    itemGap: 14,
    contentPadding: 40,
  },
};

export default freshGradConfig;
