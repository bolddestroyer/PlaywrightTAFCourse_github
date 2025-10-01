import { BASE_URL } from '@_config/env.config';
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export const STORAGE_STATE = path.join(__dirname, 'tmp/session.json');
export const RESPONSE_TIMEOUT = 10_000;

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./config/global.setup.ts'),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: './playwright-report/results.json' }],
    ['junit', { outputFile: './playwright-report/results.xml' }],
  ],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 0,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'health',
      testMatch: '*.health.ts',
    },
    {
      name: 'api',
      testDir: 'tests/api',
      dependencies: ['health'],
    },
    {
      name: 'chromium-non-logged',
      grepInvert: /@logged/,
      testDir: 'tests/ui',
      dependencies: ['health'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup',
      dependencies: ['health'],
      testMatch: '*.setup.ts',
    },
    {
      name: 'chromium-logged',
      grep: /@logged/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        // Session state file from project 'setup' is used for each test case separately
        storageState: STORAGE_STATE,
      },
    },
  ],
});
