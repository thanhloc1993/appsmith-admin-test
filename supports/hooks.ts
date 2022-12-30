import {
    Before,
    After,
    ITestCaseHookParameter,
    BeforeAll,
    AfterAll,
    Status,
} from '@cucumber/cucumber';
import { TestStepResultStatus } from '@cucumber/messages';

import { chromium } from 'playwright';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSJprepPage } from '@supports/cms-jprep';

import { CMSInterface } from './app-types';
import { CMS } from './cms-world';
import { initCucumber } from './global';
import { Learner } from './learner-world';
import './packages/expect-with-message';
import { Teacher } from './teacher-world';
import { UnleashAdmin } from './unleash-world';
import { timesheetIdsToBeDeletedAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { deleteTimesheetGRPC } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';

initCucumber();

// When using parallel mode, any BeforeAll and AfterAll hooks you have defined will run once per worker.
BeforeAll(async function () {
    _cucumber.counter = 0;
    _cucumber.skipAll = false;
    const workerID = Number(process.env.CUCUMBER_WORKER_ID) || 0;
    console.log(`launch new chromium instance for worker ${workerID}`);

    _cucumber.browser = await chromium.launch({
        headless: process.env.HEADLESS === 'true',
        timeout: 30000,
        channel: 'chrome',
        args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--unlimited-storage',
            '--full-memory-crash-report',
            '--disable-dev-shm-usage', //[Chrome to crash when rendering large pages](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#tips)
            '--enable-usermedia-screen-capturing',
            '--auto-select-desktop-capture-source=Entire screen',
            '--disk-cache-dir=/home/pwuser/.cache/google-chrome/Default',
        ],
    });
    _cucumber.startTime = Date.now();
});

AfterAll(async function () {
    if (_cucumber.browser && _cucumber.browser.isConnected()) await _cucumber.browser.close();
});

function loggingFeature(props: ITestCaseHookParameter): string[] {
    if (!props?.gherkinDocument || !props?.gherkinDocument?.feature) return [];
    const { uri, feature } = props?.gherkinDocument;
    const { name, tags = [] } = feature;

    const tagsString = tags.map((e: { name: string }) => e.name);

    console.log(`\nRunning feature: ${name}`);

    console.log(`File: ${uri}`);
    console.log(`Tags: ${tagsString.join(', ')}\n`);

    return tagsString;
}

Before(async function (props: ITestCaseHookParameter) {
    this.counter = _cucumber.counter;
    _cucumber.counter++;

    const workerID = Number(process.env.CUCUMBER_WORKER_ID) || 0;
    // add worker number to trace worker run on
    console.log(`Worker: ${workerID}\n`);

    const tags = loggingFeature(props);

    // Check feature flags config
    // only check if client key is not empty
    if (_cucumber.skipAll || (await featureFlagsHelper.isSkip(tags))) {
        _cucumber.skipAll = true;
        return Status.SKIPPED.toLocaleLowerCase();
    }
});

After(async function (props: ITestCaseHookParameter) {
    if (_cucumber.skipAll) {
        return Status.SKIPPED.toLocaleLowerCase();
    }
    loggingFeature(props);
    console.log('Result', props.result?.status);
    console.log('Duration', props.result?.duration);
    const duration = Date.now() - _cucumber.startTime;
    if (!_cucumber.skipAll && _cucumber.durationLimit > 0 && duration > _cucumber.durationLimit) {
        _cucumber.skipAll = true;
        const message = `Timeout Error: duration > ${(_cucumber.durationLimit / 60000).toFixed(
            2
        )} min.`;
        await this.attachMessageAndStatusInstance(message, TestStepResultStatus.FAILED);
    }
});

async function initialCMS(cms: CMSInterface) {
    //make sure already connect with EN version
    const page = cms.page!;

    await cms.attach(`URL is ${await page.url()}`);
    await cms.attachScreenshot();

    const switcherLocale = await page.waitForSelector(`[data-testid="LocaleSwitcher"]`);
    const language = await switcherLocale.innerText();

    await cms.attach(`Current language is ${language}`);
    await cms.attachScreenshot();

    if (language !== 'English') {
        await cms.attach('Switch language to English');
        await switcherLocale.click();
        const enBtn = await page.locator(
            `[data-testid="MenuComponent__popper"] button:has-text("English")`
        );
        await enBtn.click({ force: true });
        await cms.attachScreenshot();
    }
}

// ---CMS---
Before({ tags: '@cms', timeout: _cucumber.timeout }, async function () {
    this.cms = new CMS(this.options, {
        driverName: 'cms',
    });
    await this.cms.connect({ browser: _cucumber.browser });

    await initialCMS(this.cms);
});

After({ tags: '@cms', timeout: _cucumber.timeout }, async function () {
    if (this.cms) await this.cms.quit();
    return skipTestOrNot();
});

// ---CMS2---
Before({ tags: '@cms2', timeout: _cucumber.timeout }, async function () {
    this.cms2 = new CMS(this.options, {
        driverName: 'cms_2',
    });
    await this.cms2.connect({ browser: _cucumber.browser });
    await initialCMS(this.cms2);
});

After({ tags: '@cms2', timeout: _cucumber.timeout }, async function () {
    if (this.cms2) await this.cms2.quit();
    return skipTestOrNot();
});

// ---CMS3---
Before({ tags: '@cms3', timeout: _cucumber.timeout }, async function () {
    this.cms3 = new CMS(this.options, {
        driverName: 'cms_3',
    });
    await this.cms3.connect({ browser: _cucumber.browser });
    await initialCMS(this.cms3);
});

After({ tags: '@cms3', timeout: _cucumber.timeout }, async function () {
    if (this.cms3) await this.cms3.quit();
    return skipTestOrNot();
});

