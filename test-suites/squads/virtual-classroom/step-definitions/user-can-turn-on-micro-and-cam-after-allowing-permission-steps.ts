import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { teacherJoinsLesson } from '../utils/navigation';
import { StatusCameraAndSpeaker, VisibleState } from '../utils/types';
import {
    assertCameraViewActiveInGalleryViewOnLearnerApp,
    assertCameraViewActiveInGalleryViewOnTeacherApp,
    assertGuidingTurnOnMicAndCamAlertDialogVisibleOnLearnerApp,
    assertGuidingTurnOnMicAndCamAlertDialogVisibleOnTeacherApp,
    assertSpeakerStatusInGalleryViewOnLearnerApp,
    assertSpeakerStatusInGalleryViewOnTeacherApp,
    clearCameraAndMicroPermissionOnLearnerApp,
    clearCameraAndMicroPermissionOnTeacherApp,
    grantCameraAndMicroPermissionOnLearnerApp,
    grantCameraAndMicroPermissionOnTeacherApp,
    rejoinsLessonAfterReloadThePageOnLearnerApp,
    teacherTurnsTheirCameraOnTeacherApp,
    teacherTurnsTheirSpeakerOnTeacherApp,
} from './user-can-turn-on-micro-and-cam-after-allowing-permission-definitions';
import { delay } from 'flutter-driver-x';
import {
    getUserIdFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonId, aliasLessonName } from 'test-suites/squads/lesson/common/alias-keys';

Given(
    '{string} has declined permission for microphone and cam on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has declined permission for microphone and cam on Teacher App`,
            async function () {
                await clearCameraAndMicroPermissionOnTeacherApp(teacher);
            }
        );
    }
);

Given(
    '{string} has declined permission for microphone and cam on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} has declined permission for microphone and cam on Learner App`,
            async function () {
                await clearCameraAndMicroPermissionOnLearnerApp(learner);
            }
        );
    }
);

Given('{string} has turned on their camera on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(
        `${role} has turned on their camera on Teacher App`,
        async function () {
            await teacherTurnsTheirCameraOnTeacherApp(teacher, false);
        }
    );
});

Given('{string} have turned on their camera on Teacher App', async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);
    for (const role of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has turned on their camera on Teacher App`,
            async function () {
                await teacherTurnsTheirCameraOnTeacherApp(teacher, false);
            }
        );
    }
});

When('{string} turns on speaker and camera on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(
        `${role} turns on speaker and camera on Teacher App`,
        async function () {
            await teacherTurnsTheirCameraOnTeacherApp(teacher, false);
            await teacherTurnsTheirSpeakerOnTeacherApp(teacher, false);
        }
    );
});

When(
    '{string} allows permission for microphone and cam on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} allows permission for microphone and cam on Teacher App`,
            async function () {
                await grantCameraAndMicroPermissionOnTeacherApp(teacher);
            }
        );
    }
);

When(
    '{string} allows permission for microphone and cam on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} allows permission for microphone and cam on Learner App`,
            async function () {
                await grantCameraAndMicroPermissionOnLearnerApp(learner);
            }
        );
    }
);

When(
    '{string} reloads the page from virtual classroom on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} reloads the page from virtual classroom on Teacher App`,
            async function () {
                await teacher.flutterDriver!.reload();
                // wait for exchange token api refresh the token
                await delay(2000);
            }
        );
    }
);

When(
    '{string} reloads the page from virtual classroom on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} reloads the page from virtual classroom on Learner App`,
            async function () {
                await learner.flutterDriver!.reload();
            }
        );
    }
);

When(
    '{string} rejoins lesson after reload the page on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);

        await learner.instruction(
            `${role} rejoins lesson after reload the page on Learner App`,
            async function () {
                await rejoinsLessonAfterReloadThePageOnLearnerApp(learner, lessonId, lessonName);
            }
        );
    }
);

