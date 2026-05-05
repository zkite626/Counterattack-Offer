// Prompt 模板构建工具

/**
 * 替换模板中的 {{variable}} 占位符
 */
export function buildPrompt(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? '');
}
