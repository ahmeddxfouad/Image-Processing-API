import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // Ignore build + deps
  { ignores: ['dist/**', 'node_modules/**'] },

  // JS recommended base
  js.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module', ecmaVersion: 'latest' },
      globals: { ...globals.node },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  // Plain JS / CJS helpers (Node globals)
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Test overrides: allow Jasmine globals & relax strict rules in tests
  {
    files: ['src/tests/**/*.ts', 'spec/**/*.ts', 'spec/support/**/*.cjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jasmine },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
