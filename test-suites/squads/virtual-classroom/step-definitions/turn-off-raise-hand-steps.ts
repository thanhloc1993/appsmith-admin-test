import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, LearnerInterface } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getUserIdFromRole,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    learnerTurnsOffRaiseHandOnLearnerApp,
    teacherDoesNotSeeAnyActiveRaiseHandIconInStudentListOnTeacherApp,
    teacherHandsOffAllStudentRaiseHandOnTeacherApp,
    teacherTurnsOffRaiseHandOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-off-raise-hand-definitions';
import {
    learnerSeesRaiseHandIconOnLearnerApp,
    teacherSeesRaiseHandIconInMainScreenOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

Then(
    '{string} still sees active raise hand icon on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} still sees active raise hand icon on Learner App`,
            async function () {
                await learnerSeesRaiseHandIconOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    '{string} does not see any active raise hand icon in student list on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const learnerIds = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias).map(
            (learner) => learner.id
        );
        await teacher.instruction(
            `${role} does not see any active raise hand icon in student list on Teacher App`,
            async function () {
                await teacherDoesNotSeeAnyActiveRaiseHandIconInStudentListOnTeacherApp(
                    teacher,
                    learnerIds
                );
            }
        );
    }
);

Then(
    '{string} still sees active raise hand icon in main screen on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} still sees active raise hand icon in main screen on Teacher App`,
            async function () {
                await teacherSeesRaiseHandIconInMainScreenOnTeacherApp(teacher, true);
            }
        );
    }
);

Then(
    '{string} sees inactive raise hand icon in main screen on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees inactive raise hand icon in main screen on Teacher App`,
            async function () {
                await teacherSeesRaiseHandIconInMainScreenOnTeacherApp(teacher, false);
            }
        );
    }
);

When('{string} turns off raise hand on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} turns off raise hand on Learner App`,
        async function (this: LearnerInterface) {
            await learnerTurnsOffRaiseHandOnLearnerApp(learner);
        }
    );
});

When(
    "{string} turns off {string}'s raise hand in the first position in student list on Teacher App",
    async function (teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this.scenario, learnerRole);
        await teacher.instruction(
            `${teacherRole} turns off ${learnerRole}'s raise hand in the first position in student list on Teacher App`,
            async function () {
                await teacherTurnsOffRaiseHandOnTeacherApp(teacher, learnerId, 0);
            }
        );
    }
);

When(
    "{string} hands off all student's raise hand on Teacher App",
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} hands off all student's raise hand on Teacher App`,
            async function () {
                await teacherHandsOffAllStudentRaiseHandOnTeacherApp(teacher);
            }
        );
    }
);
