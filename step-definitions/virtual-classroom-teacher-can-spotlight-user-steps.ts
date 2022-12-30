import { When, Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { getUserIdFromRole } from './lesson-utils';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from './utils';
import {
    learnerSeesUserStreamInTheMainScreenOnLearnerApp,
    teacherSeesSpotlightIconInUserStreamInTheGalleryViewOnTeacherApp,
    teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp,
    teacherSpotlightsUserCameraOnTeacherApp,
} from './virtual-classroom-teacher-can-spotlight-user-definitions';

When(
    `{string} spotlights {string} on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this, userRole);
        await teacher.instruction(
            `${teacherRole} spotlights ${userRole} on Teacher App`,
            async function () {
                await teacherSpotlightsUserCameraOnTeacherApp(teacher, userId);
            }
        );
    }
);

Then(
    `{string} sees {string} stream is covered with white frame in the gallery view on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this, userRole);

        await teacher.instruction(
            `${teacherRole} sees ${userRole} stream is covered with white frame in the gallery view on Teacher App`,
            async function () {
                await teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp(
                    teacher,
                    userId,
                    true
                );
            }
        );
    }
);

Then(
    `{string} see {string} stream is covered with white frame in the gallery view on Teacher App`,
    async function (this: IMasterWorld, teacherRolesString: string, userRole: AccountRoles) {
        const teacherRoles = splitRolesStringToAccountRoles(teacherRolesString);
        const userId = getUserIdFromRole(this, userRole);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees ${userRole} stream is covered with white frame in the gallery view on Teacher App`,
                async function () {
                    await teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp(
                        teacher,
                        userId,
                        true
                    );
                }
            );
        }
    }
);

Then(
    `{string} sees spotlight icon in {string} stream in the gallery view on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this, userRole);

        await teacher.instruction(
            `${teacherRole} sees spotlight icon in ${userRole} stream in the gallery view on Teacher App`,
            async function () {
                await teacherSeesSpotlightIconInUserStreamInTheGalleryViewOnTeacherApp(
                    teacher,
                    userId
                );
            }
        );
    }
);

Then(
    `{string} see spotlight icon in {string} stream in the gallery view on Teacher App`,
    async function (this: IMasterWorld, teacherRolesString: string, userRole: AccountRoles) {
        const teacherRoles = splitRolesStringToAccountRoles(teacherRolesString);
        const userId = getUserIdFromRole(this, userRole);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees spotlight icon in ${userRole} stream in the gallery view on Teacher App`,
                async function () {
                    await teacherSeesSpotlightIconInUserStreamInTheGalleryViewOnTeacherApp(
                        teacher,
                        userId
                    );
                }
            );
        }
    }
);

Then(
    `{string} see {string} stream in the main screen on Learner App`,
    async function (this: IMasterWorld, roles: string, role: AccountRoles) {
        const studentRoles = splitRolesStringToAccountRoles(roles);
        const userId = getUserIdFromRole(this, role);
        for (const studentRole of studentRoles) {
            const learner = getLearnerInterfaceFromRole(this, studentRole);
            await learner.instruction(
                `${studentRole} see ${role} stream in the main screen on Learner App`,
                async function () {
                    await learnerSeesUserStreamInTheMainScreenOnLearnerApp(learner, userId);
                }
            );
        }
    }
);

Then(
    `{string} sees {string} stream in the main screen on Learner App`,
    async function (this: IMasterWorld, studentRole: AccountRoles, role: AccountRoles) {
        const userId = getUserIdFromRole(this, role);
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        await learner.instruction(
            `${studentRole} see ${role} stream in the main screen on Learner App`,
            async function () {
                await learnerSeesUserStreamInTheMainScreenOnLearnerApp(learner, userId);
            }
        );
    }
);
