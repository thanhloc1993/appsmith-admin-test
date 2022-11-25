import { Then, When } from '@cucumber/cucumber';

import { formatDate } from '@supports/utils/time/time';

import { mandatoryFieldErrorTypography, timePickerHF } from './cms-selectors/communication';
import {
    clickSaveScheduleNotificationButtonWithoutWaitForGPRC,
    datePickerParams,
    fillTitleOrContent,
    getSelectDateOfDatePicker,
    NotificationActionButton,
    NotificationFields,
    selectNotificationTypesRadioOnDialog,
    selectRecipientsOnDialog,
} from './communication-common-definitions';
import { selectNotificationTimePicker } from './communication-create-scheduled-notification.definitions';
import { checkAndClearAutocompleteInput } from './edit-scheduled-notification-fail-definitions';

When(
    'school admin leaves {string} blank and click {string} button',
    async function (emptyField: NotificationFields, buttonAction: NotificationActionButton) {
        const cms = this.cms;
        const context = this.scenario;

        await cms.instruction(
            'Selects Schedule notification type on the full-screen dialog',
            async function () {
                await selectNotificationTypesRadioOnDialog(cms, 'Schedule');
            }
        );

        if (emptyField !== 'Recipient Group') {
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
        }

        if (emptyField !== 'Time') {
            const currentDate = new Date();
            const selectedTime = formatDate(currentDate, 'HH:mm');
            const selectedDate = formatDate(getSelectDateOfDatePicker().selectedDate, 'YYYY/MM/DD');

            await cms.instruction(
                `Selects Schedule notification date and time ${selectedTime}, ${selectedDate}`,
                async function () {
                    await cms.selectDatePickerMonthAndDay(datePickerParams);

                    await selectNotificationTimePicker(cms, selectedTime);
                }
            );
        } else {
            await checkAndClearAutocompleteInput(cms, [timePickerHF]);
        }

        await cms.instruction(
            `Leave the ${emptyField} of the full-screen dialog blank`,
            async function () {
                await fillTitleOrContent(cms, context, emptyField);
            }
        );

        await cms.instruction(`Clicks the ${buttonAction} button`, async function () {
            if (buttonAction === 'Save schedule')
                await clickSaveScheduleNotificationButtonWithoutWaitForGPRC(cms);
        });
    }
);

Then(
    'school admin sees scheduled notification is not created with {string} error validation',
    async function (numberOfError: string) {
        const cms = this.cms;
        const cmsPage = cms.page!;

        await cms.instruction(
            `Assert ${numberOfError} to be shown on the compose dialog`,
            async function () {
                const errors = await cmsPage.$$(mandatoryFieldErrorTypography);

                weExpect(errors).toHaveLength(Number(numberOfError));
            }
        );
    }
);
