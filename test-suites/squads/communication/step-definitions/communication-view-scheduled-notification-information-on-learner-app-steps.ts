import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasAccountRole } from './alias-keys/communication';
import {
    NotificationAction,
    getRandomAccountRoles,
    learnerClickOnNotificationIcon,
    learnerCloseNotificationDetail,
    UnreadStatusBehavior,
    NotificationBadgeBehavior,
    learnerSeesNotificationBadge,
    learnerNotSeesNotificationBadge,
} from './communication-common-definitions';
import {
    learnerReadNotification,
    learnerSeesNotificationReadStatus,
} from './communication-resend-notification-definitions';
import { getNotificationBadgeNumber } from './communication-view-scheduled-notification-information-on-learner-app-definitions';

Then(
    '{string} {string} the scheduled notification',
    async function (this: IMasterWorld, receivers: string, action: NotificationAction) {
        const role = getRandomAccountRoles(receivers);
        const learner = getLearnerInterfaceFromRole(this, role);

        this.scenario.set(aliasAccountRole, role);

        if (action === 'read') {
            await learner.instruction(`${role} reads notification`, async function () {
                await learnerReadNotification(learner);
            });

            await learner.instruction(
                `${role} closes notification detail screen`,
                async function () {
                    await learnerCloseNotificationDetail(learner);
                }
            );
        }
    }
);

Then(
    '{string} receives notification with badge number of notification bell displays {string} on Learner App',
    async function (this: IMasterWorld, roles: string, badgeBehavior: NotificationBadgeBehavior) {
        const role = this.scenario.get(aliasAccountRole) as AccountRoles;
        const learner = getLearnerInterfaceFromRole(this, role);
        const badgeNumber = getNotificationBadgeNumber(badgeBehavior);

        await learner.instruction(
            `${role} of ${roles} click on notification button`,
            async function () {
                await learnerClickOnNotificationIcon(learner);
            }
        );

        if (badgeBehavior === 'without number') {
            await learner.instruction(
                `${role} don't see badge number display on notification bell`,
                async function () {
                    await learnerNotSeesNotificationBadge(learner);
                }
            );
        } else {
            await learner.instruction(
                `${role} sees badge number display ${badgeNumber} on notification bell`,
                async function () {
                    await learnerSeesNotificationBadge(learner, badgeNumber);
                }
            );
        }
    }
);

Then(
    '{string} sees unread status {string} on Learner App',
    async function (this: IMasterWorld, roles: string, behavior: UnreadStatusBehavior) {
        const role = this.scenario.get(aliasAccountRole) as AccountRoles;
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} of ${roles} click on notification button`,
            async function () {
                await learnerClickOnNotificationIcon(learner);
            }
        );

        await learner.instruction(
            `${role} sees unread status ${behavior} on learner app`,
            async function () {
                await learnerSeesNotificationReadStatus(learner, behavior === 'displays');
            }
        );
    }
);
