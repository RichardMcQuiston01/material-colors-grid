import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/', 'coverage/', 'node_modules/']),
  js.configs.recommended,
  ts.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { 'no-undef': 'off' },
  },
);