// ---CMS4---
Before({ tags: '@cms4', timeout: _cucumber.timeout }, async function () {
    this.cms4 = new CMS(this.options, {
        driverName: 'cms_4',
    });
    await this.cms4.connect({ browser: _cucumber.browser });

    await initialCMS(this.cms4);
});

After({ tags: '@cms4', timeout: _cucumber.timeout }, async function () {
    if (this.cms4) await this.cms4.quit();
    return skipTestOrNot();
});

// ---CMS for JPREP---
Before({ tags: '@cms-jprep', timeout: _cucumber.timeout }, async function () {
    this.cms = new CMS(this.options, {
        driverName: 'cms',
    });
    await this.cms.connect({ browser: _cucumber.browser });

    const jprepPage = new CMSJprepPage(this.cms);
    await jprepPage.initialCMS();
});

After({ tags: '@cms-jprep', timeout: _cucumber.timeout }, async function () {
    if (this.cms) await this.cms.quit();
    return skipTestOrNot();
});

// ---Teacher---
Before({ tags: '@teacher', timeout: _cucumber.timeout }, async function () {
    this.teacher = new Teacher(this.options, {
        driverName: 'teacher_1',
    });
    await this.teacher.connect({ browser: _cucumber.browser });
});

After({ tags: '@teacher', timeout: _cucumber.timeout }, async function () {
    if (this.teacher) await this.teacher.quit();
    return skipTestOrNot();
});

// ---Teacher 2---
Before({ tags: '@teacher2', timeout: _cucumber.timeout }, async function () {
    this.teacher2 = new Teacher(this.options, {
        driverName: 'teacher_2',
    });
    await this.teacher2.connect({ browser: _cucumber.browser });
});
After({ tags: '@teacher2', timeout: _cucumber.timeout }, async function () {
    if (this.teacher2) await this.teacher2.quit();
    return skipTestOrNot();
});

// ---Learner---
Before({ tags: '@learner', timeout: _cucumber.timeout }, async function () {
    this.learner = new Learner(this.options, {
        driverName: 'learner_1',
    });
    await this.learner.connect({ browser: _cucumber.browser });
});
After({ tags: '@learner', timeout: _cucumber.timeout }, async function () {
    if (this.learner) await this.learner.quit();
    return skipTestOrNot();
});

// ---Learner 2---
Before({ tags: '@learner2', timeout: _cucumber.timeout }, async function () {
    this.learner2 = new Learner(this.options, {
        driverName: 'learner_2',
    });
    await this.learner2.connect({ browser: _cucumber.browser });
});
After({ tags: '@learner2', timeout: _cucumber.timeout }, async function () {
    if (this.learner2) await this.learner2.quit();
    return skipTestOrNot();
});

// ---Learner 3---
Before({ tags: '@learner3', timeout: _cucumber.timeout }, async function () {
    this.learner3 = new Learner(this.options, {
        driverName: 'learner_3',
    });
    await this.learner3.connect({ browser: _cucumber.browser });
});
After({ tags: '@learner3', timeout: _cucumber.timeout }, async function () {
    if (this.learner3) await this.learner3.quit();
    return skipTestOrNot();
});

// ---Parent---
Before({ tags: '@parent', timeout: _cucumber.timeout }, async function () {
    this.parent = new Learner(this.options, {
        driverName: 'parent_1',
    });
    await this.parent.connect({ browser: _cucumber.browser });
});
After({ tags: '@parent', timeout: _cucumber.timeout }, async function () {
    if (this.parent) await this.parent.quit();
    return skipTestOrNot();
});

// ---Unleash admin---
Before({ tags: '@unleash-admin', timeout: _cucumber.timeout }, async function () {
    this.unleashAdmin = new UnleashAdmin(this.options, {
        driverName: 'unleash_admin',
    });
    await this.unleashAdmin.connect({ browser: _cucumber.browser });
});

After({ tags: '@unleash-admin', timeout: _cucumber.timeout }, async function () {
    const { context } = this.scenario;
    const featureFlagName = context.get('new_feature');
    if (featureFlagName !== '') {
        await this.unleashAdmin.archiveFeature(featureFlagName);
        context.set('new_feature', '');
    }
    if (this.unleashAdmin) await this.unleashAdmin.quit();
    return skipTestOrNot();
});

// ---Parent 2---
Before({ tags: '@parent2', timeout: _cucumber.timeout }, async function () {
    this.parent2 = new Learner(this.options, {
        driverName: 'parent_2',
    });
    await this.parent2.connect({ browser: _cucumber.browser });
});
After({ tags: '@parent2', timeout: _cucumber.timeout }, async function () {
    if (this.parent2) await this.parent2.quit();
    return skipTestOrNot();
});

After({ tags: '@timesheet', timeout: 180000 }, async function () {
    const context = this.scenario;
    const timesheetToBeDeleted = context.get<string[]>(timesheetIdsToBeDeletedAlias);
    await deleteTimesheetGRPC(this.cms, timesheetToBeDeleted);
});

const skipTestOrNot = (): string | undefined => {
    if (_cucumber.skipAll) {
        return Status.SKIPPED.toLocaleLowerCase();
    }
};

After(async function (testCase) {
    if (testCase.result?.status === Status.FAILED) {
        const drivers = [
            this.cms,
            this.cms2,
            this.cms3,
            this.cms4,
            this.teacher,
            this.teacher2,
            this.learner,
            this.learner2,
            this.learner3,
            this.parent,
            this.parent2,
        ];

        for (const driver of drivers) {
            if (driver != undefined) {
                await driver.attach(driver.driverName);
                await driver.attachScreenshot();
            }
        }
    }
});
