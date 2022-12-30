import { Given, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    clickActionButtonByName,
    passValuesInAssertNotificationRowOnTableById,
    clickCreatedNotificationByIdOnTable,
    UserGroupType,
} from './communication-common-definitions';
import { openAndInputScheduledNotificationDataToComposeFormWithAudience } from './communication-display-information-after-send-scheduled-notification-definitions';
import { getNotificationIdByTitleWithHasura } from './communication-notification-hasura';

Given(
    'school admin has created a scheduled notification with {string}',
    async function (this: IMasterWorld, audienceType: UserGroupType) {
        const context = this.scenario;
        const cms = this.cms;

        await cms.instruction(
            'Open compose dialog and input required fields',
            async function (this: CMSInterface) {
                await openAndInputScheduledNotificationDataToComposeFormWithAudience(
                    this,
                    audienceType,
                    context
                );
            }
        );

        await cms.instruction(
            'Click save schedule button to edit the notification time',
            async function () {
                await clickActionButtonByName('Save schedule', cms, context);
            }
        );

        const title = context.get(aliasCreatedNotificationName);

        await cms.attach(`Call Hasura to get NotificationId by title ${title}`);

        const notificationId = await getNotificationIdByTitleWithHasura(this.cms, title);

        context.set(aliasCreatedNotificationID, notificationId);
    }
);

When(
    'school admin clicks created send notification in notification table',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const cms = this.cms;

        await passValuesInAssertNotificationRowOnTableById(cms, context);

        await clickCreatedNotificationByIdOnTable(cms, context);
    }
);
