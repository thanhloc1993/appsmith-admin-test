import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import {
    UserRoles,
    KeyNotificationStatus,
} from '@supports/services/notificationmgmt-notification/const';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
    cmsScheduleNotificationData,
} from './alias-keys/communication';
import {
    NotificationFields,
    passValuesInAssertNotificationRowOnTableById,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import {
    assertEditedScheduleNotification,
    editScheduleNotificationFields,
} from './communication-edit-scheduled-notification.definitions';

Given(`school admin has created a scheduled notification`, async function () {
    const cms = this.cms;
    const scenario = this.scenario;
    const token = await this.cms.getToken();

    const currentDate = new Date();

    const scheduledAt = currentDate;

    scheduledAt.setHours(currentDate.getHours() + 1);

    const scheduleDateStr = formatDate(scheduledAt, 'YYYY/MM/DD, HH:mm');
    const scheduleTimeStr = formatDate(scheduledAt, 'HH:mm');

    const { id: studentId, name: studentName } = scenario.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    const createdNotificationScheduledData = createANotificationGrpc({
        title: `Notification E2E gRPC test Schedule ${scheduleDateStr}`,
        courseIds: [],
        gradeIds: [],
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        targetGroup: [UserRoles.USER_GROUP_STUDENT],
        receiverIdsList: [studentId],
        scheduledAt,
        status: KeyNotificationStatus.NOTIFICATION_STATUS_SCHEDULED,
    });

    await cms.attach(
        `Create gRPC schedule notification ${createdNotificationScheduledData.title} with time ${scheduleDateStr}`
    );

    const { response: responseScheduleNotification } =
        await notificationMgmtNotificationService.upsertNotification(
            token,
            createdNotificationScheduledData
        );

    if (!responseScheduleNotification) throw Error('cannot create notification schedule');

    scenario.set(aliasCreatedNotificationID, responseScheduleNotification?.notificationId);
    scenario.set(aliasCreatedNotificationName, createdNotificationScheduledData.title);
    scenario.set(
        aliasCreatedNotificationContent,
        createdNotificationScheduledData.content.contentHTML
    );

    scenario.set(cmsScheduleNotificationData('Time'), scheduleTimeStr);
    scenario.set(cmsScheduleNotificationData('Individual Recipient'), studentName);
});

Given(`school admin has opened a scheduled notification dialog`, async function () {
    const cms = this.cms;
    const scenario = this.scenario;

    await passValuesInAssertNotificationRowOnTableById(cms, scenario);

    await clickCreatedNotificationByIdOnTable(cms, scenario);
});

When(
    `school admin edits {string} of scheduled notification`,
    async function (fieldKey: NotificationFields) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(
            `Edit scheduled notification with ${fieldKey} field(s)`,
            async function () {
                await editScheduleNotificationFields(fieldKey, cms, scenario);
            }
        );
    }
);

Then(
    `school admin sees updated {string} scheduled notification on CMS`,
    async function (fieldKey: NotificationFields) {
        const cms = this.cms;
        const context = this.scenario;
        const learner2 = await this.learner2;

        await passValuesInAssertNotificationRowOnTableById(cms, context);

        await clickCreatedNotificationByIdOnTable(cms, context);

        await cms.waitingForLoadingIcon();

        await cms.instruction(`Assert notification with ${fieldKey} field(s)`, async function () {
            await assertEditedScheduleNotification(fieldKey, cms, learner2, context);
        });
    }
);
