import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    assertRECIconInTheLeftVisibleOnLearnerApp,
    assertRECIconInTheLeftVisibleOnTeacherApp,
    assertRecordInProgressSnackBarVisibleOnTeacherApp,
    assertStopRecordingButtonWithStateVisibleOnTeacherApp,
    teacherStartsRecordTheLesson,
} from 'test-suites/squads/virtual-classroom/utils/record';

When(
    '{string} starts record the entire screen on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} starts record the entire screen on Teacher App`,
            async function () {
                await teacherStartsRecordTheLesson(teacher);
            }
        );
    }
);

Then('{string} see record in progress snack bar on Teacher App', async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);

    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} see record in progress snack bar on Teacher App`,
            async function () {
                await assertRecordInProgressSnackBarVisibleOnTeacherApp(teacher, true);
            }
        );
    }
});

Then(
    '{string} sees stop recording button with {string} state in the main bar on Teacher App',
    async function (role: AccountRoles, state: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const enable = state === 'enable';
        await teacher.instruction(
            `${role} sees stop recording button with ${state} state in the main bar on Teacher App`,
            async function () {
                await assertStopRecordingButtonWithStateVisibleOnTeacherApp(teacher, enable);
            }
        );
    }
);

Then('{string} see REC icon in the left on Teacher App', async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);

    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} sees REC icon in the left on Teacher App`,
            async function () {
                await assertRECIconInTheLeftVisibleOnTeacherApp(teacher, true);
            }
        );
    }
});

Then('{string} sees REC icon in the left side on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} sees REC icon in the left side on Learner App`,
        async function () {
            await assertRECIconInTheLeftVisibleOnLearnerApp(learner, true);
        }
    );
});
