import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getUserIdFromRole,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { learnerTurnsOffRaiseHandOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/turn-off-raise-hand-definitions';
import { teacherSeesVisibleRaiseHandIconInStudentListOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';
import { VisibleState } from 'test-suites/squads/virtual-classroom/utils/types';

Given('{string} has turned off raise hand on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} turns off raise hand on Learner App`, async function () {
        await learnerTurnsOffRaiseHandOnLearnerApp(learner);
    });
});

Then(
    `{string} {string} active {string}'s raise hand icon in the first position in student list on Teacher App`,
    async function (role: AccountRoles, visibleStatus: VisibleState, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, userRole);
        const visible = visibleStatus === 'can see';
        await teacher.instruction(
            `${role} ${visibleStatus} active ${userRole}'s raise hand icon in the first position in student list on Teacher App`,
            async function () {
                await teacherSeesVisibleRaiseHandIconInStudentListOnTeacherApp(
                    teacher,
                    userId,
                    0,
                    visible
                );
            }
        );
    }
);

Then(
    `{string} {string} active {string}'s raise hand icon in the second position in student list on Teacher App`,
    async function (role: AccountRoles, visibleStatus: VisibleState, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, userRole);
        const visible = visibleStatus === 'can see';
        await teacher.instruction(
            `${role} ${visible} active ${userRole}'s raise hand icon in the second position in student list on Teacher App`,
            async function () {
                await teacherSeesVisibleRaiseHandIconInStudentListOnTeacherApp(
                    teacher,
                    userId,
                    1,
                    visible
                );
            }
        );
    }
);
