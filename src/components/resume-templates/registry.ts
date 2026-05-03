import type { FC } from "react";
import type { ResumeBuilderData, ResumeTemplate } from "@/types";
import classicConfig from "./classic/config";
import ClassicTemplate from "./classic";
import modernConfig from "./modern/config";
import ModernTemplate from "./modern";
import freshGradConfig from "./fresh-grad/config";
import FreshGradTemplate from "./fresh-grad";
import sidebarConfig from "./sidebar/config";
import SidebarTemplate from "./sidebar";
import elegantConfig from "./elegant/config";
import ElegantTemplate from "./elegant";
import compactConfig from "./compact/config";
import CompactTemplate from "./compact";
import boldHeaderConfig from "./bold-header/config";
import BoldHeaderTemplate from "./bold-header";

// 模板注册表条目
export interface TemplateRegistryEntry {
  config: ResumeTemplate;
  Component: FC<{ data: ResumeBuilderData; template: ResumeTemplate }>;
}

// 模板注册表
export const TEMPLATE_REGISTRY: TemplateRegistryEntry[] = [
  { config: classicConfig, Component: ClassicTemplate },
  { config: modernConfig, Component: ModernTemplate },
  { config: freshGradConfig, Component: FreshGradTemplate },
  { config: sidebarConfig, Component: SidebarTemplate },
  { config: elegantConfig, Component: ElegantTemplate },
  { config: compactConfig, Component: CompactTemplate },
  { config: boldHeaderConfig, Component: BoldHeaderTemplate },
];

// 根据 layout 标识查找模板组件
export function getTemplateComponent(layout: string): FC<{ data: ResumeBuilderData; template: ResumeTemplate }> {
  return TEMPLATE_REGISTRY.find((e) => e.config.layout === layout)?.Component ?? ClassicTemplate;
}

// 导出所有模板配置
export const RESUME_TEMPLATES: ResumeTemplate[] = TEMPLATE_REGISTRY.map((e) => e.config);
