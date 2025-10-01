import * as pluginJs from '@eslint/js';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import * as globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { ignores: ['package-lock.json', 'playwright-report/*', 'test-results/*'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'] },
  {
    languageOptions: {
      globals: globals.node,
      // Hide "WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree"
      //parserOptions: {warnOnUnsupportedTypeScriptVersion: false},
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  eslintPluginPlaywright.configs['flat/recommended'],
  {
    rules: {
      'playwright/no-nested-step': 'off',
    },
    settings: {
      playwright: {
        globalAliases: {
          // This way "Expect must be inside of a test block" error is resolved
          test: ['setup', 'health'],
        },
      },
    },
  },
  eslintPluginPrettierRecommended,
]);
