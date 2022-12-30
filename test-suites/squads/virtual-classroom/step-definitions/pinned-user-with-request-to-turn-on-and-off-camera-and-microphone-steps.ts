import { CameraOrSpeaker } from '@legacy-step-definitions/lesson-learner-turn-off-speaker-and-camera-steps';

import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getUserIdFromRole,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { checkPinnedUserViewVisibleOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-does-not-see-pinned-user-when-teacher-or-pinned-user-disconnects-and-reconnects-definitions';
import {
    cameraOfLearnerIs,
    speakerOfLearnerIs,
    teacherSeesStatusCameraIconInStudentListOnTeacherApp,
    teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp,
    teacherSeesStatusSpeakerIconInStudentListOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-speaker-and-camera-definitions';
import { StatusCameraAndSpeaker } from 'test-suites/squads/virtual-classroom/utils/types';

Then(
    `{string} sees {string} stream with {string} {string} in the main screen on Teacher App`,
    async function (
        teacherRole: AccountRoles,
        userRole: AccountRoles,
        device: CameraOrSpeaker,
        status: StatusCameraAndSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);
        await teacher.instruction(
            `${teacherRole} sees ${userRole} stream with ${device} ${status} in the main screen on Teacher App`,
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
    `{string} does not see {string} stream with {string} in the main screen on Teacher App`,
    async function (teacherRole: AccountRoles, userRole: AccountRoles, device: CameraOrSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);
        await teacher.instruction(
            `${teacherRole} does not see ${userRole} stream with ${device} in the main screen on Teacher App`,
            async function () {
                if (device === 'camera') {
                    await checkPinnedUserViewVisibleOnTeacherApp(teacher, userId, false, 'active');
                    await checkPinnedUserViewVisibleOnTeacherApp(
                        teacher,
                        userId,
                        false,
                        'inactive'
                    );
                } else {
                    await teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
                        teacher,
                        userId,
                        false
                    );
                }
            }
        );
    }
);

Then(
    `{string} sees {string} {string}'s {string} icon in student list on Teacher App`,
    async function (
        role: AccountRoles,
        active: string,
        studentRole: AccountRoles,
        device: CameraOrSpeaker
    ) {
        const studentId = getUserIdFromRole(this.scenario, studentRole);
        const iconActive = active === 'active';
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${active} ${studentRole}'s ${device} icon in student list on Teacher App`,
            async function () {
                if (device === 'speaker') {
                    await teacherSeesStatusSpeakerIconInStudentListOnTeacherApp(
                        teacher,
                        iconActive,
                        studentId
                    );
                } else {
                    await teacherSeesStatusCameraIconInStudentListOnTeacherApp(
                        teacher,
                        iconActive,
                        studentId
                    );
                }
            }
        );
    }
);

Then(
    '{string} sees {string} {string} icon on Learner App',
    async function (role: AccountRoles, active: string, device: CameraOrSpeaker) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const iconActive = active === 'active';
        await learner.instruction(
            `${role} sees ${active} ${device} icon on Learner App`,
            async function () {
                if (device == 'speaker') {
                    await speakerOfLearnerIs(learner, iconActive);
                } else {
                    await cameraOfLearnerIs(learner, iconActive);
                }
            }
        );
    }
);
