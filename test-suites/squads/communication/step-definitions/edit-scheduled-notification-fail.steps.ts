import { Then, When } from '@cucumber/cucumber';

import {
    aliasCreatedScheduleNotificationName,
    cmsScheduleNotificationData,
} from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    clickSaveScheduleNotificationButtonWithoutWaitForGPRC,
    NotificationActionButton,
    NotificationFields,
    passValuesInAssertNotificationRowOnTableById,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import { editNotificationFieldsBlank } from './edit-scheduled-notification-fail-definitions';

When(
    'school admin clear value of {string} field and {string} notification',
    async function (requiredFieldKey: NotificationFields, buttonAction: NotificationActionButton) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(
            `Edit schedule notification with ${requiredFieldKey} field(s) is empty`,
            async function () {
                await cms.waitingForLoadingIcon();

                await editNotificationFieldsBlank(cms, scenario, requiredFieldKey);
            }
        );

        await cms.instruction(`Click ${buttonAction} button`, async function () {
            if (buttonAction === 'Save schedule')
                await clickSaveScheduleNotificationButtonWithoutWaitForGPRC(cms);
        });
    }
);

Then('school admin sees new notification full-screen dialog closed', async function () {
    const cms = this.cms;
    const cmsPage = cms.page!;

    await cms.instruction('Assert the dialog is closed', async function () {
        const composeDialog = await cmsPage.$(CommunicationSelectors.notificationDialog);

        weExpect(composeDialog).toBeNull();
    });
});

Then('school admin sees new notification full-screen dialog still opened', async function () {
    const cms = this.cms;
    const cmsPage = cms.page!;

    await cms.instruction('Assert the dialog is still opened', async function () {
        const composeDialog = await cmsPage.$(CommunicationSelectors.notificationDialog);

        weExpect(composeDialog).not.toBeNull();
    });
});

Then(
    'school admin sees {int} of required errors validation message in form of {string}',
    async function (numberOfError: number, requiredFieldKey: NotificationFields) {
        const cms = this.cms;
        const cmsPage = cms.page!;

        await cms.instruction(
            `Assert ${numberOfError} of error messages on the notification form after clear ${requiredFieldKey} field and the dialog still open`,
            async () => {
                requiredFieldKey;
                const errors = await cmsPage.$$(
                    CommunicationSelectors.mandatoryFieldErrorTypography
                );

                for (const errorElement of errors) {
                    await errorElement.scrollIntoViewIfNeeded();
                }

                weExpect(errors).toHaveLength(numberOfError);

                const composeDialog = await cmsPage.waitForSelector(
                    CommunicationSelectors.notificationAudienceSelectorUpsertDialog,
                    {
                        timeout: 3000,
                    }
                );

                weExpect(composeDialog).not.toBeNull();
            }
        );
    }
);

Then('school admin sees scheduled notification is not updated', async function () {
    const cms = this.cms;
    const scenario = this.scenario;

    const notificationName: string = scenario.get<string>(aliasCreatedScheduleNotificationName);
    const notificationContent: string = scenario.get<string>(
        cmsScheduleNotificationData('Content')
    );
    const notificationScheduleTime: string = scenario.get<string>(
        cmsScheduleNotificationData('Time')
    );
    const studentName: string = scenario.get<string>(
        cmsScheduleNotificationData('Individual Recipient')
    );

    await passValuesInAssertNotificationRowOnTableById(cms, scenario);

    await clickCreatedNotificationByIdOnTable(cms, scenario);
    await cms.waitingForLoadingIcon();

    await cms.instruction('Assert notification field data on dialog', async function () {
        // Assert the title
        const notificationTitleInputValue = await cms.page?.inputValue(
            CommunicationSelectors.notificationTitleInput
        );
        weExpect(notificationTitleInputValue).toEqual(notificationName);

        // Assert the content
        await cms.waitForSelectorWithText(
            `${CommunicationSelectors.notificationDetailContent} span[data-text="true"]`,
            notificationContent
        );

        // Assert the schedule time field
        const notificationTimeInputValue = await cms.page?.inputValue(
            CommunicationSelectors.timePickerInput
        );
        weExpect(notificationTimeInputValue).toEqual(notificationScheduleTime);

        // Assert the recipient name
        await cms.waitForSelectorWithText(
            `${CommunicationSelectors.studentsAutocompleteHF} span`,
            studentName
        );
    });
});
