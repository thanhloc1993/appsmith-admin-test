import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
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
} from './alias-keys/communication';
import {
    assertNotificationRowOnTableById,
    clickCancelConfirmNotificationButton,
    clickCloseDialog,
    clickDiscardConfirmNotificationButton,
    clickDisposeConfirmNotificationButton,
    ComposeType,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import {
    getNotificationIdByTitleWithHasura,
    getInfoNotificationStatusAndCountReadByNotificationIdWithHasura,
} from './communication-notification-hasura';
import { mappingResponseOfCheckNotificationStatusInTime } from './communication-schedule-notification-common';

Given(
    '{string} has created 1 {string} notification',
    async function (role: AccountRoles, notificationStatus: ComposeType) {
        const cms = getCMSInterfaceByRole(this, role);

        const token = await cms.getToken();
        const scenario = this.scenario;

        const { id: studentId } = scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        if (notificationStatus === 'Scheduled') {
            const currentDate = new Date();

            const scheduledAt = new Date(new Date(currentDate).setDate(currentDate.getDate() + 1));

            scheduledAt.setHours(currentDate.getHours());

            const scheduleDateStr = formatDate(scheduledAt, 'YYYY/MM/DD, HH:mm');

            const createdNotificationScheduledData = createANotificationGrpc({
                title: `Schedule gRPC ${scheduleDateStr}`,
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
        } else {
            const createdNotificationData = createANotificationGrpc({
                courseIds: [],
                gradeIds: [],
                mediaIds: [],
                isAllCourses: false,
                isAllGrades: false,
                targetGroup: [UserRoles.USER_GROUP_STUDENT],
                receiverIdsList: [studentId],
            });

            await cms.attach(`Create gRPC draft notification ${createdNotificationData.title}`);

            const { response: responseDraftNotification } =
                await notificationMgmtNotificationService.upsertNotification(
                    token,
                    createdNotificationData
                );

            if (!responseDraftNotification) throw Error('cannot create notification draft');

            scenario.set(aliasCreatedNotificationID, responseDraftNotification?.notificationId);
            scenario.set(aliasCreatedNotificationName, createdNotificationData.title);
        }
    }
);

Given(
    '{string} has opened editor full-screen dialog of {string} notification',
    async function (role: AccountRoles, notificationStatus: ComposeType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

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

When('{string} confirms to discard', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction('{string} clicks confirm on discard confirm dialog', async function () {
        await clickDiscardConfirmNotificationButton(cms);
    });
});

When('{string} confirms to dispose', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction('{string} clicks confirm on dispose dialog', async function () {
        await clickDisposeConfirmNotificationButton(cms);
    });
});

When('{string} cancels dialog confirm', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction('{string} clicks cancel on confirm dialog', async function () {
        await clickCancelConfirmNotificationButton(cms);
    });

    await cms.instruction('{string} confirms close dialog notification', async function () {
        await clickCloseDialog(cms);
    });
});

Then(
    '{string} sees {string} notification has been deleted on CMS',
    async function (role: AccountRoles, notificationType: ComposeType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);
        const createdNotificationID = scenario.get<string>(aliasCreatedNotificationID);

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
    '{string} still sees {string} notification on CMS',
    async function (role: AccountRoles, notificationType: ComposeType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);
        const createdNotificationID = scenario.get<string>(aliasCreatedNotificationID);

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
