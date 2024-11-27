/* eslint-disable @typescript-eslint/no-require-imports */
const globals = require('globals')
const pluginJs = require('@eslint/js')
const tseslint = require('typescript-eslint')
const prettier = require('eslint-config-prettier')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = [
  { files: ['**/*.{ts, tsx, json}'] },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    languageOptions: {
      globals: globals.commonjs,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]
