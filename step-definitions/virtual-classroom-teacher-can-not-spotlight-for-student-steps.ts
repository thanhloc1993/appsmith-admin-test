import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUserIdFromRole } from './lesson-utils';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from './utils';
import {
    learnerDoesNotSeeUserStreamInTheMainScreenOnLearnerApp,
    teacherSeesPinnedFeatureMenuOption,
} from './virtual-classroom-teacher-can-not-spotlight-for-student-definitions';
import {
    teacherClickCameraOptionsDialogOption,
    teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp,
} from './virtual-classroom-teacher-can-spotlight-user-definitions';
import { PinnedFeatureOptionMenu } from './virtual-classroom-teacher-sees-three-dots-button-on-teacher-app-definitions';

Then(
    `{string} sees {string} option is disabled`,
    async function (role: AccountRoles, option: PinnedFeatureOptionMenu) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} sees ${option} option is disabled`, async function () {
            await teacherSeesPinnedFeatureMenuOption(teacher, option, false);
        });
    }
);

Then(
    `{string} clicks on {string} {string} option`,
    async function (role: AccountRoles, option: PinnedFeatureOptionMenu, enable: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} clicks on ${option} ${enable} option`,
            async function () {
                await teacherClickCameraOptionsDialogOption(teacher, option, enable === 'enable');
            }
        );
    }
);

Then(
    `{string} see {string} stream is not covered with white frame in the gallery view on Teacher App`,
    async function (teacherRolesString: string, userRole: AccountRoles) {
        const teacherRoles = splitRolesStringToAccountRoles(teacherRolesString);
        const userId = getUserIdFromRole(this, userRole);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees ${userRole} stream is not covered with white frame in the gallery view on Teacher App`,
                async function () {
                    await teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp(
                        teacher,
                        userId,
                        false
                    );
                }
            );
        }
    }
);

Then(
    `{string} does not see {string} stream in the main screen on Learner App`,
    async function (roles: string, role: AccountRoles) {
        const studentRoles = splitRolesStringToAccountRoles(roles);
        const userId = getUserIdFromRole(this, role);
        for (const studentRole of studentRoles) {
            const learner = getLearnerInterfaceFromRole(this, studentRole);
            await learner.instruction(
                `${studentRole} does not see ${role} stream in the main screen on Learner App`,
                async function () {
                    await learnerDoesNotSeeUserStreamInTheMainScreenOnLearnerApp(learner, userId);
                }
            );
        }
    }
);
