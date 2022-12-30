import { Given, Then, When } from '@cucumber/cucumber';

import { notificationDetailStatus } from './cms-selectors/communication';
import {
    NotificationCategory,
    selectNotificationCategoryFilter,
    verifyNotificationTableOrderLastUpdated,
} from './communication-common-definitions';
import { createNotificationWithStatus } from './communication-view-notification-list-definitions';

Given(
    'notifications list has at least 1 Draft, 1 Sent notification and 1 Scheduled notification',
    async function () {
        const cms = this.cms;
        const learnId = await this.learner.getUserId();

        await createNotificationWithStatus(cms, learnId);

        await cms.instruction('Wait for reload page', async function () {
            await cms.page?.reload();
            await cms.waitingForLoadingIcon();
            await cms.waitForSkeletonLoading();
        });
    }
);

When(
    'school admin selects {string} category on notification menu',
    async function (category: NotificationCategory) {
        const cms = this.cms;

        await selectNotificationCategoryFilter(cms, category);
    }
);

Then(
    'school admin sees {string} notifications display on CMS order by last modified',
    async function (category: NotificationCategory) {
        const page = this.cms.page!;

        // Check Last Modified
        await this.cms.instruction('Check notification table order by last modified', async () => {
            await verifyNotificationTableOrderLastUpdated(this.cms);
        });

        // Check same status
        await this.cms.instruction(`Check notification ${category} table`, async () => {
            await this.cms.waitForSkeletonLoading();

            const notificationStatusRows = await page.$$(notificationDetailStatus);

            if (category !== 'All') {
                for (const statusChip of notificationStatusRows) {
                    const status = await statusChip.evaluate((el) => el.textContent);

                    weExpect(status).toEqual(category);
                }
            }
        });
    }
);
