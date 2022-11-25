import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { seesWaitingRoomIconOnLearnerApp } from './lesson-learner-verify-lesson-definitions';
import { getLearnerInterfaceFromRole } from './utils';

Then(
    '{string} sees waiting room icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees waiting room icon on Learner App`,
            async function (learner) {
                await seesWaitingRoomIconOnLearnerApp(learner);
            }
        );
    }
);
