import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLearnerSubmittedPollingOption } from './alias-keys/lesson';
import {
    learnerSeesPollingResultBannerOnLearnerApp,
    learnerSeesPollingSubmitButtonStatusOnLearnerApp,
    learnerSeesTheirSelectedOptionStatusOnLearnerApp,
    learnerSubmitsOptionOnLearnerApp,
} from './lesson-student-can-see-correct-polling-answer-definitions';
import { teacherAddsOptionsToPollingOptionsOnTeacherApp } from './lesson-teacher-can-adjust-answer-options-definitions';
import { getRandomPollingOptionFromOptions } from './lesson-utils';
import {
    convertOneOfStringTypeToArray,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from './utils';
import { learnerSeesPollingAnswerBarOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-create-polling-definitions';

Given(
    '{string} has added {string} to polling answer options on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} has added ${options} to polling answer  on Teacher App`,
            async function (teacher) {
                await teacherAddsOptionsToPollingOptionsOnTeacherApp(
                    teacher,
                    convertOneOfStringTypeToArray(`[${options}]`)
                );
            }
        );
    }
);

When(
    '{string} submits {string} option on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        let option = options;

        if (options.includes('1 of [')) {
            option = getRandomPollingOptionFromOptions(options);

            this.scenario.set(aliasLearnerSubmittedPollingOption(role), option);
        }

        await learner.instruction(
            `${role} submits ${option} option on Learner App`,
            async function () {
                await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
                await learnerSubmitsOptionOnLearnerApp(learner, option);
            }
        );
    }
);

Then(
    '{string} sees green correct banner on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees green correct banner on Learner App`,
            async function () {
                await learnerSeesPollingResultBannerOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    '{string} sees submit button is disabled on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees submit button is disabled on Learner App`,
            async function () {
                await learnerSeesPollingSubmitButtonStatusOnLearnerApp(learner, false);
            }
        );
    }
);

Then(
    '{string} sees their selected {string} option is green on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees their selected ${option} option is green on Learner App`,
            async function () {
                await learnerSeesTheirSelectedOptionStatusOnLearnerApp(learner, option, true);
            }
        );
    }
);
