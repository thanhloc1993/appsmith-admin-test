import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { defaultPollingOptions } from '@supports/constants';

import {
    teacherAddsOptionsToPollingOptionsOnTeacherApp,
    teacherRemovesPollingAnswerOptionsOnTeacherApp,
    teacherSeesSetUpPollingPageWithOptionsOnTeacherApp,
} from './lesson-teacher-can-adjust-answer-options-definitions';
import {
    convertOneOfStringTypeToArray,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from './utils';
import {
    learnerSeesOptionsOnLearnerApp,
    learnerSeesPollingAnswerBarOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-create-polling-definitions';

When(
    '{string} adds {string} to polling answer options',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} adds ${options} to polling answer options`,
            async function (teacher) {
                await teacherAddsOptionsToPollingOptionsOnTeacherApp(
                    teacher,
                    convertOneOfStringTypeToArray(`[${options}]`)
                );
            }
        );
    }
);

Then(
    '{string} sees set up polling page with {string} options on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} sees set up polling page with ${options} options on Teacher App`,
            async function () {
                await teacherSeesSetUpPollingPageWithOptionsOnTeacherApp(
                    teacher,
                    convertOneOfStringTypeToArray(`[${options}]`)
                );
            }
        );
    }
);

Then(
    '{string} sees answer bar with options {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees answer bar with options ${options} on Learner App`,
            async function () {
                await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
                await learnerSeesOptionsOnLearnerApp(
                    learner,
                    convertOneOfStringTypeToArray(`[${options}]`)
                );
            }
        );
    }
);

When(
    '{string} removes {string} polling answer options',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} removes ${options} polling answer options`,
            async function (teacher) {
                await teacherRemovesPollingAnswerOptionsOnTeacherApp(
                    teacher,
                    convertOneOfStringTypeToArray(`[${options}]`)
                );
            }
        );
    }
);

Then(
    '{string} sees set up polling page with 4 default options and {string} options on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const allOptions = [
            ...defaultPollingOptions,
            ...convertOneOfStringTypeToArray(`[${options}]`),
        ];

        await teacher.instruction(
            `${role} sees set up polling page with 4 default options and ${options} options on Teacher App`,
            async function () {
                await teacherSeesSetUpPollingPageWithOptionsOnTeacherApp(teacher, allOptions);
            }
        );
    }
);
