type ExtractVariables<T extends string> =
  T extends `${string}{{${infer Param}}}${infer Rest}`
    ? Param | ExtractVariables<Rest>
    : never

type VariableMap<T extends string> = {
  [K in ExtractVariables<T>]: string
}

/**
 * Construct a prompt from a template string and a variable map.
 * @param template template string contains placeholders
 * @param variables variable map
 * @throws {Error} throw error when placeholders and variables don't exactly match
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
