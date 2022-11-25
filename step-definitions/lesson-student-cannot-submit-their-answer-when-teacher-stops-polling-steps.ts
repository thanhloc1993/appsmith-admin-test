import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';
import { defaultPollingOptions } from '@supports/constants';

import {
    learnerChoosePollingOptionOnLearnerApp,
    learnerNotChooseAnyPollingOptionOnLearnerApp,
    learnerSeesOptionStatusOnLearnerApp,
} from './lesson-student-cannot-submit-their-answer-when-teacher-stops-polling-definitions';
import { getLearnerInterfaceFromRole } from './utils';
import {
    learnerSeesOptionsOnLearnerApp,
    learnerSeesPollingAnswerBarOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-create-polling-definitions';

Given(
    '{string} has seen answer bar with 4 options on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} has seen answer bar with 4 options on Learner App`,
            async function () {
                await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
                await learnerSeesOptionsOnLearnerApp(learner, defaultPollingOptions);
            }
        );
    }
);

Then(
    '{string} has not chosen any polling option on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} has not chosen any polling option on Learner App`,
            async function () {
                await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
                await learnerNotChooseAnyPollingOptionOnLearnerApp(learner, defaultPollingOptions);
            }
        );
    }
);

Then(
    '{string} sees option {string} is green on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees option ${option} is green on Learner App`,
            async function () {
                await learnerSeesOptionStatusOnLearnerApp(learner, option, true);
            }
        );
    }
);

When(
    '{string} has chosen {string} option on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} has chosen ${option} option on Learner App`,
            async function () {
                await learnerChoosePollingOptionOnLearnerApp(learner, option);
            }
        );
    }
);