When('{string} reloads the page on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} reloads the page on Learner App`, async function () {
        await learner.flutterDriver!.reload();
    });
});

When('{string} turns on their speaker on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} turns on their speaker on Teacher App`, async function () {
        await teacherTurnsTheirSpeakerOnTeacherApp(teacher, false);
    });
});

When('{string} turns on their camera on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} turns on their camera on Teacher App`, async function () {
        await teacherTurnsTheirCameraOnTeacherApp(teacher, false);
    });
});

When('{string} rejoins lesson on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const isFirstTeacher = role === 'teacher' || role === 'teacher T1';
    await teacher.instruction(`${role} rejoins lesson on Teacher App`, async function () {
        await teacherJoinsLesson(teacher, isFirstTeacher);
    });
});

Then(
    '{string} {string} guiding turn on microphone and cam alert dialog on Teacher App',
    async function (role: AccountRoles, visibleState: VisibleState) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const visible = visibleState === 'can see';
        await teacher.instruction(
            `${role} ${visibleState} guiding turn on microphone and cam alert dialog on Teacher App`,
            async function () {
                await assertGuidingTurnOnMicAndCamAlertDialogVisibleOnTeacherApp(teacher, visible);
            }
        );
    }
);

Then(
    '{string} {string} guiding turn on microphone and cam alert dialog on Learner App',
    async function (role: AccountRoles, visibleState: VisibleState) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const visible = visibleState === 'can see';
        await learner.instruction(
            `${role} ${visibleState} guiding turn on microphone and cam alert dialog on Learner App`,
            async function () {
                await assertGuidingTurnOnMicAndCamAlertDialogVisibleOnLearnerApp(learner, visible);
            }
        );
    }
);

Then(
    `{string} sees their camera and microphone are {string} on Teacher App`,
    async function (role: AccountRoles, status: StatusCameraAndSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);
        const active = status === 'active';
        await teacher.instruction(
            `${role} sees their camera and microphone are ${status} on Teacher App`,
            async function () {
                await assertSpeakerStatusInGalleryViewOnTeacherApp(teacher, userId, active);
                await assertCameraViewActiveInGalleryViewOnTeacherApp(teacher, userId, active);
            }
        );
    }
);

Then(
    `{string} sees their camera and microphone are {string} on Learner App`,
    async function (role: AccountRoles, status: StatusCameraAndSpeaker) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);
        const active = status === 'active';
        await learner.instruction(
            `${role} sees their camera and microphone are ${status} on Learner App`,
            async function () {
                await assertSpeakerStatusInGalleryViewOnLearnerApp(learner, userId, active);
                await assertCameraViewActiveInGalleryViewOnLearnerApp(learner, userId, active);
            }
        );
    }
);

Then(
    `{string} sees {string}'s micro and camera are {string} on Teacher App`,
    async function (
        role: AccountRoles,
        anotherUserRole: AccountRoles,
        status: StatusCameraAndSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, anotherUserRole);
        const active = status === 'active';
        await teacher.instruction(
            `${role} sees ${anotherUserRole}'s micro and camera are ${status} on Learner App`,
            async function () {
                await assertSpeakerStatusInGalleryViewOnTeacherApp(teacher, userId, active);
                await assertCameraViewActiveInGalleryViewOnTeacherApp(teacher, userId, active);
            }
        );
    }
);

Then(
    `{string} sees {string}'s micro and camera are {string} on Learner App`,
    async function (
        role: AccountRoles,
        anotherUserRole: AccountRoles,
        status: StatusCameraAndSpeaker
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, anotherUserRole);
        const active = status === 'active';
        await learner.instruction(
            `${role} sees ${anotherUserRole}'s micro and camera are ${status} on Learner App`,
            async function () {
                await assertSpeakerStatusInGalleryViewOnLearnerApp(learner, userId, active);
                await assertCameraViewActiveInGalleryViewOnLearnerApp(learner, userId, active);
            }
        );
    }
);
