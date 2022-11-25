import { LearnerKeys } from '@common/learner-key';
import { ManabieAgoraKeys } from '@common/manabie-agora-keys';
import { TeacherKeys } from '@common/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { teacherTapsUserButtonToShowStudentList } from './turn-on-raise-hand-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { StatusCameraAndSpeaker } from 'test-suites/squads/virtual-classroom/utils/types';

export async function checkSpeakerStatusOnTeacherApp(
    teacher: TeacherInterface,
    deviceStatus: StatusCameraAndSpeaker
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const microStatus = deviceStatus === 'active';
    const microButton = new ByValueKey(TeacherKeys.microButtonLiveLessonActive(microStatus));

    await driver.waitFor(microButton);
}

export async function checkCameraStatusOnTeacherApp(
    teacher: TeacherInterface,
    deviceStatus: StatusCameraAndSpeaker
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const cameraStatus = deviceStatus === 'active';
    const cameraButton = new ByValueKey(TeacherKeys.cameraButtonLiveLessonActive(cameraStatus));

    await driver.waitFor(cameraButton);
}

export async function checkSpeakerAndCameraStatusOnTeacherApp(
    teacher: TeacherInterface,
    deviceStatus: StatusCameraAndSpeaker
): Promise<void> {
    await checkSpeakerStatusOnTeacherApp(teacher, deviceStatus);
    await checkCameraStatusOnTeacherApp(teacher, deviceStatus);
}

export async function checkSpeakerAndCameraStatusOnLearnerApp(
    learner: LearnerInterface,
    deviceStatus: StatusCameraAndSpeaker
): Promise<void> {
    await checkSpeakerStatusOnLearnerApp(learner, deviceStatus);
    await checkCameraStatusOnLearnerApp(learner, deviceStatus);
}

export async function checkSpeakerStatusOnLearnerApp(
    learner: LearnerInterface,
    deviceStatus: StatusCameraAndSpeaker
): Promise<void> {
    const driver = learner.flutterDriver!;

    const microStatus = deviceStatus === 'active';
    const microButton = new ByValueKey(LearnerKeys.microButtonLiveLesson(microStatus));

    await driver.waitFor(microButton);
}

export async function checkCameraStatusOnLearnerApp(
    learner: LearnerInterface,
    deviceStatus: StatusCameraAndSpeaker
): Promise<void> {
    const driver = learner.flutterDriver!;

    const cameraStatus = deviceStatus === 'active';
    const cameraButton = new ByValueKey(LearnerKeys.cameraButtonLiveLesson(cameraStatus));

    await driver.waitFor(cameraButton);
}

export async function turnOwnSpeakerStatusOnLearnerApp(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const microButton = new ByValueKey(LearnerKeys.microButtonLiveLesson(active));
    await driver.tap(microButton);
}

export async function turnOwnCameraStatusOnLearnerApp(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const microButton = new ByValueKey(LearnerKeys.cameraButtonLiveLesson(active));
    await driver.tap(microButton);
}

export async function teacherSeesStatusSpeakerIconInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    iconActive: boolean,
    learnerId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsUserButtonToShowStudentList(teacher);

    const speakerIcon = new ByValueKey(ManabieAgoraKeys.microKeyButton(learnerId, iconActive));
    await driver.runUnsynchronized(async () => {
        await driver.waitFor(speakerIcon, 10000);
    });
}

export async function teacherSeesStatusCameraIconInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    iconActive: boolean,
    learnerId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsUserButtonToShowStudentList(teacher);
    const speakerIcon = new ByValueKey(ManabieAgoraKeys.cameraKeyButton(learnerId, iconActive));
    await driver.waitFor(speakerIcon, 10000);
}

export async function learnerSeesStatusSpeakerIconInGalleryViewOnLearnerApp(
    learner: LearnerInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const speakerIcon = new ByValueKey(LearnerKeys.liveLessonSpeakerStatus(userId, active));
    await driver.waitFor(speakerIcon);
}

export async function learnerSeesCameraViewInGalleryViewOnLearnerApp(
    learner: LearnerInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;
    const noneCameraView = new ByValueKey(LearnerKeys.liveLessonNoneCameraView(userId));
    const cameraView = new ByValueKey(LearnerKeys.cameraDisplay(userId, active));
    if (active) {
        await driver.waitForAbsent(noneCameraView);
        await driver.waitFor(cameraView);
    } else {
        await driver.waitFor(noneCameraView);
        await driver.waitFor(cameraView);
    }
}

export async function teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const speakerIcon = new ByValueKey(TeacherKeys.liveLessonSpeakerStatus(userId, active));
    await driver.waitFor(speakerIcon);
}

export async function teacherSeesCameraViewInGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const noneCameraView = new ByValueKey(TeacherKeys.liveLessonNoneCameraView(userId));
    const cameraView = new ByValueKey(TeacherKeys.cameraDisplay(userId, active));
    await driver.runUnsynchronized(async () => {
        if (active) {
            await driver.waitForAbsent(noneCameraView);
        } else {
            await driver.waitFor(noneCameraView);
        }

        await driver.waitFor(cameraView);
    });
}

export async function cameraOfLearnerIs(learner: LearnerInterface, active: boolean): Promise<void> {
    const driver = learner.flutterDriver!;
    const cameraButtonLiveLesson = new ByValueKey(LearnerKeys.cameraButtonLiveLesson(active));
    await driver.waitFor(cameraButtonLiveLesson);
}

export async function speakerOfLearnerIs(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;
    const cameraButtonLiveLesson = new ByValueKey(LearnerKeys.microButtonLiveLesson(active));
    await driver.waitFor(cameraButtonLiveLesson);
}
