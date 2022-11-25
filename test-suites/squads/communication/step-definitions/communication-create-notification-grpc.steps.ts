import { toShortenStr } from '@legacy-step-definitions/utils';

import { When, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';

import { aliasCreatedNotificationName } from './alias-keys/communication';
import { notificationTitle } from './cms-selectors/communication';
import { createANotificationGrpc } from './communication-create-notification-definitions';

When('school admin creates send notification', async function (this: IMasterWorld): Promise<void> {
    const cms = this.cms;
    const learnId = await this.learner.getUserId();
    const context = this.scenario;
    const token = await cms.getToken();

    const createdNotificationData = createANotificationGrpc({
        courseIds: [],
        gradeIds: [],
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        targetGroup: [UserRoles.USER_GROUP_STUDENT, UserRoles.USER_GROUP_PARENT],
        receiverIdsList: [learnId],
    });

    await cms.instruction(`Create Notification by gRPC`, async () => {
        const { response: responseDraftNotification } =
            await notificationMgmtNotificationService.upsertNotification(
                token,
                createdNotificationData
            );
        await context.set(aliasCreatedNotificationName, createdNotificationData.title);

        if (responseDraftNotification) {
            await cms.instruction(`Send Notification by gRPC`, async () => {
                await notificationMgmtNotificationService.sendNotification(
                    token,
                    responseDraftNotification.notificationId
                );
            });
        }
    });

    await cms.instruction(`Go to Notification Page`, async () => {
        await cms.selectMenuItemInSidebarByAriaLabel('Notification');
    });

    await cms.waitForSkeletonLoading();
});

Then(
    'school admin sees the newly created notification',
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const cms = this.cms;
        const notificationName = context.get(aliasCreatedNotificationName);

        await cms.instruction(
            `School admin see new course with name = ${notificationName}`,
            async function () {
                await cms.waitForSelectorHasText(
                    notificationTitle,
                    toShortenStr(notificationName, 24)
                );
            }
        );
    }
);
