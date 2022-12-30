import { checkStudentDeviceStatusInStudentListOnTeacherApp } from '@legacy-step-definitions/lesson-teacher-turn-off-speaker-and-camera-definitions';
import { staffProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getUserIdFromRole,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
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
        const studentId = getUserIdFromRole(this.scenario, studentRole);
        const teachers = getUsersFromContextByRegexKeys(this.scenario, staffProfileAlias);
        for (let i = 0; i < teachers.length; i++) {
            const teacher = getTeacherInterfaceFromRole(this, `teacher T${i}` as AccountRoles);
            await teacher.instruction(
                `Teacher teacher T${i} sees ${studentRole}'s ${device} is ${deviceStatus}`,
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
