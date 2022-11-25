import { Given } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';

import {
    clickSaveDraftNotification,
    clickSendNotification,
    clickCreatedNotificationByIdOnTable,
    UserGroupType,
} from './communication-common-definitions';
import { openAndInputNotificationDataToComposeFormWithAudience } from './communication-display-information-after-send-notification-definitions';

Given(
    'school admin has created a draft notification with {string}',
    async function (this: IMasterWorld, audienceType: UserGroupType) {
        const context = this.scenario;
        const cms = this.cms;

        await cms.instruction(
            'Open compose dialog and input required fields',
            async function (this: CMSInterface) {
                await openAndInputNotificationDataToComposeFormWithAudience(
                    this,
                    audienceType,
                    context
                );
            }
        );

        await cms.instruction(
            'Click save draft button on the compose dialog',
            async function (this: CMSInterface) {
                await clickSaveDraftNotification(this, context);
            }
        );
    }
);

Given('school admin has sent draft notification', async function (this: IMasterWorld) {
    const context = this.scenario;
    const cms = this.cms;

    await cms.instruction('Reload CMS to get the updated notification', async function () {
        await cms.page?.reload();
        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction(
        'Selects created draft notification in notification table',
        async function (this: CMSInterface) {
            await clickCreatedNotificationByIdOnTable(cms, context);
        }
    );

    await cms.instruction(
        'Click send button on the compose dialog',
        async function (this: CMSInterface) {
            await clickSendNotification(this);
        }
    );
});
