import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { CameraOrSpeaker } from './lesson-learner-turn-off-speaker-and-camera-steps';
import {
    checkStudentDeviceStatusInStudentListOnTeacherApp,
    teacherSeesDeviceStatusOfOtherInGalleryViewOnTeacherApp,
    teacherSeesDeviceStatusOnTeacherApp,
    teacherTurnOffAllStudentDeviceOnTeacherApp,
    teacherTurnOffDeviceOnTeacherApp,
    teacherTurnOffStudentDeviceOnTeacherApp,
} from './lesson-teacher-turn-off-speaker-and-camera-definitions';
import { StatusCameraAndSpeaker } from './lesson-turn-on-speaker-and-camera-definitions';
import { getUserIdFromRole } from './lesson-utils';
import { getTeacherInterfaceFromRole, getUserProfileFromContext } from './utils';

Then(
    'all teachers see {string} {string} {string} mode on Teacher App',
    async function (
        this: IMasterWorld,
        deviceStatus: StatusCameraAndSpeaker,
        studentRole: AccountRoles,
        device: CameraOrSpeaker
    ) {
        const teacherRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];

        const learnerProfileFromContext = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );
        const studentId = learnerProfileFromContext.id;

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);

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

When(
    '{string} turns off their {string} on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, device: CameraOrSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(`${role} turn off ${device}`, async function () {
            await teacherTurnOffDeviceOnTeacherApp(teacher, device);
        });
    }
);

Then(
    '{string} sees {string} {string} mode on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        deviceStatus: StatusCameraAndSpeaker,
        device: CameraOrSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(`${role} turn off ${device}`, async function () {
            await teacherSeesDeviceStatusOnTeacherApp(teacher, deviceStatus, device);
        });
    }
);

Then(
    '{string} sees {string} {string} {string} mode on Teacher App',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        deviceStatus: StatusCameraAndSpeaker,
        otherTeacherRole: AccountRoles,
        device: CameraOrSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const otherTeacherUserId = getUserIdFromRole(this, otherTeacherRole);

        await teacher.instruction(
            `${teacherRole} sees ${deviceStatus} ${otherTeacherRole}'s ${device} on Teacher App`,
            async function () {
                await teacherSeesDeviceStatusOfOtherInGalleryViewOnTeacherApp(
                    teacher,
                    deviceStatus,
                    device,
                    otherTeacherUserId
                );
            }
        );
    }
);

When(
    '{string} turns off {string} {string} on Teacher App',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        studentRole: AccountRoles,
        device: CameraOrSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        )!;
        const learnerId = learnerProfile.id;

        await teacher.instruction(
            `${teacherRole} turn off ${studentRole}'s ${device}`,
            async function () {
                await teacherTurnOffStudentDeviceOnTeacherApp(teacher, learnerId, device);
            }
        );
    }
);

When(
    '{string} turns off all students {string} on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, device: CameraOrSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(`${role} turn off all student's ${device}`, async function () {
            await teacherTurnOffAllStudentDeviceOnTeacherApp(teacher, device);
        });
    }
);

Then(
    "all teachers see {string} students's {string} mode on Teacher App",
    async function (
        this: IMasterWorld,
        deviceStatus: StatusCameraAndSpeaker,
        device: CameraOrSpeaker
    ) {
        const teacherRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];
        const learnerRoles: AccountRoles[] = ['student S1', 'student S2'];

        const masterWorld: IMasterWorld = this!;

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(masterWorld, teacherRole);

            await teacher.instruction(
                `${teacherRole} sees all student's camera and speaker are ${deviceStatus}`,
                async function () {
                    for (const learnerRole of learnerRoles) {
                        const learnerId = getUserIdFromRole(masterWorld, learnerRole);

                        await checkStudentDeviceStatusInStudentListOnTeacherApp(
                            teacher,
                            deviceStatus,
                            device,
                            learnerId
                        );

                        await teacherSeesDeviceStatusOfOtherInGalleryViewOnTeacherApp(
                            teacher,
                            deviceStatus,
                            device,
                            learnerId
                        );
                    }
                }
            );
        }
    }
);
