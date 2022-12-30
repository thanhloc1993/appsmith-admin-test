import {
    getCMSInterfaceByRole,
    getRandomNumber,
    getTotalRecordsOfDataTable,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, CMSInterface } from '@supports/app-types';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
    aliasNotificationCreatedCourseName,
    aliasNotificationGradeName,
} from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    selectRecipientsOnDialog,
    selectUserTypesRadioOnDialog,
    fillTitleAndContentOnDialog,
    clickCreatedNotificationByIdOnTable,
    assertNotificationAttachment,
} from './communication-common-definitions';
import { getInfoNotificationStatusAndCountReadByNotificationIdWithHasura } from './communication-notification-hasura';
import { assertNotificationSentDetailPage } from './notification-blocker-common-definitions';

When(
    '{string} sends notification with course and grade to student',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            'Selects courses, grades on the compose dialog',
            async function (this: CMSInterface) {
                await selectRecipientsOnDialog(this, context, {
                    course: 'Specific',
                    grade: 'Specific',
                });
            }
        );

        await cms.instruction(
            'Selects the "All" user type on the compose dialog',
            async function (this: CMSInterface) {
                await selectUserTypesRadioOnDialog(this, 'All');
            }
        );

        await cms.instruction(
            'Fills the title and content of the compose dialog',
            async function (this: CMSInterface) {
                await fillTitleAndContentOnDialog(this, context, {
                    title: `Title E2E Blocker ${getRandomNumber()}`,
                    content: `Content Blocker ${getRandomNumber()}`,
                });
            }
        );
    }
);

Then('{string} views detail notification', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await clickCreatedNotificationByIdOnTable(cms, scenario);
    await cms.waitingForLoadingIcon();
    await cms.page?.waitForSelector(CommunicationSelectors.notificationDetailContainer);
});

Then('{string} sees notification display correct data', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction('Assert General Info notification', async () => {
        const notificationName: string = context.get<string>(aliasCreatedNotificationName);
        const courseName: string = context.get<string>(aliasNotificationCreatedCourseName);
        const gradeName: string = context.get<string>(aliasNotificationGradeName);

        const notificationContent: string = context.get<string>(aliasCreatedNotificationContent);

        await assertNotificationSentDetailPage(cms, {
            notificationContent,
            notificationName,
            courseName,
            gradeName,
        });
        await assertNotificationAttachment(cms, context);
    });

    const createdNotificationId = context.get(aliasCreatedNotificationID);

    const responseCheckRecipientData =
        await getInfoNotificationStatusAndCountReadByNotificationIdWithHasura(
            cms,
            createdNotificationId
        );

    const notificationDetailRecipientTableElement = await cms.page?.waitForSelector(
        CommunicationSelectors.notificationDetailRecipientTable
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
});
