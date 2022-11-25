import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUserIdFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    teacherClickPinFeatureOptionButton,
    userCameraVisibilityOnListCameraOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/lesson-teacher-pins-learner-camera-definitions';
import { checkPinnedUserViewVisibleOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-does-not-see-pinned-user-when-teacher-or-pinned-user-disconnects-and-reconnects-definitions';
import { teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-speaker-and-camera-definitions';
import {
    CameraOrSpeaker,
    PinnedFeatureOptionMenu,
    StatusCameraAndSpeaker,
} from 'test-suites/squads/virtual-classroom/utils/types';

Given(
    '{string} has {string} themselves on Teacher App',
    async function (role: AccountRoles, option: PinnedFeatureOptionMenu) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);
        await teacher.instruction(
            `${role} has ${option} themselves on Teacher App`,
            async function () {
                await teacherClickPinFeatureOptionButton(teacher, userId, option);
            }
        );
    }
);

When(
    '{string} {string} themselves on Teacher App',
    async function (role: AccountRoles, option: PinnedFeatureOptionMenu) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);
        await teacher.instruction(`${role} ${option} themselves on Teacher App`, async function () {
            await teacherClickPinFeatureOptionButton(teacher, userId, option);
        });
    }
);

Then(
    '{string} sees themselves stream with {string} {string} in the main screen on Teacher App',
    async function (role: AccountRoles, device: CameraOrSpeaker, status: StatusCameraAndSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);
        await teacher.instruction(
            `${role} sees themselves stream with ${device} ${status} in the main screen on Teacher App`,
            async function () {
                if (device === 'camera') {
                    await checkPinnedUserViewVisibleOnTeacherApp(teacher, userId, true, status);
                } else {
                    await teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
                        teacher,
                        userId,
                        status === 'active'
                    );
                }
            }
        );
    }
);

Then(
    '{string} does not see themselves stream with {string} {string} in the main screen on Teacher App',
    async function (role: AccountRoles, device: CameraOrSpeaker, status: StatusCameraAndSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);
        await teacher.instruction(
            `${role} does not see themselves stream with ${device} ${status} in the main screen on Teacher App`,
            async function () {
                if (device === 'camera') {
                    await checkPinnedUserViewVisibleOnTeacherApp(teacher, userId, false, status);
                } else {
                    await teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
                        teacher,
                        userId,
                        status === 'active'
                    );
                }
            }
        );
    }
);

Then(
    `{string} sees themselves with {string} {string} in the gallery view on Teacher App`,
    async function (role: AccountRoles, device: CameraOrSpeaker, status: StatusCameraAndSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);

        await teacher.instruction(
            `${role} sees themselves with ${device} ${status} in the gallery view on Teacher App`,
            async function () {
                if (device === 'camera') {
                    await userCameraVisibilityOnListCameraOnTeacherApp(
                        teacher,
                        userId,
                        true,
                        status
                    );
                } else {
                    await teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
                        teacher,
                        userId,
                        status === 'active'
                    );
                }
            }
        );
    }
);

Then(
    `{string} does not see themselves in the gallery view on Teacher App`,
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, role);

        await teacher.instruction(
            `${role} does not see themselves in the gallery view on Teacher App`,
            async function () {
                await userCameraVisibilityOnListCameraOnTeacherApp(
                    teacher,
                    userId,
                    false,
                    'active'
                );
                await userCameraVisibilityOnListCameraOnTeacherApp(
                    teacher,
                    userId,
                    false,
                    'inactive'
                );
            }
        );
    }
);

Then(
    `{string} does not see {string} in the gallery view on Teacher App`,
    async function (role: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this.scenario, userRole);

        await teacher.instruction(
            `${role} does not see ${userRole} in the gallery view on Teacher App`,
            async function () {
                await userCameraVisibilityOnListCameraOnTeacherApp(
                    teacher,
                    userId,
                    false,
                    'active'
                );
                await userCameraVisibilityOnListCameraOnTeacherApp(
                    teacher,
                    userId,
                    false,
                    'inactive'
                );
            }
        );
    }
);
