import { getRandomNumber } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
    aliasCreatedScheduleNotificationID,
    aliasCreatedScheduleNotificationName,
    cmsScheduleNotificationData,
} from './alias-keys/communication';
import {
    selectRecipientsOnDialog,
    selectUserTypesRadioOnDialog,
    fillTitleAndContentOnDialog,
    selectNotificationTypesRadioOnDialog,
    assertNotificationAttachment,
    uploadNotificationAttachmentOnDialog,
    clickCreatedNotificationByIdOnTable,
    NotificationType,
    datePickerParams,
    getSelectDateOfDatePicker,
    passValuesInAssertNotificationRowOnTableById,
} from './communication-common-definitions';
import { selectNotificationTimePicker } from './communication-create-scheduled-notification.definitions';

When(
    `school admin fills scheduled notification information`,
    async function (this: IMasterWorld): Promise<void> {
        const cms = this.cms;
        const context = this.scenario;

        await cms.instruction(
            'Selects courses, grades and individual recipients on the full-screen dialog',
            async function () {
                await selectRecipientsOnDialog(cms, context, {
                    course: 'Specific',
                    grade: 'Specific',
                    individual: 'Specific',
                });
            }
        );

        await cms.instruction(
            'Selects the "All" user type on the full-screen dialog',
            async function () {
                await selectUserTypesRadioOnDialog(cms, 'All');
            }
        );

        await cms.instruction(
            'Selects Schedule notification type on the full-screen dialog',
            async function () {
                await selectNotificationTypesRadioOnDialog(cms, 'Schedule');
            }
        );

        const currentDate = new Date();
        const selectedDate = formatDate(getSelectDateOfDatePicker().selectedDate, 'YYYY/MM/DD');
        const selectedTime = formatDate(currentDate, 'HH:mm');

        await cms.instruction(
            `Selects Schedule notification date and time ${selectedTime}, ${selectedDate}`,
            async function () {
                await cms.selectDatePickerMonthAndDay(datePickerParams);

                await selectNotificationTimePicker(cms, selectedTime);

                context.set(cmsScheduleNotificationData('Date'), selectedDate);
                context.set(cmsScheduleNotificationData('Time'), selectedTime);
            }
        );

        await cms.instruction(
            'Fills the title and content of the full-screen dialog',
            async function () {
                const scheduledName = `Title Schedule Notification E2E ${getRandomNumber()}`;

                await fillTitleAndContentOnDialog(cms, context, {
                    title: scheduledName,
                    content: `Content ${scheduledName}`,
                });

                context.set(aliasCreatedScheduleNotificationName, scheduledName);
            }
        );
    }
);

Then(`school admin sees new scheduled notification on CMS`, async function () {
    const cms = this.cms;
    const context = this.scenario;

    await passValuesInAssertNotificationRowOnTableById(cms, context);
});

When(`school admin has attached PDF file`, async function () {
    const scenario = this.scenario;

    await this.cms.instruction(
        'Upload PDF attachment in schedule notification',
        async function (this: CMSInterface) {
            await uploadNotificationAttachmentOnDialog(this, scenario);
        }
    );

    await this.cms.instruction(
        'Assert the attachment is on the schedule notification',
        async function (this: CMSInterface) {
            await assertNotificationAttachment(this, scenario, {
                shouldAttachmentALink: true,
            });
        }
    );
});

When(`school admin opens editor full-screen dialog of draft notification`, async function () {
    const context = this.scenario;
    const notificationDraftID = context.get<string>(aliasCreatedNotificationID);

    await this.cms.instruction('Reload current page', async function (cms) {
        await cms.page?.reload();
    });

    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(
        `Select created draft notification ${notificationDraftID} on table`,
        async function (this: CMSInterface) {
            await clickCreatedNotificationByIdOnTable(this, context);
        }
    );
});

When(`school admin selects {string}`, async function (notificationType: NotificationType) {
    const cms = this.cms;
    const context = this.scenario;
    const notificationId: string = context.get<string>(aliasCreatedScheduleNotificationID);
    const notificationName: string = context.get<string>(aliasCreatedScheduleNotificationName);

    await cms.instruction(
        'Selects Schedule notification type on the full-screen dialog',
        async function () {
            await selectNotificationTypesRadioOnDialog(cms, notificationType);

            if (notificationType === 'Now') {
                context.set(aliasCreatedNotificationID, notificationId);
                context.set(aliasCreatedNotificationName, notificationName);
            }
        }
    );
});

When(`school admin selects date, time of schedule notification`, async function () {
    const cms = this.cms;
    const context = this.scenario;

    const currentDate = new Date();
    const selectedDate = formatDate(getSelectDateOfDatePicker().selectedDate, 'YYYY/MM/DD');
    const selectedTime = formatDate(currentDate, 'HH:mm');

    await cms.instruction(
        `Selects Schedule notification date and time ${selectedTime}, ${selectedDate}`,
        async function () {
            await cms.selectDatePickerMonthAndDay(datePickerParams);

            await selectNotificationTimePicker(cms, selectedTime);

            const scheduleNotificationName = await cms.page!.inputValue(
                'input[data-testid="NotificationUpsertForm__inputTitle"]'
            );

            context.set(aliasCreatedScheduleNotificationName, scheduleNotificationName);
        }
    );
});
Then(
    `school admin sees draft notification has been saved to scheduled notification`,
    async function () {
        const cms = this.cms;
        const context = this.scenario;
        await passValuesInAssertNotificationRowOnTableById(cms, context);
    }
);
