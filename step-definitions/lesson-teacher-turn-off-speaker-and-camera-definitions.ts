import { ManabieAgoraKeys } from '@common/manabie-agora-keys';

import { TeacherInterface } from '@supports/app-types';

import { CameraOrSpeaker } from './lesson-learner-turn-off-speaker-and-camera-steps';
import { cameraOfTeacherIs, speakerOfTeacherIs } from './lesson-rejoin-live-lesson-definitions';
import {
    StatusCameraAndSpeaker,
    teacherSeesCameraViewInGalleryViewOnTeacherApp,
    teacherSeesStatusCameraIconInStudentListOnTeacherApp,
    teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp,
    teacherSeesStatusSpeakerIconInStudentListOnTeacherApp,
} from './lesson-turn-on-speaker-and-camera-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import { teacherTapsUserButtonToShowStudentList } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';
import {
    teacherTurnsTheirCameraOnTeacherApp,
    teacherTurnsTheirSpeakerOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/user-can-turn-on-micro-and-cam-after-allowing-permission-definitions';

export async function checkStudentDeviceStatusInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    deviceStatus: StatusCameraAndSpeaker,
    device: CameraOrSpeaker,
    learnerId: string
) {
    const isActivatedDevice = deviceStatus === 'active';

    if (device === 'camera') {
        await teacherSeesStatusCameraIconInStudentListOnTeacherApp(
            teacher,
            isActivatedDevice,
            learnerId
        );
    } else {
        await teacherSeesStatusSpeakerIconInStudentListOnTeacherApp(
            teacher,
            isActivatedDevice,
            learnerId
        );
    }
}

export async function teacherTurnOffDeviceOnTeacherApp(
    teacher: TeacherInterface,
    device: CameraOrSpeaker
) {
    if (device === 'camera') {
        await teacherTurnsTheirCameraOnTeacherApp(teacher, true);
    } else {
        await teacherTurnsTheirSpeakerOnTeacherApp(teacher, true);
    }
}

export async function teacherSeesDeviceStatusOnTeacherApp(
    teacher: TeacherInterface,
    deviceStatus: StatusCameraAndSpeaker,
    device: CameraOrSpeaker
) {
    const isActivatedDevice = deviceStatus === 'active';
    if (device === 'camera') {
        await cameraOfTeacherIs(teacher, isActivatedDevice);
    } else {
        await speakerOfTeacherIs(teacher, isActivatedDevice);
    }
}

export async function teacherSeesDeviceStatusOfOtherInGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    deviceStatus: StatusCameraAndSpeaker,
    device: CameraOrSpeaker,
    otherUserId: string
) {
    const isActivatedDevice = deviceStatus === 'active';

    if (device === 'camera') {
        await teacherSeesCameraViewInGalleryViewOnTeacherApp(
            teacher,
            otherUserId,
            isActivatedDevice
        );
    } else {
        await teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
            teacher,
            otherUserId,
            isActivatedDevice
        );
    }
}

export async function teacherTurnOffStudentDeviceOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string,
    device: CameraOrSpeaker
) {
    const driver = teacher.flutterDriver!;

    await teacherTapsUserButtonToShowStudentList(teacher);

    if (device === 'camera') {
        const cameraIcon = new ByValueKey(ManabieAgoraKeys.cameraKeyButton(learnerId, true));
        await driver.tap(cameraIcon, 10000);
    } else {
        const speakerIcon = new ByValueKey(ManabieAgoraKeys.microKeyButton(learnerId, true));
        await driver.tap(speakerIcon, 10000);
    }
}

export async function teacherTurnOffAllStudentDeviceOnTeacherApp(
    teacher: TeacherInterface,
    device: CameraOrSpeaker
) {
    const driver = teacher.flutterDriver!;

    await teacherTapsUserButtonToShowStudentList(teacher);
    if (device === 'camera') {
        const muteAllCameraButton = new ByValueKey(TeacherKeys.muteAllCameraButton);
        await driver.tap(muteAllCameraButton);
    } else {
        const muteAllAudioButton = new ByValueKey(TeacherKeys.muteAllAudioButton);
        await driver.tap(muteAllAudioButton);
    }
}
