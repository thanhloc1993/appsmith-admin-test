import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonId, aliasLessonName } from 'test-suites/squads/lesson/common/alias-keys';
import {
    learnerRejoinsAfterReceivedEndAllMessageOnLearnerApp,
    teacherRejoinsEndedLessonByAnotherTeacher,
} from 'test-suites/squads/virtual-classroom/utils/navigation';
import {
    assertRECIconInTheLeftVisibleOnLearnerApp,
    assertRECIconInTheLeftVisibleOnTeacherApp,
    assertRecordButtonVisibleOnTeacherApp,
    assertStopRecordingSnackBarVisible,
    teacherStartsRecordTheLesson,
    teacherStopsRecordTheLesson,
} from 'test-suites/squads/virtual-classroom/utils/record';

Given(
    '{string} has started to record the entire screen on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has started to record the entire screen on Teacher App`,
            async function () {
                await teacherStartsRecordTheLesson(teacher);
            }
        );
    }
);

When(
    '{string} stops recording by stop button in the main bar on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} stops recording by stop button in the main bar on Teacher App`,
            async function () {
                await teacherStopsRecordTheLesson(teacher);
            }
        );
    }
);

When(
    '{string} rejoins lesson after lesson ended by another teacher on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const isFirstTeacher = role === 'teacher' || role === 'teacher T1';
        await teacher.instruction(
            `${role} rejoins lesson after lesson ended by another teacher on Teacher App`,
            async function () {
                await teacherRejoinsEndedLessonByAnotherTeacher(teacher, isFirstTeacher);
            }
        );
    }
);

When(
    '{string} rejoins lesson after Teacher ends lesson for all on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);
        await learner.instruction(
            `${role} rejoins lesson after Teacher ends lesson for all on Learner App`,
            async function () {
                await learnerRejoinsAfterReceivedEndAllMessageOnLearnerApp(
                    learner,
                    lessonId,
                    lessonName
                );
            }
        );
    }
);

Then('{string} see record button in the main bar on Teacher App', async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);

    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} sees record button in the main bar on Teacher App`,
            async function () {
                await assertRecordButtonVisibleOnTeacherApp(teacher, true);
            }
        );
    }
});

Then('{string} do not see REC icon in the left on Teacher App', async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);

    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} does not see REC icon in the left on Teacher App`,
            async function () {
                await assertRECIconInTheLeftVisibleOnTeacherApp(teacher, false);
            }
        );
    }
});

Then(
    '{string} does not see REC icon in the left on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see REC icon in the left on Learner App`,
            async function () {
                await assertRECIconInTheLeftVisibleOnLearnerApp(learner, false);
            }
        );
    }
);

Then('{string} see stop recording snack bar on Teacher App', async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);

    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} sees stop recording snack bar on Teacher App`,
            async function () {
                await assertStopRecordingSnackBarVisible(teacher, true);
            }
        );
    }
});
