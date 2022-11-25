import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, LearnerInterface } from '@supports/app-types';

import { learnerSeesNewNotificationsFromHomeScreen } from './communication-receives-notification-of-assignment-return-definitions';

Then(
    '{string} sees notification of assignment return in notification list',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            'Learner sees new notifications from home screen',
            async function (this: LearnerInterface) {
                const numberOfNotifications = 1;
                await learnerSeesNewNotificationsFromHomeScreen(this, numberOfNotifications);
            }
        );
    }
);

Then(
    '{string} sees {int} notifications of assignment return in notification list',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        numberOfNotifications: number
    ): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            'Learner sees new notifications from home screen',
            async function (this: LearnerInterface) {
                await learnerSeesNewNotificationsFromHomeScreen(this, numberOfNotifications);
            }
        );
    }
);
