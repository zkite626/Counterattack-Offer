// 基本信息
export interface ResumeBasicInfo {
  name: string;
  title: string;                // 求职意向
  email: string;
  phone: string;
  location: string;
  birthDate?: string;
  photo?: string;               // Base64 头像
  customFields: ResumeCustomField[];
}

export interface ResumeCustomField {
  id: string;
  label: string;
  value: string;
  visible: boolean;
}

// 教育经历
export interface ResumeEducation {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;          // 纯文本
  visible: boolean;
}

// 工作/实习经历
export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;          // 纯文本
  visible: boolean;
}

// 项目经历
export interface ResumeProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;          // 纯文本
  link?: string;
  visible: boolean;
}

// 简历模块
export interface ResumeSection {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  order: number;
}

// 全局设置
export interface ResumeGlobalSettings {
  themeColor: string;            // 主题色
  fontFamily: string;            // 字体
  baseFontSize: number;          // 基础字号(px)
  pagePadding: number;           // 页边距(px)
  sectionSpacing: number;        // 模块间距(px)
  lineHeight: number;            // 行高
}

// 模板配置
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;             // 模板缩略图路径
  layout: string;                // 布局标识
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    contentPadding: number;
  };
}

// 完整简历数据
export interface ResumeBuilderData {
  id: string;
  title: string;                 // 简历标题
  createdAt: string;
  updatedAt: string;
  templateId: string;
  basic: ResumeBasicInfo;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: string;                // 技能描述（纯文本）
  selfEvaluation: string;        // 自我评价（纯文本）
  sections: ResumeSection[];     // 模块配置（排序+显隐）
  globalSettings: ResumeGlobalSettings;
}

// 默认模块配置
export const DEFAULT_RESUME_SECTIONS: ResumeSection[] = [
  { id: 'basic', title: '基本信息', icon: 'user', enabled: true, order: 0 },
  { id: 'education', title: '教育经历', icon: 'flag', enabled: true, order: 1 },
  { id: 'experience', title: '实习/工作经历', icon: 'briefcase', enabled: true, order: 2 },
  { id: 'projects', title: '项目经历', icon: 'rocket', enabled: true, order: 3 },
  { id: 'skills', title: '专业技能', icon: 'lightning', enabled: true, order: 4 },
  { id: 'selfEvaluation', title: '自我评价', icon: 'chat', enabled: false, order: 5 },
];

// 默认全局设置
export const DEFAULT_GLOBAL_SETTINGS: ResumeGlobalSettings = {
  themeColor: '#6366F1',
  fontFamily: 'Inter, Noto Sans SC, sans-serif',
  baseFontSize: 14,
  pagePadding: 40,
  sectionSpacing: 16,
  lineHeight: 1.5,
};
