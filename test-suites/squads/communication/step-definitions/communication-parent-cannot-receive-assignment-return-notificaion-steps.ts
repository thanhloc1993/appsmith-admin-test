import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { learnerDoesNotSeeNotificationInNotificationList } from './communication-parent-cannot-receive-assignment-return-notificaion-definitions';

Then(
    '{string} does not see notification of assignment return in notification list',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} does not see notification in notification list`,
            async () => {
                await learnerDoesNotSeeNotificationInNotificationList(learner);
            }
        );
    }
);
