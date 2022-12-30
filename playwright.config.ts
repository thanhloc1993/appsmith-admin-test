// playwright.config.ts
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    timeout: 30000,
    globalTimeout: 600000,
    workers: 3,
    reporter: 'list',
    testDir: './test-suites/recorder/squads',
    testMatch: /.*.ts/,
};
export default config;
