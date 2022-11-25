import { getTotalRecordsOfDataTable } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    assertNotificationAttachment,
    assertNotificationSentDetail,
    clickUpsertAndSendNotification,
    clickCreatedNotificationByIdOnTable,
    UserGroupType,
} from './communication-common-definitions';
import { openAndInputNotificationDataToComposeFormWithAudience } from './communication-display-information-after-send-notification-definitions';
import {
    getInfoNotificationStatusAndCountReadByNotificationIdWithHasura,
    getNotificationIdByTitleWithHasura,
} from './communication-notification-hasura';

Given(
    'school admin has created and send notification with {string}',
    async function (this: IMasterWorld, audienceType: UserGroupType) {
        const scenario = this.scenario;

        await this.cms.instruction(
            'Open compose dialog and input required fields',
            async function (this: CMSInterface) {
                await openAndInputNotificationDataToComposeFormWithAudience(
                    this,
                    audienceType,
                    scenario
                );
            }
        );

        await this.cms.instruction(
            'Click send button on the compose dialog',
            async function (this: CMSInterface) {
                await clickUpsertAndSendNotification(this, scenario);
            }
        );

        const title = scenario.get(aliasCreatedNotificationName);

        await this.cms.attach(`Call Hasura to get NotificationId by title ${title}`);

        const notificationId = await getNotificationIdByTitleWithHasura(this.cms, title);
        scenario.set(aliasCreatedNotificationID, notificationId);
    }
);

When(
    'school admin clicks created notification in notification table',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const cms = this.cms;

        await cms.instruction('Reload CMS to get the updated notification', async function () {
            await cms.page?.reload();
            await cms.waitingForLoadingIcon();
            await cms.waitForSkeletonLoading();
        });

        await cms.instruction(
            'Selects created notification in notification table',
            async function (this: CMSInterface) {
                await clickCreatedNotificationByIdOnTable(cms, context);
            }
        );
    }
);

Then(
    'school admin sees general information in notification detail displayed correctly',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const cms = this.cms;

        await cms.waitingForLoadingIcon();
        await cms.page?.waitForSelector(CommunicationSelectors.notificationDetailContainer, {
            timeout: 10000,
        });

        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();

        await cms.instruction('Assert created notification', async function (this: CMSInterface) {
            await assertNotificationSentDetail(cms, context);
        });

        await cms.instruction(
            'Assert attachment file of the sent notification',
            async function (this: CMSInterface) {
                await assertNotificationAttachment(cms, context, { shouldAttachmentALink: true });
            }
        );

        const createdNotificationId = context.get(aliasCreatedNotificationID);

        const responseCheckRecipientData =
            await getInfoNotificationStatusAndCountReadByNotificationIdWithHasura(
                cms,
                createdNotificationId
            );

        const notificationDetailRecipientTableElement = await cms.page?.waitForSelector(
            CommunicationSelectors.notificationDetailRecipientTable,
            { timeout: 3000 }
        );

        if (!notificationDetailRecipientTableElement) {
            throw Error('Cannot find Recipient Table');
        }

        await notificationDetailRecipientTableElement.scrollIntoViewIfNeeded();

        await cms.attach(`Assert length of Recipient Table match with Hasura response 
        \nNumber of Total receivers: ${responseCheckRecipientData?.all_receiver_aggregate.aggregate?.count}
        \nNumber of reader: ${responseCheckRecipientData?.read_aggregate.aggregate?.count}`);
        const totalRecipientTable = await getTotalRecordsOfDataTable(cms);

        weExpect(Number(totalRecipientTable)).toEqual(
            responseCheckRecipientData?.all_receiver_aggregate.aggregate?.count
        );
    }
);
