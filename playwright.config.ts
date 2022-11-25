// playwright.config.ts
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    timeout: 30000,
    globalTimeout: 600000,
    reporter: 'list',
    testDir: './test-suites',
    testMatch: /.*.ts/,
};
export default config;
