import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerClickOnNotificationIcon,
    learnerNotSeesNotificationBadge,
    learnerSeesNotificationBadge,
} from './communication-common-definitions';
import { learnerSeesNotificationReadStatus } from './communication-resend-notification-definitions';

Then(
    `{string} sees notification bell display with badge number`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} click on notification icon`, async () => {
            await learnerClickOnNotificationIcon(learner);
        });

        await learner.instruction(
            `${role} sees badge number displayed 1 on notification bell`,
            async () => {
                await learnerSeesNotificationBadge(learner, 1);
            }
        );
    }
);

Then(
    `{string} sees notification bell display without badge number`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees notification bell display without badge number`,
            async () => {
                await learnerNotSeesNotificationBadge(learner);
            }
        );
    }
);

Then(
    `{string} sees unread status display in notification list`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees unread status displayed in notification list`,
            async () => {
                await learnerSeesNotificationReadStatus(learner, true);
            }
        );
    }
);

Then(
    `{string} sees unread status does not display in notification list`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} click on notification icon`, async () => {
            await learnerClickOnNotificationIcon(learner);
        });

        await learner.instruction(
            `${role} sees unread status does not display in notification list`,
            async () => {
                await learnerSeesNotificationReadStatus(learner, false);
            }
        );
    }
);
