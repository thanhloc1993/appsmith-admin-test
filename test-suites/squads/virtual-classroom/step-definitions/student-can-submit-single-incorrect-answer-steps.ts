import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getUserIdFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    aliasPollCorrectAnswers,
    aliasPollSubmittedAnswerOptionIndexes,
} from 'test-suites/squads/virtual-classroom/common/alias-keys';
import {
    studentSeesTheirSelectedAnswerOptionInOptionList,
    studentSubmitsPollOptions,
    teacherSeesPollOptionHasRatio,
    teacherSeesStudentSubmittedAnswer,
    teacherSeesStudentSubmittedTime,
} from 'test-suites/squads/virtual-classroom/step-definitions/student-can-submit-single-incorrect-answer-definitions';
import {
    saveCorrectAnswersOptionsIfNeeded,
    teacherStartsPolling,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-can-start-polling-with-no-correct-answer-definitions';
import { pollOptionIndex } from 'test-suites/squads/virtual-classroom/utils/utils';

Given('{string} has started polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const scenario = this.scenario;
    await teacher.instruction(`${role} has started polling on Teacher App`, async function () {
        saveCorrectAnswersOptionsIfNeeded(scenario);
        await teacherStartsPolling(teacher);
    });
});

When(
    '{string} submits {string} options on Learner App',
    async function (role: AccountRoles, rawOptions: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const options = rawOptions.split(', ');
        await learner.instruction(
            `${role} submits ${rawOptions} options on Learner App`,
            async function () {
                await studentSubmitsPollOptions(learner, scenario, options);
            }
        );
    }
);

When('{string} submits correct 1 of answer options', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    const scenario = this.scenario;
    const correctAnswer = scenario.get<string[]>(aliasPollCorrectAnswers);
    await learner.instruction(`${role} submits correct 1 of answer options`, async function () {
        await studentSubmitsPollOptions(learner, scenario, [correctAnswer[0]]);
    });
});

Then(
    '{string} sees their selected answer option in option list on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const userId = await learner.getUserId();
        const submittedPollAnswerOptionIndex = this.scenario.get<number[]>(
            aliasPollSubmittedAnswerOptionIndexes(userId)
        );
        await learner.instruction(
            `${role} sees their selected answer option in option list on Learner App`,
            async function () {
                await studentSeesTheirSelectedAnswerOptionInOptionList(
                    learner,
                    submittedPollAnswerOptionIndex
                );
            }
        );
    }
);

Then(
    "{string} sees {string}'s submitted time and also their submitted answer in Detail page on Teacher App",
    async function (role: AccountRoles, learnerRoles: string) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);
        const roles = splitRolesStringToAccountRoles(learnerRoles);
        for (const learnerRole of roles) {
            const userId = getUserIdFromRole(scenario, learnerRole);
            const submittedPollAnswerOptionIndexes = this.scenario.get<number[]>(
                aliasPollSubmittedAnswerOptionIndexes(userId)
            );
            await teacher.instruction(
                `${role} sees ${learnerRole}'s submitted time and also their submitted answer in Detail page on Teacher App`,
                async function () {
                    await teacherSeesStudentSubmittedTime(teacher, userId);
                    await teacherSeesStudentSubmittedAnswer(
                        teacher,
                        userId,
                        submittedPollAnswerOptionIndexes
                    );
                }
            );
        }
    }
);

Then(
    '{string} sees {string} option has {string} answer ratio on Teacher App',
    async function (role: AccountRoles, option: string, ratio: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const index = pollOptionIndex(option);
        const ratioValue = Number(ratio);
        await teacher.instruction(
            `${role} sees ${option} option has ${ratio} answer ratio on Teacher App`,
            async function () {
                await teacherSeesPollOptionHasRatio(teacher, index, ratioValue);
            }
        );
    }
);

Then(
    '{string} sees {string} submitted options has {string} answer ratio on Teacher App',
    async function (role: AccountRoles, learnerRole: AccountRoles, ratio: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const learnerId = getUserIdFromRole(scenario, learnerRole);
        const indexes = scenario.get<number[]>(aliasPollSubmittedAnswerOptionIndexes(learnerId));
        const ratioValue = Number(ratio);
        for (let i = 0; i < indexes.length; i++) {
            await teacher.instruction(
                `${role} sees ${learnerRole} submitted option has ${ratio} answer ratio on Teacher App`,
                async function () {
                    await teacherSeesPollOptionHasRatio(teacher, indexes[i], ratioValue);
                }
            );
        }
    }
);
