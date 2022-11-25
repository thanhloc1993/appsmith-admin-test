import { When } from '@cucumber/cucumber';

import { formatDate } from '@supports/utils/time/time';

import { aliasWaitTimeForSchedule } from './alias-keys/communication';
import {
    datePickerParams,
    getNotificationScheduleAtAndWaitTime,
    getSelectDateOfDatePicker,
} from './communication-common-definitions';
import { selectNotificationTimePicker } from './communication-create-scheduled-notification.definitions';

When(`school admin has selected sending time in the past`, async function () {
    const cms = this.cms;
    const context = this.scenario;

    const currentDate = new Date();
    const currentTime = formatDate(currentDate, 'HH:mm');

    await cms.attach(`Selects Schedule datepicker ${formatDate(currentDate, 'YYYY/MM/DD')}`);
    await cms.selectDatePickerMonthAndDay({
        day: currentDate.getDate(),
        monthDiff: currentDate.getMonth() - getSelectDateOfDatePicker().selectedDate.getMonth(),
        datePickerSelector: datePickerParams.datePickerSelector,
    });

    if (currentTime === '00:00') {
        await getNotificationScheduleAtAndWaitTime(cms, context, 1);
        const waitTime = context.get<number>(aliasWaitTimeForSchedule);

        await cms.instruction(
            `Special case: Current time is ${currentTime}, wait 1 mins at compose dialog before click button`,
            async function () {
                await selectNotificationTimePicker(cms, currentTime);
            }
        );

        await cms.instruction(
            `Wait for scheduled notification to be click save schedule button in ${waitTime} second`,
            async function () {
                await cms.page?.waitForTimeout(waitTime);
            }
        );
    } else {
        const selectedDate = currentDate.setMinutes(currentDate.getMinutes() - 1);
        const selectedTime = formatDate(selectedDate, 'HH:mm');

        await cms.instruction(
            `Normal case: TimePicker ${selectedTime} was selected before the time of the current time`,
            async function () {
                await selectNotificationTimePicker(cms, selectedTime);
            }
        );
    }
});
