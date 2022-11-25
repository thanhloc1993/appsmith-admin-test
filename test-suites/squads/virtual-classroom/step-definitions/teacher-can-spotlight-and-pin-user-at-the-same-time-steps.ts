import { checkStudentDeviceStatusInStudentListOnTeacherApp } from '@legacy-step-definitions/lesson-teacher-turn-off-speaker-and-camera-definitions';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUserIdFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheMainScreenOnTeacherApp,
    userCameraVisibilityOnMainScreenOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-can-spotlight-and-pin-user-at-the-same-time-definitions';
import {
    CameraOrSpeaker,
    StatusCameraAndSpeaker,
} from 'test-suites/squads/virtual-classroom/utils/types';

Given(
    'all teachers have seen {string} {string} {string} mode on Teacher App',
    async function (
        deviceStatus: StatusCameraAndSpeaker,
        studentRole: AccountRoles,
        device: CameraOrSpeaker
    ) {
        const masterWorld = this!;
        const teacherRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];
        const studentId = getUserIdFromRole(this.scenario, studentRole);

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(masterWorld, role);

            await teacher.instruction(
                `${role} sees ${studentRole}'s ${device} is ${deviceStatus}`,
                async function () {
                    await checkStudentDeviceStatusInStudentListOnTeacherApp(
                        teacher,
                        deviceStatus,
                        device,
                        studentId
                    );
                }
            );
        }
    }
);

Then(
    `{string} sees {string} stream is covered with white frame in the main screen on Teacher App`,
    async function (teacherRole: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);

        await teacher.instruction(
            `${teacherRole} sees ${userRole} stream is covered with white frame in the gallery view on Teacher App`,
            async function () {
                await teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheMainScreenOnTeacherApp(
                    teacher,
                    userId,
                    true
                );
            }
        );
    }
);

Then(
    `{string} sees {string} stream with camera {string} in the main screen on Teacher App`,
    async function (
        teacherRole: AccountRoles,
        userRole: AccountRoles,
        status: StatusCameraAndSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);

        await teacher.instruction(
            `check ${userRole}'s camera is visible on main screen`,
            async function () {
                await userCameraVisibilityOnMainScreenOnTeacherApp(teacher, userId, true, status);
            }
        );
    }
);
