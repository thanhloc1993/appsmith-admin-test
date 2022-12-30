import { CameraOrSpeaker } from '@legacy-step-definitions/lesson-learner-turn-off-speaker-and-camera-steps';
import {
    cameraOfLearnerIs,
    speakerOfLearnerIs,
} from '@legacy-step-definitions/lesson-rejoin-live-lesson-definitions';
import { teacherTurnOffStudentDeviceOnTeacherApp } from '@legacy-step-definitions/lesson-teacher-turn-off-speaker-and-camera-definitions';
import {
    StatusCameraAndSpeaker,
    teacherSeesStatusCameraIconInStudentListOnTeacherApp,
    teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp,
    teacherSeesStatusSpeakerIconInStudentListOnTeacherApp,
} from '@legacy-step-definitions/lesson-turn-on-speaker-and-camera-definitions';
import { getUserIdFromRole } from '@legacy-step-definitions/lesson-utils';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { checkPinnedUserViewVisibleOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-does-not-see-pinned-user-when-teacher-or-pinned-user-disconnects-and-reconnects-definitions';
import {
    learnerTapActionFromRequestModalOnLearnerApp,
    teacherTurnOnStudentDeviceOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-requests-to-turn-on-speaker-and-camera-definitions';

Given(
    "{string} has requested to turn on {string}'s {string} on Teacher App",
    { timeout: 15000 },
    async function (teacherRole: AccountRoles, studentRole: AccountRoles, device: CameraOrSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);

        const userId = getUserIdFromRole(this, studentRole);

        await teacher.instruction(
            `${teacherRole} has requested turn on ${studentRole}'s ${device} on Teacher App`,
            async function () {
                await teacherTurnOnStudentDeviceOnTeacherApp(teacher, userId, device);
            }
        );
    }
);

Given(
    "{string} has requested to turn on {string}'s camera and microphone and learner accepted it",
    async function (teacherRole: AccountRoles, studentRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        const userId = getUserIdFromRole(this, studentRole);

        await teacher.instruction(
            `${teacherRole} has requested turn on ${studentRole}'s camera and learner accepted it`,
            async function () {
                await teacherTurnOnStudentDeviceOnTeacherApp(teacher, userId, 'camera');
                await learnerTapActionFromRequestModalOnLearnerApp(learner, 'accepts');
            }
        );

        await teacher.instruction(
            `${teacherRole} has requested turn on ${studentRole}'s microphone and learner accepted it`,
            async function () {
                await teacherTurnOnStudentDeviceOnTeacherApp(teacher, userId, 'speaker');
                await learnerTapActionFromRequestModalOnLearnerApp(learner, 'accepts');
            }
        );
    }
);

Given(
    "{string} has accepted teacher's request on Learner App",
    async function (studentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);

        await learner.instruction(
            `${studentRole} has accepted teacher's request on Learner App`,
            async function () {
                await learnerTapActionFromRequestModalOnLearnerApp(learner, 'accepts');
            }
        );
    }
);

When(
    '{string} turns off {string} camera and microphone on Teacher App',
    async function (teacherRole: AccountRoles, studentRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);

        const learnerId = getUserIdFromRole(this, studentRole);

        await teacher.instruction(
            `${teacherRole} turn off ${studentRole} camera and microphone on Teacher App`,
            async function () {
                await teacherTurnOffStudentDeviceOnTeacherApp(teacher, learnerId, 'camera');
                await teacherTurnOffStudentDeviceOnTeacherApp(teacher, learnerId, 'speaker');
            }
        );
    }
);

Then(
    `{string} sees {string} stream with camera and microphone {string} in the main screen on Teacher App`,
    async function (
        teacherRole: AccountRoles,
        userRole: AccountRoles,
        status: StatusCameraAndSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this, userRole);
        await teacher.instruction(
            `${teacherRole} sees ${userRole} stream with camera and microphone ${status} in the main screen on Teacher App`,
            async function () {
                await checkPinnedUserViewVisibleOnTeacherApp(teacher, userId, true, status);
                await teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
                    teacher,
                    userId,
                    status === 'active'
                );
            }
        );
    }
);

Then(
    `{string} sees {string} {string} camera and microphone icon in student list on Teacher App`,
    async function (role: AccountRoles, active: string, studentRole: AccountRoles) {
        const studentId = getUserIdFromRole(this, studentRole);
        const iconActive = active === 'active';
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${active} ${studentRole} camera and microphone icon in student list on Teacher App`,
            async function () {
                await teacherSeesStatusSpeakerIconInStudentListOnTeacherApp(
                    teacher,
                    iconActive,
                    studentId
                );
                await teacherSeesStatusCameraIconInStudentListOnTeacherApp(
                    teacher,
                    iconActive,
                    studentId
                );
            }
        );
    }
);

Then(
    '{string} sees {string} camera and microphone icon on Learner App',
    async function (role: AccountRoles, active: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const iconActive = active === 'active';
        await learner.instruction(
            `${role} sees ${active} camera and microphone icon on Learner App`,
            async function () {
                await speakerOfLearnerIs(learner, iconActive);
                await cameraOfLearnerIs(learner, iconActive);
            }
        );
    }
);
