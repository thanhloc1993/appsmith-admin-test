import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    NotificationFields,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import {
    assertEditedDraftNotification,
    editDraftNotificationFields,
} from './communication-edit-and-save-draft-notification-definitions';

Given('{string} has created a draft notification', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    const token = await cms.getToken();
    const learnerId = await this.learner.getUserId();

    const createdNotificationData = createANotificationGrpc({
        courseIds: [],
        gradeIds: [],
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        targetGroup: [UserRoles.USER_GROUP_STUDENT],
        receiverIdsList: [learnerId],
    });

    await cms.attach(`Create Draft Notification by gRPC ${createdNotificationData.title}`);

    const { response: responseDraftNotification } =
        await notificationMgmtNotificationService.upsertNotification(
            token,
            createdNotificationData
        );

    if (!responseDraftNotification) throw Error('cannot create notification draft');

    context.set(aliasCreatedNotificationID, responseDraftNotification?.notificationId);
    context.set(aliasCreatedNotificationName, createdNotificationData.title);
    context.set(aliasCreatedNotificationContent, createdNotificationData.content.contentHTML);
});

When(`{string} selects created draft notification`, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    const createdNotificationId: string = context.get<string>(aliasCreatedNotificationID);
    const createdNotificationName: string = context.get<string>(aliasCreatedNotificationName);

    await cms.instruction(
        `Select draft notification:
        - Id: "${createdNotificationId}"
        - Title: "${createdNotificationName}"`,

        async () => {
            await clickCreatedNotificationByIdOnTable(cms, context);
        }
    );

    await cms.waitForSkeletonLoading();
});

When(
    `{string} edits {string} of draft notification`,
    async function (role: AccountRoles, fieldKey: NotificationFields) {
        const cms = getCMSInterfaceByRole(this, role);
        const content = this.scenario;

        await cms.instruction(
            `Edit draft notification with ${fieldKey} field(s)`,
            async function () {
                await editDraftNotificationFields(fieldKey, cms, content);
            }
        );
    }
);

Then(
    `{string} sees draft notification is saved successfully with new {string}`,
    async function (this: IMasterWorld, role: AccountRoles, fieldKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const content = this.scenario;
        const learner2 = this.learner2;

        await cms.instruction(`Assert notification with ${fieldKey} field(s)`, async function () {
            await assertEditedDraftNotification(fieldKey, cms, learner2, content);
        });
    }
);
