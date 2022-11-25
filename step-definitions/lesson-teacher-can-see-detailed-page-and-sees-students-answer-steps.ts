import { Given, Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { aliasLearnerSubmittedPollingOption } from './alias-keys/lesson';
import {
    teacherGoesToPollingDetailsPageOnTeacherApp,
    teacherSeeLearnerSubmittedOptionAtPollingDetailsPageOnTeacherApp,
} from './lesson-teacher-can-see-detailed-page-and-sees-students-answer-definitions';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from './utils';

Given(
    '{string} have gone to polling Details page on Teacher App',
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);

            await teacher.instruction(
                `${teacherRole} have gone to polling Details page on Teacher App`,
                async function () {
                    await teacherGoesToPollingDetailsPageOnTeacherApp(teacher);
                }
            );
        }
    }
);

Then(
    '{string} goes to polling Details page on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} goes to polling Details page on Teacher App`,
            async function () {
                await teacherGoesToPollingDetailsPageOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    '{string} sees {string} submitted {string} option in {string} colour',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        learnerRole: AccountRoles,
        options: string,
        colour: string
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        const learnerId = await learner.getUserId();
        const isLearnerAnswerCorrectAtLestOneOption = colour === 'green';

        let option = options;

        if (options.includes('1 of [')) {
            option = this.scenario.get(aliasLearnerSubmittedPollingOption(learnerRole));
        }

        await teacher.instruction(
            `${teacherRole} sees ${learnerRole} submitted ${option} option in ${colour} colour`,
            async function () {
                await teacherSeeLearnerSubmittedOptionAtPollingDetailsPageOnTeacherApp(
                    teacher,
                    learnerId,
                    option,
                    isLearnerAnswerCorrectAtLestOneOption
                );
            }
        );
    }
);
