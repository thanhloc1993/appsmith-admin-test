import { When } from '@cucumber/cucumber';

import { aliasWaitTimeForSchedule } from './alias-keys/communication';

const maxTimeout = 180000 + 10000;

When(`scheduled notification sent successfully on CMS`, { timeout: maxTimeout }, async function () {
    const cms = this.cms;
    const scenario = this.scenario;

    const waitTime = scenario.get<number>(aliasWaitTimeForSchedule);

    await cms.instruction(
        `Wait for scheduled notification to be send in ${waitTime} second`,
        async function () {
            // We buffer 5s to the waitTime to make sure the API is sent successfully
            await cms.page?.waitForTimeout(waitTime + 5000);
        }
    );
});
