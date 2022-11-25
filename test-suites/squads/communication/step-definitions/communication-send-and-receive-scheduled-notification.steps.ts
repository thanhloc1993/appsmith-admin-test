import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import {
    KeyNotificationStatus,
    UserRoles,
} from '@supports/services/notificationmgmt-notification/const';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
    aliasCreatedScheduleNotificationID,
    aliasCreatedScheduleNotificationName,
    aliasNotificationScheduleAt,
    aliasWaitTimeForSchedule,
} from './alias-keys/communication';
import { timePickerHF } from './cms-selectors/communication';
import {
    clickActionButtonByName,
    getNotificationScheduleAtAndWaitTime,
    passValuesInAssertNotificationRowOnTableById,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import { selectNotificationTimePicker } from './communication-create-scheduled-notification.definitions';

const maxTimeout = 180000 + 20000;

Given(
    'school admin has created a scheduled notification which will be sent {int} minute later',
    async function (minuteLater: number) {
        const cms = this.cms;
        const scenario = this.scenario;
        const token = await cms.getToken();

        // Set schedule x minute later
        const scheduledAt = await getNotificationScheduleAtAndWaitTime(cms, scenario, minuteLater);

        const scheduleDateStr = formatDate(scheduledAt, 'YYYY/MM/DD, HH:mm');

        const { id: studentId } = scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S1')
        );

        const createdNotificationScheduleData = createANotificationGrpc({
            courseIds: [],
            gradeIds: [],
            mediaIds: [],
            isAllCourses: false,
            isAllGrades: false,
            targetGroup: [UserRoles.USER_GROUP_STUDENT, UserRoles.USER_GROUP_PARENT],
            receiverIdsList: [studentId],
            title: `Schedule E2E gRPC test  ${scheduleDateStr}`,
            scheduledAt,
            status: KeyNotificationStatus.NOTIFICATION_STATUS_SCHEDULED,
        });

        await cms.attach(
            `Create Schedule Notification by gRPC ${createdNotificationScheduleData.title} at ${scheduleDateStr}`
        );

        const { response: notificationCreatedResponse } =
            await notificationMgmtNotificationService.upsertNotification(
                token,
                createdNotificationScheduleData
            );

        if (!notificationCreatedResponse) throw Error('cannot create notification');

        scenario.set(aliasCreatedNotificationID, notificationCreatedResponse.notificationId);
        scenario.set(aliasCreatedNotificationName, createdNotificationScheduleData.title);

        scenario.set(
            aliasCreatedScheduleNotificationID,
            notificationCreatedResponse.notificationId
        );
        scenario.set(aliasCreatedScheduleNotificationName, createdNotificationScheduleData.title);
    }
);

Given('school admin has edited sending time of scheduled notification', async function () {
    const cms = this.cms;
    const scenario = this.scenario;

    // Edit to set schedule for 1 minute later
    const scheduledAt = await getNotificationScheduleAtAndWaitTime(cms, scenario, 1);

    await cms.attach(`New Schedule time ${scheduledAt}
                    \nCurrent time: ${formatDate(new Date(), 'YYYY/MM/DD, HH:mm')}`);

    scenario.context.set(aliasNotificationScheduleAt, scheduledAt);

    const selectedTime = formatDate(scheduledAt, 'HH:mm');

    await cms.waitingForLoadingIcon();

    await passValuesInAssertNotificationRowOnTableById(cms, scenario);

    await clickCreatedNotificationByIdOnTable(cms, scenario);

    await cms.instruction('Clear the time picker input', async function () {
        await cms.clearListAutoCompleteInput([timePickerHF]);
    });

    await cms.instruction(`Select ${selectedTime} on the time picker dropdown`, async function () {
        await selectNotificationTimePicker(cms, selectedTime);
    });

    await cms.instruction(
        'Click save schedule button to edit the notification time',
        async function () {
            await clickActionButtonByName('Save schedule', cms, scenario);
        }
    );
});

Given(
    'school admin waits for scheduled notification to be sent on time',
    { timeout: maxTimeout },
    async function () {
        const cms = this.cms;
        const scenario = this.scenario;
        const waitTime = scenario.get<number>(aliasWaitTimeForSchedule);

        await cms.instruction(
            `Wait for scheduled notification to be send in ${waitTime + 10000} second`,
            async function () {
                // We buffer 10s to the waitTime to make sure the API is sent successfully
                await cms.page?.waitForTimeout(waitTime + 10000);
            }
        );

        await cms.attach(`Current time: ${formatDate(new Date(), 'YYYY/MM/DD, HH:mm')}`);
    }
);
