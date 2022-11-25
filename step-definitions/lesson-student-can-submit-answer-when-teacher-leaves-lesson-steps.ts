import { Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { aliasLearnerSubmittedPollingOption } from './alias-keys/lesson';
import {
    learnerSeesPollingResultBannerOnLearnerApp,
    learnerSeesTheirSelectedOptionStatusOnLearnerApp,
} from './lesson-student-can-see-correct-polling-answer-definitions';
import {
    teacherSeesPollingAccuracyOnTeacherApp,
    teacherSeesPollingSubmissionOnTeacherApp,
} from './lesson-teacher-can-see-stats-is-changed-after-student-submits-answer-definitions';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';

Then(
    '{string} sees submission is {string}',
    async function (this: IMasterWorld, teacherRole: AccountRoles, submission: string) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} sees submission is ${submission} on Teacher App`,
            async function () {
                await teacherSeesPollingSubmissionOnTeacherApp(teacher, submission);
            }
        );
    }
);

Then(
    '{string} sees {string} banner on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, correctness: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isCorrect = correctness === 'correct';

        await learner.instruction(
            `${role} sees ${correctness} banner on Learner App`,
            async function () {
                await learnerSeesPollingResultBannerOnLearnerApp(learner, isCorrect);
            }
        );
    }
);

Then(
    '{string} sees their selected {string} option is {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, options: string, colour: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isAnswerCorrect = colour === 'green';
        let option = options;

        if (options.includes('1 of [')) {
            option = this.scenario.get(aliasLearnerSubmittedPollingOption(role));
        }

        await learner.instruction(
            `${role} sees their selected ${option} option is ${colour} on Learner App`,
            async function () {
                await learnerSeesTheirSelectedOptionStatusOnLearnerApp(
                    learner,
                    option,
                    isAnswerCorrect
                );
            }
        );
    }
);

Then(
    '{string} sees accuracy is {string}',
    async function (this: IMasterWorld, teacherRole: AccountRoles, accuracy: string) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} sees accuracy is ${accuracy} on Teacher App`,
            async function () {
                await teacherSeesPollingAccuracyOnTeacherApp(teacher, accuracy);
            }
        );
    }
);
