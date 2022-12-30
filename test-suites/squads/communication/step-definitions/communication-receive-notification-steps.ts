import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    learnerClickOnNotificationIcon,
    learnerClickOnNotificationItem,
    learnerSeesNotificationDetail,
    learnerSeesNotificationItem,
    learnerVerifyNotificationItem,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import {
    learnerClickLogoutButton,
    learnerClickOnProfileOnMobile,
    learnerClickOnProfileOnWeb,
    learnerConfirmLogout,
} from './communication-receive-notification-definitions';
import { learnerWaitNotification } from './communication-resend-notification-definitions';

Given(
    'school admin has composed new message on notification page',
    async function (this: IMasterWorld): Promise<void> {
        const cms = this.cms;
        const context = this.scenario;
        const learnerId = context.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        ).id;
        const token = await cms.getToken();

        const createdNotificationData = createANotificationGrpc({
            courseIds: [],
            gradeIds: [],
            mediaIds: [],
            isAllCourses: false,
            isAllGrades: false,
            targetGroup: [UserRoles.USER_GROUP_STUDENT, UserRoles.USER_GROUP_PARENT],
            receiverIdsList: [learnerId],
        });

        await cms.attach(`Create gRPC draft notification ${createdNotificationData.title}`);

        const { response: responseDraftNotification } =
            await notificationMgmtNotificationService.upsertNotification(
                token,
                createdNotificationData
            );

        if (!responseDraftNotification) throw Error('cannot create notification draft');

        context.set(aliasCreatedNotificationName, createdNotificationData.title);
        context.set(aliasCreatedNotificationID, responseDraftNotification?.notificationId);
    }
);

/// BEGIN Scenario Outline: <userAccount> receives notification when <applicationStatus>
Given(
    'application status is {string}',
    async function (this: IMasterWorld, applicationStatus: string): Promise<void> {
        await this.learner.instruction(
            `Learner ${applicationStatus}`,
            async function (learner: LearnerInterface) {
                await learnerWaitNotification(learner);
            }
        );

        await this.parent.instruction(
            `Parent ${applicationStatus}`,
            async function (learner: LearnerInterface) {
                await learnerWaitNotification(learner);
            }
        );
    }
);

When(
    'school admin sends push notification for student and parent',
    async function (this: IMasterWorld): Promise<void> {
        const cms = this.cms;
        const token = await cms.getToken();
        const notificationId = this.scenario.get(aliasCreatedNotificationID);

        await cms.attach(`Sent gRPC notification ${notificationId}`);
        await notificationMgmtNotificationService.sendNotification(token, notificationId);
    }
);

When(
    '{string} interacts with notification banner',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isApp = learner.flutterDriver?.isApp() ?? false;
        if (isApp) {
            await learner.instruction(
                'Learner wait notification',
                async function (learner: LearnerInterface) {
                    await learnerWaitNotification(learner);
                }
            );
        } else {
            await learner.instruction(
                'Learner click on notification icon',
                async function (learner: LearnerInterface) {
                    await learnerClickOnNotificationIcon(learner);
                }
            );

            await learner.instruction(
                'Learner click on unread notification',
                async function (learner: LearnerInterface) {
                    await learnerClickOnNotificationItem(learner, true);
                }
            );
        }
    }
);

Then(
    '{string} redirects to notification detail screen',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            'Learner sees notification detail',
            async function (this: LearnerInterface) {
                await learnerSeesNotificationDetail(this);
            }
        );
    }
);
/// END Scenario Outline: <userAccount> receives notification when <applicationStatus>

/// BEGIN Scenario Outline: <userAccount> does not receive notification when logout learner App
Given(
    '{string} logout Learner App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isApp = learner.flutterDriver?.isApp() ?? false;
        if (isApp) {
            await learner.instruction(
                'Click on Profile',
                async function (learner: LearnerInterface) {
                    await learnerClickOnProfileOnMobile(learner);
                }
            );
        } else {
            await learner.instruction(
                'Click on dropdown',
                async function (learner: LearnerInterface) {
                    await learnerClickOnProfileOnWeb(learner);
                }
            );
        }

        await learner.instruction(
            'Click on logout button',
            async function (learner: LearnerInterface) {
                await learnerClickLogoutButton(learner);
            }
        );

        await learner.instruction('Confirm to logout', async function (learner: LearnerInterface) {
            await learnerConfirmLogout(learner);
        });
    }
);

Then(
    '{string} does not see notification banner in their device',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            'Learner click on notification icon',
            async function (learner: LearnerInterface) {
                await learnerClickOnNotificationIcon(learner);
            }
        );

        await learner.instruction(
            'Learner sees unread notification',
            async function (learner: LearnerInterface) {
                await learnerVerifyNotificationItem(learner, true);
            }
        );
    }
);

Then(
    '{string} sees notification on Learner App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            'Learner sees notification item',
            async function (learner: LearnerInterface) {
                await learnerSeesNotificationItem(learner);
            }
        );
    }
);

/// END Scenario Outline: <userAccount> does not receive notification when logout learner App
