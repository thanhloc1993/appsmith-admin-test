import { Given, Then, When } from '@cucumber/cucumber';

import { FeatureFlagsConstants } from '@drivers/feature-flags/constants';

import { IMasterWorld, UnleashAdminInterface } from '@supports/app-types';

import path from 'path';
import { delay, genId } from 'step-definitions/utils';

Given(
    'Create new feature flag with {string} and {string}',
    async function (this: IMasterWorld, envs: string, orgs: string) {
        const unleash = this.unleashAdmin;
        const { context } = this.scenario;
        const feature = `feature_${genId()}`;
        context.set('new_feature', feature);
        await unleash.instruction('Create feature', async function (this: UnleashAdminInterface) {
            await unleash.page?.click('[data-test="NAVIGATE_TO_CREATE_FEATURE"]');
            await unleash.page?.fill('input[type="text"]', feature);
        });
        await unleash.page?.click('[data-test="CF_CREATE_BTN_ID"]', { force: true });
        await unleash.page?.click('button[role="tab"]:has-text("Strategies")');
        if (envs.length > 0) {
            const envValues = envs.split(',');
            await unleash.instruction(
                `Add ${envs} for strategy_environment Strategy`,
                async function (this: UnleashAdminInterface) {
                    await unleash.page?.locator('[data-test="ADD_NEW_STRATEGY_ID"]').click();
                    await unleash.page
                        ?.locator('[data-test="ADD_NEW_STRATEGY_CARD_BUTTON_ID-6"]')
                        .click();
                    for (let index = 0; index < envValues.length; index++) {
                        const env = envValues[index];
                        // Fill input[name="input_field"]
                        await unleash.page?.fill('input[name="input_field"]', env);
                        // Click div[role="dialog"] button:has-text("Add")
                        await unleash.page
                            ?.locator('[data-test="ADD_TO_STRATEGY_INPUT_LIST"]')
                            .click();
                    }
                }
            );
            await unleash.instruction('Click save', async function (this: UnleashAdminInterface) {
                await unleash.page?.locator('[data-test="ADD_NEW_STRATEGY_SAVE_ID"]').click();
            });
        }
        if (orgs.length > 0) {
            const orgValues = orgs.split(',');

            await unleash.instruction(
                `Add ${orgs} for strategy_organization Strategy`,
                async function (this: UnleashAdminInterface) {
                    await unleash.page?.locator('[data-test="ADD_NEW_STRATEGY_ID"]').click();
                    await unleash.page
                        ?.locator('[data-test="ADD_NEW_STRATEGY_CARD_BUTTON_ID-7"]')
                        .click();

                    for (let index = 0; index < orgValues.length; index++) {
                        const org = orgValues[index];
                        // Fill input[name="input_field"]
                        await unleash.page?.fill('input[name="input_field"]', org);
                        // Click div[role="dialog"] button:has-text("Add")
                        await unleash.page
                            ?.locator('[data-test="ADD_TO_STRATEGY_INPUT_LIST"]')
                            .click();
                    }
                }
            );
            await unleash.instruction('Click save', async function (this: UnleashAdminInterface) {
                await unleash.page?.locator('[data-test="ADD_NEW_STRATEGY_SAVE_ID"]').click();
            });
        }
        await unleash.page?.locator('text=Feature toggles').click();
        await unleash.page?.reload();
    }
);

When('I {string} that feature', async function (this: IMasterWorld, action: string) {
    const unleash = this.unleashAdmin;
    const { context } = this.scenario;
    const feature = context.get('new_feature');
    await unleash.instruction('click toggle button', async function (this: UnleashAdminInterface) {
        await this.page?.click(`text=${feature}`);
        try {
            const status = action.charAt(0).toUpperCase() + action.slice(1) + 'd';
            await this.page?.waitForSelector(`text=${status}`, {
                timeout: 10000,
            });
        } catch (e) {
            await this.page?.click('input[type="checkbox"]');
        }
    });
});

Then(
    'see that feature is {string} on unleash proxy client with {string} and {string}',
    async function (this: IMasterWorld, status: string, env: string, org: string) {
        const { context } = this.scenario;
        const feature = context.get('new_feature');
        const unleashClient = await this.unleashAdmin.browser?.newPage();
        await unleashClient?.goto(
            `file:${path.resolve(
                process.cwd(),
                `./supports/feature-flags/proxy-client/index.html?url=${FeatureFlagsConstants.manabieUnleashHosting}`
            )}`
        );
        await delay(5000);
        await this.unleashAdmin.attach('Fill inputs');
        await unleashClient?.fill('input[name="fname"]', feature);
        await unleashClient?.fill('input[name="env"]', env);
        await unleashClient?.fill('input[name="org"]', org);
        let buffer = await unleashClient!.screenshot({
            type: 'jpeg',
        });
        await this.unleashAdmin.attachScreenshot(buffer);
        await this.unleashAdmin.attach(`text=${feature} is ${status}`);
        await unleashClient?.click('text=Submit');
        await unleashClient?.waitForSelector(`text=${feature} is ${status}`);
        buffer = await unleashClient!.screenshot({
            type: 'jpeg',
        });
        await this.unleashAdmin.attachScreenshot(buffer);
        await unleashClient?.close();
    }
);
