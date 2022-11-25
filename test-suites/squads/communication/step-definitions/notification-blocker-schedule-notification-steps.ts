import { getCMSInterfaceByRole, getRandomNumber } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import { aliasWaitTimeForSchedule } from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    selectRecipientsOnDialog,
    selectUserTypesRadioOnDialog,
    fillTitleAndContentOnDialog,
    selectNotificationTypesRadioOnDialog,
    getNotificationScheduleAtAndWaitTime,
} from './communication-common-definitions';
import { selectNotificationTimePicker } from './communication-create-scheduled-notification.definitions';

When(
    '{string} fills scheduled notification with course and grade to student',
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
                    title: `Title E2E Schedule Blocker ${getRandomNumber()}`,
                    content: `Content Schedule Blocker ${getRandomNumber()}`,
                });
            }
        );

        await cms.instruction(
            'Selects Schedule notification type on the full-screen dialog',
            async function () {
                await selectNotificationTypesRadioOnDialog(cms, 'Schedule');
            }
        );

        const scheduledAt = await getNotificationScheduleAtAndWaitTime(cms, context, 1);
        const selectedTime = formatDate(scheduledAt, 'HH:mm');
        const selectedDate = formatDate(scheduledAt, 'YYYY/MM/DD');

        await cms.instruction(
            `Selects Schedule notification date and time ${selectedTime}, ${selectedDate}`,
            async function () {
                await cms.selectDatePickerMonthAndDay({
                    datePickerSelector: CommunicationSelectors.notificationScheduleDatePicker,
                    day: scheduledAt.getDate(),
                    monthDiff: scheduledAt.getMonth() - new Date().getMonth(),
                });

                await selectNotificationTimePicker(cms, selectedTime);
            }
        );
    }
);

When(
    `{string} wait to see notification sent successfully on time`,
    { timeout: 180000 }, //3mins
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const waitTime = scenario.get<number>(aliasWaitTimeForSchedule);

        await cms.instruction(
            `Wait for scheduled notification to be send in ${waitTime + 10000} second`,
            async function () {
                // We buffer 10s to the waitTime to make sure the API is sent successfully
                await cms.page?.waitForTimeout(waitTime + 10000);
            }
        );
    }
);
