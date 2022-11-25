import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasCreatedNotificationName } from './alias-keys/communication';
import {
    assertNotificationRowOnTableById,
    ComposeType,
    passValuesInAssertNotificationRowOnTableById,
} from './communication-common-definitions';
import {
    getNotificationIdByTitleWithHasura,
    getInfoNotificationStatusAndCountReadByNotificationIdWithHasura,
} from './communication-notification-hasura';
import { mappingResponseOfCheckNotificationStatusInTime } from './communication-schedule-notification-common';

Then(
    `school admin sees scheduled notification has been saved to draft notification`,
    async function () {
        const cms = this.cms;
        const context = this.scenario;

        await passValuesInAssertNotificationRowOnTableById(cms, context);
    }
);

Then(
    'status of scheduled notification is updated to {string}',
    async function (this: IMasterWorld, notificationStatus: ComposeType) {
        const cms = this.cms;
        const scenario = this.scenario;

        const notificationName = scenario.get(aliasCreatedNotificationName);
        const notificationId = await getNotificationIdByTitleWithHasura(cms, notificationName);

        if (!notificationId) {
            throw `Cannot find notificationId with notification title ${notificationName}`;
        }

        const responseRecipientData =
            await getInfoNotificationStatusAndCountReadByNotificationIdWithHasura(
                cms,
                notificationId
            );

        if (!responseRecipientData) {
            throw `Empty responseCheckRecipientData ${responseRecipientData}`;
        }

        if (!notificationStatus) {
            throw `Not match notification status`;
        }
        await cms.instruction(
            `Assert ${notificationStatus} notification in table`,
            async function () {
                await assertNotificationRowOnTableById(cms, {
                    expectStatus: notificationStatus,
                    notificationId,
                    notificationName,
                    responseCheckRecipientData:
                        mappingResponseOfCheckNotificationStatusInTime(responseRecipientData),
                });
            }
        );
    }
);
