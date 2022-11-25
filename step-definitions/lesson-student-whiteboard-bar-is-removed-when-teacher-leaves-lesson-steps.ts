import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getLearnerInterfaceFromRole } from './utils';
import { learnerSeesPdfOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';

Then(
    '{string} still sees pdf on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} still sees pdf on Learner App`, async function () {
            await learnerSeesPdfOnLearnerApp(learner, false);
        });
    }
);
