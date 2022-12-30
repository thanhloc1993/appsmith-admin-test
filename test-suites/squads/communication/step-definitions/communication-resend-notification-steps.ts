import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { MasterWorld } from '@supports/master-world';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    clickResendNotification,
    learnerClickOnNotificationIcon,
    learnerCloseNotificationDetail,
    selectNotificationCategoryFilter,
    selectNotificationSentByIdOnTable,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import {
    confirmToResendNotification,
    learnerReadNotification,
    learnerSeesNotificationReadStatus,
    learnerWaitNotification,
    resendButtonIsDisable,
} from './communication-resend-notification-definitions';

/// BEGIN Scenario Outline: Resend notification for <unreadUser>
Given(
    'school admin has created notification and sent for created student and parent',
    async function (this: MasterWorld): Promise<void> {
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

        await cms.attach(`Create gRPC draft notification ${createdNotificationData.title}`);
        const { response: responseDraftNotification } =
            await notificationMgmtNotificationService.upsertNotification(
                token,
                createdNotificationData
            );
        context.set(aliasCreatedNotificationName, createdNotificationData.title);

        if (!responseDraftNotification) throw Error('cannot create notification draft');

        await cms.attach(`Send Notification by gRPC ${createdNotificationData.title}`);

        await notificationMgmtNotificationService.sendNotification(
            token,
            responseDraftNotification.notificationId
        );

        context.set(aliasCreatedNotificationID, responseDraftNotification?.notificationId);

        await cms.instruction('Reload page', async () => {
            await cms.page?.reload();
        });
    }
);

Given(
    '{string} has not read notification',
    async function (this: MasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction('Waiting notification', async function (learner) {
            await learnerWaitNotification(learner);
        });
    }
);

Given(
    '{string} has read the notification',
    async function (this: MasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`Reads notification`, async function (learner) {
            await learnerReadNotification(learner);
        });
    }
);

When(
    'school admin re-sends notification for unread recipients',
    async function (this: MasterWorld): Promise<void> {
        const context = this.scenario;
        await this.cms.instruction('Select notification sent category', async function (cms) {
            await selectNotificationCategoryFilter(cms, 'Sent');
        });

        await this.cms.instruction('Select the notification has sent', async function (cms) {
            await selectNotificationSentByIdOnTable(cms, context);
        });

        await this.cms.instruction('Resend notifications', async function (cms) {
            await clickResendNotification(cms);
        });

        await this.cms.instruction('Confirm to resend notifications', async function (cms) {
            await confirmToResendNotification(cms);
        });
    }
);

Then(
    '{string} receives notification',
    async function (this: MasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction('Learner click on notification button', async function (learner) {
            await learnerClickOnNotificationIcon(learner);
        });

        await learner.instruction(
            'Learner sees unread status of notification',
            async function (learner) {
                await learnerSeesNotificationReadStatus(learner, true);
            }
        );
    }
);

Then(
    '{string} does not receive any notification',
    async function (this: MasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${learner} click on close button`, async function (learner) {
            await learnerCloseNotificationDetail(learner);
        });
        await learner.instruction(
            `${learner} click on notification button`,
            async function (learner) {
                await learnerClickOnNotificationIcon(learner);
            }
        );

        await learner.instruction(
            `${learner} not sees a new notification`,
            async function (learner) {
                await learnerSeesNotificationReadStatus(learner, false);
            }
        );
    }
);
/// END Scenario: Notify unread button is disabled when all users read notification

/// BEGIN Scenario: Notify unread button is disabled when all users read notification
When('student has read the notification', async function (this: IMasterWorld): Promise<void> {
    await this.learner.instruction(`Learner reads notification`, async function (learner) {
        await learnerReadNotification(learner);
    });
});

When('parent has read the notification', async function (this: IMasterWorld): Promise<void> {
    await this.parent.instruction(`Parent reads notification`, async function (learner) {
        await learnerReadNotification(learner);
    });
});

Then(
    'school admin sees the Notify unread button is disabled',
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        await this.cms.instruction('Reload current page', async function (cms) {
            await cms.page?.reload();
        });

        await this.cms.instruction('Select Notification Sent category', async function (cms) {
            await selectNotificationCategoryFilter(cms, 'Sent');
        });

        await this.cms.instruction('Select the notification sent', async function (cms) {
            await selectNotificationSentByIdOnTable(cms, context);
        });

        await this.cms.instruction('Admin knows resend button is disable', async function (cms) {
            await resendButtonIsDisable(cms);
        });
    }
);
/// END Scenario: Notify unread button is disabled when all users read notification
