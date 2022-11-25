import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, LearnerInterface, TeacherInterface } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    learnerSeesRaiseHandIconOnLearnerApp,
    teacherSeesRaiseHandIconInMainScreenOnTeacherApp,
    turnOwnRaiseHandOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

Given('{string} have turned on raise hand on Learner App', async function (role: string) {
    const roles = splitRolesStringToAccountRoles(role);
    for (const learnerRole of roles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        await learner.instruction(
            `${learnerRole} has turned on raise hand on Learner App`,
            async function () {
                await turnOwnRaiseHandOnLearnerApp(learner, false);
            }
        );
    }
});

When('{string} turns on raise hand on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} turns on raise hand on Learner App`, async function () {
        await turnOwnRaiseHandOnLearnerApp(learner, false);
    });
});

Then('{string} sees active raise hand icon on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} sees active raise hand icon on Learner App`,
        async function (this: LearnerInterface) {
            await learnerSeesRaiseHandIconOnLearnerApp(learner, true);
        }
    );
});

Then('{string} sees inactive raise hand icon on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} sees inactive raise hand icon on Learner App`,
        async function (this: LearnerInterface) {
            await learnerSeesRaiseHandIconOnLearnerApp(learner, false);
        }
    );
});

Then(
    '{string} sees active raise hand icon in main screen on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees active raise hand icon in main screen on Teacher App`,
            async function (this: TeacherInterface) {
                await teacherSeesRaiseHandIconInMainScreenOnTeacherApp(teacher, true);
            }
        );
    }
);
