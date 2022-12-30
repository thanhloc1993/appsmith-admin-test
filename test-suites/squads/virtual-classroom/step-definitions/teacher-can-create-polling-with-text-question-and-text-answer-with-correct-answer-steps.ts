import { Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    aliasPollCorrectAnswers,
    aliasPollCorrectAnswersLength,
} from 'test-suites/squads/virtual-classroom/common/alias-keys';
import {
    teacherSelectsMultiplePollOption,
    teacherSelectsPollOption,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-can-create-polling-with-text-question-and-text-answer-with-correct-answer-definitions';
import { pollOptionValues } from 'test-suites/squads/virtual-classroom/utils/constants';
import { pollOptionIndex } from 'test-suites/squads/virtual-classroom/utils/utils';

Given(
    '{string} has selected {string} as correct answer on Teacher App',
    async function (role: AccountRoles, option: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        scenario.set(aliasPollCorrectAnswersLength, 1);
        scenario.set(aliasPollCorrectAnswers, [option]);
        await teacher.instruction(
            `${role} has selected ${option} correct answer on Teacher App`,
            async function () {
                await teacherSelectsPollOption(teacher, pollOptionIndex(option));
            }
        );
    }
);

Given(
    '{string} has selected multiple correct answers on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        scenario.set(aliasPollCorrectAnswersLength, pollOptionValues.length);
        scenario.set(aliasPollCorrectAnswers, pollOptionValues);
        await teacher.instruction(
            `${role} has selected multiple correct answers on Teacher App`,
            async function () {
                await teacherSelectsMultiplePollOption(teacher, 9);
            }
        );
    }
);
