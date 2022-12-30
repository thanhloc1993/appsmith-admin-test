import { getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, staffProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { aliasPollSelectedOptionsLength } from 'test-suites/squads/virtual-classroom/common/alias-keys';
import {
    studentSeesPollBlankQuestionAndBlankOption,
    teacherAddsMorePollOption,
    teacherFulfillsPollAnswerText,
    teacherFulfillsPollQuestionText,
    teacherOpensCreatePollingPage,
    teacherSeesPollNumberOfAnswerStats,
    teacherSeesPollingIconWithStatus,
    teacherSeesPollStatsView,
    teacherSeesStopPollAnswerButton,
    teacherSeesThePreviousSelectedPollOptions,
    teacherStartsPolling,
    studentSeesPollQuestionContent,
    studentSeesPollOptionsContent,
    saveCorrectAnswersOptionsIfNeeded,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-can-start-polling-with-no-correct-answer-definitions';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

Given(
    '{string} has opened create polling page on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has opened create polling page on Teacher App`,
            async function () {
                await teacherOpensCreatePollingPage(teacher);
            }
        );
    }
);

Given(
    '{string} has added more options from C to J on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario!;
        await teacher.instruction(
            `${role} has added more options from C to J on Teacher App`,
            async function () {
                await teacherAddsMorePollOption(teacher, scenario, 8);
            }
        );
    }
);

Given(
    '{string} fulfills by text in question and fulfills by text answer option field on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario!;
        const length = scenario.get<number>(aliasPollSelectedOptionsLength);
        await teacher.instruction(
            `${role} fulfills by text in question and fulfills by text answer option field on Teacher App`,
            async function () {
                await teacherFulfillsPollQuestionText(teacher);
                await teacherFulfillsPollAnswerText(teacher, length);
            }
        );
    }
);

When('{string} starts polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const scenario = this.scenario;
    await teacher.instruction(`${role} starts polling on Teacher App`, async function () {
        saveCorrectAnswersOptionsIfNeeded(scenario);
        await teacherStartsPolling(teacher);
    });
});

Then(
    'all teachers see stats page with the previous selected options on Teacher App',
    async function () {
        const teachers = getUsersFromContextByRegexKeys(this.scenario, staffProfileAlias);
        const length = this.scenario.get<number>(aliasPollSelectedOptionsLength);
        for (let i = 0; i < teachers.length; i++) {
            const teacher = getTeacherInterfaceFromRole(this, `teacher T${i}` as AccountRoles);
            await teacher.instruction(
                `Teacher teacher T${i} sees stats page with the previous selected options on Teacher App`,
                async function () {
                    await teacherSeesPollStatsView(teacher);
                    await teacherSeesThePreviousSelectedPollOptions(teacher, length);
                }
            );
        }
    }
);

Then(
    'all teachers see {string}|{string} number of answer on Teacher App',
    async function (votes: string, students: string) {
        const teachers = getUsersFromContextByRegexKeys(this.scenario, staffProfileAlias);
        const submittedVotes = Number(votes);
        const studentLength = Number(students);
        for (let i = 0; i < teachers.length; i++) {
            const teacher = getTeacherInterfaceFromRole(this, `teacher T${i}` as AccountRoles);
            await teacher.instruction(
                `Teacher teacher T${i} sees {string}|{string} number of answer on Teacher App`,
                async function () {
                    await teacherSeesPollNumberOfAnswerStats(
                        teacher,
                        submittedVotes,
                        studentLength
                    );
                }
            );
        }
    }
);

Then(
    '{string} sees {string}|{string} number of answer on Teacher App',
    async function (role: AccountRoles, votes: string, students: string) {
        const submittedVotes = Number(votes);
        const studentLength = Number(students);
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `Teacher ${role} sees {string}|{string} number of answer on Teacher App`,
            async function () {
                await teacherSeesPollNumberOfAnswerStats(teacher, submittedVotes, studentLength);
            }
        );
    }
);

Then('all teachers see stop answer button on Teacher App', async function () {
    const teachers = getUsersFromContextByRegexKeys(this.scenario, staffProfileAlias);
    for (let i = 0; i < teachers.length; i++) {
        const teacher = getTeacherInterfaceFromRole(this, `teacher T${i}` as AccountRoles);
        await teacher.instruction(
            `Teacher teacher T${i} sees stop answer button on Teacher App`,
            async function () {
                await teacherSeesStopPollAnswerButton(teacher);
            }
        );
    }
});

Then(
    'all teachers see {string} polling icon in the main bar on Teacher App',
    async function (status: ButtonStatus) {
        const teachers = getUsersFromContextByRegexKeys(this.scenario, staffProfileAlias);
        const active = status === 'active';
        for (let i = 0; i < teachers.length; i++) {
            const teacher = getTeacherInterfaceFromRole(this, `teacher T${i}` as AccountRoles);
            await teacher.instruction(
                `Teacher teacher T${i} sees ${status} polling icon in the main bar on Teacher App`,
                async function () {
                    await teacherSeesPollingIconWithStatus(teacher, active);
                }
            );
        }
    }
);

Then('all students see blank question and blank option list on Learner App', async function () {
    const learners = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias);
    const length = this.scenario.get<number>(aliasPollSelectedOptionsLength);
    for (let i = 0; i < learners.length; i++) {
        const learner = getLearnerInterfaceFromRole(this, `student S${i + 1}` as AccountRoles);
        await learner.instruction(
            `Student student S${i} sees blank question and blank option list on Learner App`,
            async function () {
                await studentSeesPollBlankQuestionAndBlankOption(learner, length);
            }
        );
    }
});

Then('all students see question content and options content on Learner App', async function () {
    const learners = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias);
    const length = this.scenario.get<number>(aliasPollSelectedOptionsLength);
    for (let i = 0; i < learners.length; i++) {
        const learner = getLearnerInterfaceFromRole(this, `student S${i + 1}` as AccountRoles);
        await learner.instruction(
            `Student student S${i} sees question content and options content on Learner App`,
            async function () {
                await studentSeesPollQuestionContent(learner);
                await studentSeesPollOptionsContent(learner, length);
            }
        );
    }
});
