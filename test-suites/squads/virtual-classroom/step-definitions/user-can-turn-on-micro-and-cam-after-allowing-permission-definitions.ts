import { LearnerKeys } from '@common/learner-key';
import { ManabieUiKeys } from '@common/manabie-ui-keys';
import { TeacherKeys } from '@common/teacher-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherTurnsTheirSpeakerOnTeacherApp(
    teacher: TeacherInterface,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const speakerButton = new ByValueKey(TeacherKeys.microButtonLiveLessonActive(active));
    await driver.tap(speakerButton);
}

export async function teacherTurnsTheirCameraOnTeacherApp(
    teacher: TeacherInterface,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const cameraButton = new ByValueKey(TeacherKeys.cameraButtonLiveLessonActive(active));
    await driver.tap(cameraButton);
}

export async function clearCameraAndMicroPermissionOnTeacherApp(teacher: TeacherInterface) {
    await teacher.page!.context().clearPermissions();
}

export async function clearCameraAndMicroPermissionOnLearnerApp(learner: LearnerInterface) {
    await learner.page!.context().clearPermissions();
}

export async function grantCameraAndMicroPermissionOnTeacherApp(teacher: TeacherInterface) {
    await teacher.page!.context().grantPermissions(['camera', 'microphone']);
}

export async function grantCameraAndMicroPermissionOnLearnerApp(learner: LearnerInterface) {
    await learner.page!.context().grantPermissions(['camera', 'microphone']);
}

export async function assertGuidingTurnOnMicAndCamAlertDialogVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const guidingDialog = new ByValueKey(ManabieUiKeys.guidingTurnOnCameraAndMicrophoneDialog);
    if (visible) {
        await driver.waitFor(guidingDialog);
    } else {
        await driver.waitForAbsent(guidingDialog);
    }

    const closeDialogButton = new ByValueKey(ManabieUiKeys.closeDialogButton);
    if (visible) {
        await driver.tap(closeDialogButton);
    }
}

export async function assertGuidingTurnOnMicAndCamAlertDialogVisibleOnLearnerApp(
    learner: LearnerInterface,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const guidingDialog = new ByValueKey(ManabieUiKeys.guidingTurnOnCameraAndMicrophoneDialog);
    if (visible) {
        await driver.waitFor(guidingDialog);
    } else {
        await driver.waitForAbsent(guidingDialog);
    }

    const closeDialogButton = new ByValueKey(ManabieUiKeys.closeDialogButton);
    if (visible) {
        await driver.tap(closeDialogButton);
    }
}

export async function assertSpeakerStatusInGalleryViewOnLearnerApp(
    learner: LearnerInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const speakerIcon = new ByValueKey(
        VirtualClassroomKeys.liveLessonSpeakerStatus(userId, active)
    );
    await driver.waitFor(speakerIcon);
}

export async function assertCameraViewActiveInGalleryViewOnLearnerApp(
    learner: LearnerInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;
    const noneCameraView = new ByValueKey(VirtualClassroomKeys.liveLessonNoneCameraView(userId));
    const cameraView = new ByValueKey(VirtualClassroomKeys.cameraDisplay(userId, active));
    if (active) {
        await driver.waitForAbsent(noneCameraView);
        await driver.waitFor(cameraView);
    } else {
        await driver.waitFor(noneCameraView);
        await driver.waitFor(cameraView);
    }
}

export async function assertSpeakerStatusInGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const speakerIcon = new ByValueKey(
        VirtualClassroomKeys.liveLessonSpeakerStatus(userId, active)
    );
    await driver.waitFor(speakerIcon);
}

export async function assertCameraViewActiveInGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const noneCameraView = new ByValueKey(VirtualClassroomKeys.liveLessonNoneCameraView(userId));
    const cameraView = new ByValueKey(VirtualClassroomKeys.cameraDisplay(userId, active));
    await driver.runUnsynchronized(async () => {
        if (active) {
            await driver.waitForAbsent(noneCameraView);
        } else {
            await driver.waitFor(noneCameraView);
        }

        await driver.waitFor(cameraView);
    });
}

export async function rejoinsLessonAfterReloadThePageOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = learner.flutterDriver!;
    if (!driver.isApp()) {
        const drawerButton = new ByValueKey(LearnerKeys.homeScreenDrawerButton);
        await driver.tap(drawerButton, 10000);
    }

    const lessonTab = new ByValueKey(VirtualClassroomKeys.lessonTab);
    await driver.tap(lessonTab);

    const lessonItem = new ByValueKey(VirtualClassroomKeys.liveLessonItem(lessonId, lessonName));
    await driver.waitFor(lessonItem, 20000);

    const joinLessonButton = new ByValueKey(
        VirtualClassroomKeys.joinLiveLessonButton(lessonId, lessonName, true)
    );
    await driver.tap(joinLessonButton);

    await driver.runUnsynchronized(async () => {
        const waitingRoom = new ByValueKey(VirtualClassroomKeys.waitingRoomBanner);
        await driver.waitForAbsent(waitingRoom, 60 * 1000);
    });
}
