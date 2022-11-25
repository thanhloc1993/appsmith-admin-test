import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerSeesPollingResultBannerOnLearnerApp,
    learnerSeesTheirSelectedOptionStatusOnLearnerApp,
} from './lesson-student-can-see-correct-polling-answer-definitions';
import { getLearnerInterfaceFromRole } from './utils';

Then(
    '{string} sees red incorrect banner on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees red incorrect banner on Learner App`,
            async function () {
                await learnerSeesPollingResultBannerOnLearnerApp(learner, false);
            }
        );
    }
);

Then(
    '{string} sees their selected {string} option is red on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees their selected ${option} option is red on Learner App`,
            async function () {
                await learnerSeesTheirSelectedOptionStatusOnLearnerApp(learner, option, false);
            }
        );
    }
);
