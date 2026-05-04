import { createElement, type FC, type ReactElement } from "react";
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
import minimalConfig from "./minimal/config";
import MinimalTemplate from "./minimal";
import timelineConfig from "./timeline/config";
import TimelineTemplate from "./timeline";
import techConfig from "./tech/config";
import TechTemplate from "./tech";

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
  { config: minimalConfig, Component: MinimalTemplate },
  { config: timelineConfig, Component: TimelineTemplate },
  { config: techConfig, Component: TechTemplate },
];

// 根据 layout 标识查找模板组件
export function getTemplateComponent(layout: string): FC<{ data: ResumeBuilderData; template: ResumeTemplate }> {
  return TEMPLATE_REGISTRY.find((e) => e.config.layout === layout)?.Component ?? ClassicTemplate;
}

// 直接渲染静态导入的模板组件，避免在渲染期间通过工厂函数创建组件引用。
export function renderResumeTemplate(
  layout: string,
  data: ResumeBuilderData,
  template: ResumeTemplate
): ReactElement {
  switch (layout) {
    case "modern":
      return createElement(ModernTemplate, { data, template });
    case "fresh-grad":
      return createElement(FreshGradTemplate, { data, template });
    case "sidebar":
      return createElement(SidebarTemplate, { data, template });
    case "elegant":
      return createElement(ElegantTemplate, { data, template });
    case "compact":
      return createElement(CompactTemplate, { data, template });
    case "bold-header":
      return createElement(BoldHeaderTemplate, { data, template });
    case "minimal":
      return createElement(MinimalTemplate, { data, template });
    case "timeline":
      return createElement(TimelineTemplate, { data, template });
    case "tech":
      return createElement(TechTemplate, { data, template });
    case "classic":
    default:
      return createElement(ClassicTemplate, { data, template });
  }
}

// 导出所有模板配置
export const RESUME_TEMPLATES: ResumeTemplate[] = TEMPLATE_REGISTRY.map((e) => e.config);
