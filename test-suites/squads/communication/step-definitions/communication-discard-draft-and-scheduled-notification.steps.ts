import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
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
} from './alias-keys/communication';
import {
    assertNotificationRowOnTableById,
    clickCancelConfirmNotificationButton,
    clickCloseDialog,
    clickDiscardConfirmNotificationButton,
    clickDisposeConfirmNotificationButton,
    ComposeType,
    getCreatedNotificationID,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import {
    getNotificationIdByTitleWithHasura,
    getInfoNotificationStatusAndCountReadByNotificationIdWithHasura,
} from './communication-notification-hasura';
import { mappingResponseOfCheckNotificationStatusInTime } from './communication-schedule-notification-common';

Given(
    'school admin has created 1 "draft", 1 "scheduled" notifications',
    async function (this: IMasterWorld) {
        const token = await this.cms.getToken();
        const scenario = this.scenario;
        const cms = this.cms;

        const currentDate = new Date();

        const scheduledAt = new Date(new Date(currentDate).setDate(currentDate.getDate() + 1));

        scheduledAt.setHours(currentDate.getHours());

        const scheduleDateStr = formatDate(scheduledAt, 'YYYY/MM/DD, HH:mm');

        const { id: studentId } = scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const createdNotificationData = createANotificationGrpc({
            courseIds: [],
            gradeIds: [],
            mediaIds: [],
            isAllCourses: false,
            isAllGrades: false,
            targetGroup: [UserRoles.USER_GROUP_STUDENT],
            receiverIdsList: [studentId],
        });

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

        await cms.attach(`Create gRPC draft notification ${createdNotificationData.title}`);

        const { response: responseDraftNotification } =
            await notificationMgmtNotificationService.upsertNotification(
                token,
                createdNotificationData
            );

        await cms.attach(
            `Create gRPC schedule notification ${createdNotificationScheduledData.title} with time ${scheduleDateStr}`
        );

        const { response: responseScheduleNotification } =
            await notificationMgmtNotificationService.upsertNotification(
                token,
                createdNotificationScheduledData
            );

        if (!responseDraftNotification) throw Error('cannot create notification draft');
        if (!responseScheduleNotification) throw Error('cannot create notification schedule');

        scenario.set(aliasCreatedNotificationID, responseDraftNotification?.notificationId);
        scenario.set(aliasCreatedNotificationName, createdNotificationData.title);
        scenario.set(
            aliasCreatedScheduleNotificationID,
            responseScheduleNotification?.notificationId
        );
        scenario.set(aliasCreatedScheduleNotificationName, createdNotificationScheduledData.title);
    }
);

Given(
    'school admin has opened editor full-screen dialog of {string} notification',
    async function (this: IMasterWorld, notificationStatus: ComposeType) {
        const scenario = this.scenario;
        const cms = this.cms;

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

        await clickCreatedNotificationByIdOnTable(cms, scenario);
    }
);

When('school admin confirms to discard', async function (this: IMasterWorld) {
    const cms = this.cms;

    await cms.instruction(
        'School admin clicks confirm on discard confirm dialog',
        async function () {
            await clickDiscardConfirmNotificationButton(cms);
        }
    );
});

When('school admin confirms to dispose', async function (this: IMasterWorld) {
    const cms = this.cms;

    await cms.instruction('School admin clicks confirm on dispose dialog', async function () {
        await clickDisposeConfirmNotificationButton(cms);
    });
});

When('school admin cancels dialog confirm', async function (this: IMasterWorld) {
    const cms = this.cms;

    await cms.instruction('School admin clicks cancel on confirm dialog', async function () {
        await clickCancelConfirmNotificationButton(cms);
    });

    await cms.instruction('School admin confirms close dialog notification', async function () {
        await clickCloseDialog(cms);
    });
});

Then(
    'school admin sees {string} notification has been deleted on CMS',
    async function (this: IMasterWorld, notificationType: ComposeType) {
        const scenario = this.scenario;
        const cms = this.cms;
        const createdNotificationID = getCreatedNotificationID(scenario, notificationType);

        await cms.waitForSkeletonLoading();

        await this.cms.instruction('Reload current page', async function (cms) {
            await cms.page?.reload();
        });

        await cms.waitForSkeletonLoading();

        await cms.instruction(
            `Assert ${notificationType} cannot be found in the notification list`,
            async function () {
                await cms.page?.waitForSelector(`tr[data-value="${createdNotificationID}"]`, {
                    state: 'hidden',
                });
            }
        );
    }
);

Then(
    'school admin still sees {string} notification on CMS',
    async function (this: IMasterWorld, notificationType: ComposeType) {
        const scenario = this.scenario;
        const cms = this.cms;
        const createdNotificationID = getCreatedNotificationID(scenario, notificationType);

        await cms.waitForSkeletonLoading();

        await cms.instruction(
            `Assert ${notificationType} is in the notification list`,
            async function () {
                await cms.page?.waitForSelector(`tr[data-value="${createdNotificationID}"]`, {
                    state: 'visible',
                });
            }
        );
    }
);
