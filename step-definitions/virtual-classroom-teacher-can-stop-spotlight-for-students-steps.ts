import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { StatusCameraAndSpeaker } from './lesson-turn-on-speaker-and-camera-definitions';
import { getUserIdFromRole } from './lesson-utils';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from './utils';
import {
    teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp,
    teacherSpotlightsUserCameraOnTeacherApp,
} from './virtual-classroom-teacher-can-spotlight-user-definitions';
import {
    checkPinnedUserViewVisibleOnLearnerApp,
    teacherStopSpotlightUserCameraOnTeacherApp,
} from './virtual-classroom-teacher-can-stop-spotlight-for-students-definitions';
import { userCameraVisibilityOnListCameraOnLearnerApp } from './virtual-classroom-teacher-can-switch-pinned-user-definitions';

Given(
    '{string} has spotlighted {string} on Teacher App',
    async function (role: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this, userRole);
        await teacher.instruction(
            `${role} has spotlighted ${userRole} on Teacher App`,
            async function () {
                await teacherSpotlightsUserCameraOnTeacherApp(teacher, userId);
            }
        );
    }
);

When(
    '{string} stops spotlighting {string} on Teacher App',
    async function (role: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this, userRole);
        await teacher.instruction(
            `${role} stops spotlighting ${userRole} on Teacher App`,
            async function () {
                await teacherStopSpotlightUserCameraOnTeacherApp(teacher, userId);
            }
        );
    }
);

Then(
    '{string} do not see {string} stream is covered with white frame in the gallery view on Teacher App',
    async function (roles: string, userRole: AccountRoles) {
        const materWorld = this!;
        const accountRoles = splitRolesStringToAccountRoles(roles);
        const userId = getUserIdFromRole(this, userRole);
        for (const role of accountRoles) {
            const teacher = getTeacherInterfaceFromRole(materWorld, role);
            await teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp(
                teacher,
                userId,
                false
            );
        }
    }
);

Then(
    '{string} do not see {string} stream with camera {string} in the main screen on Learner App',
    async function (roles: string, userRole: AccountRoles, status: StatusCameraAndSpeaker) {
        const accountRoles = splitRolesStringToAccountRoles(roles);
        const userId = getUserIdFromRole(this, userRole);
        for (const role of accountRoles) {
            const learner = getLearnerInterfaceFromRole(this, role);
            await learner.instruction(
                `${role} do not see ${userRole} stream with camera ${status} in the main screen on Teacher App`,
                async function () {
                    await checkPinnedUserViewVisibleOnLearnerApp(learner, userId, false, status);
                }
            );
        }
    }
);

Then(
    `{string} do not see {string} in the gallery view on Learner App`,
    async function (roles: string, role: AccountRoles) {
        const studentRoles = splitRolesStringToAccountRoles(roles);
        const userId = getUserIdFromRole(this, role);
        for (const studentRole of studentRoles) {
            const learner = getLearnerInterfaceFromRole(this, studentRole);
            await learner.instruction(
                `${studentRole} do not see ${role} in the gallery view on Learner App`,
                async function () {
                    await userCameraVisibilityOnListCameraOnLearnerApp(learner, userId, false);
                }
            );
        }
    }
);
