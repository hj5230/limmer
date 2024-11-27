type ExtractVariables<T extends string> =
  T extends `${string}{{${infer Param}}}${infer Rest}`
    ? Param | ExtractVariables<Rest>
    : never

type VariableMap<T extends string> = {
  [K in ExtractVariables<T>]: string
}

/**
 * 构建 prompt 字符串
 * @param template 包含变量占位符的模板字符串
 * @param variables 变量值映射对象
 * @throws {PromptError} 当变量不匹配时抛出错误
 */
export function buildPrompt<T extends string>(
  template: T,
  variables: VariableMap<T>,
): string {
  const matches = template.match(/\{\{([^}]+)\}\}/g) || []
  const placeholders = matches.map(m =>
    m.slice(2, -2).trim(),
  )

  const missingVars = placeholders.filter(
    key => !(key in variables),
  )
  const unusedVars = Object.keys(variables).filter(
    key => !placeholders.includes(key),
  )
  if (missingVars.length || unusedVars.length) {
    throw new Error()
  }

  return placeholders
    .reduce(
      (result, key) =>
        result.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
          variables[key as keyof typeof variables],
        ),
      template,
    )
    .replace(/\s+/g, ' ')
    .trim()
}
