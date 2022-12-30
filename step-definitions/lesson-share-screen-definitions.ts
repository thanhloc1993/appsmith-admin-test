import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey, delay } from 'flutter-driver-x';

export async function teacherSharesScreenOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const shareScreenButton = new ByValueKey(TeacherKeys.shareScreenButtonActive(false));
    await driver.tap(shareScreenButton);
    await delay(3000); // Delay for other teacher/ learner loading media
}

export async function teacherStopsSharingScreenOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const shareScreenButton = new ByValueKey(TeacherKeys.shareScreenButtonActive(true));
    const stopSharingScreenButton = new ByValueKey(
        TeacherKeys.liveLessonStopShareScreenOptionButton
    );
    await driver.tap(shareScreenButton);
    await driver.tap(stopSharingScreenButton);
}

export async function teacherSeesShareScreenIconOnTeacherApp(
    teacher: TeacherInterface,
    active: boolean
) {
    const driver = teacher.flutterDriver!;
    const shareScreenButton = new ByValueKey(TeacherKeys.shareScreenButtonActive(active));
    await driver.waitFor(shareScreenButton);
}

export async function teacherSeesSharedScreenOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const sharedScreen = new ByValueKey(TeacherKeys.liveLessonSharedScreenView);
    if (visible) {
        await driver.waitFor(sharedScreen, 15000);
    } else {
        await driver.waitForAbsent(sharedScreen, 15000);
    }
}

export async function teacherSeesCannotOverlapShareScreenDialog(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const dialog = new ByValueKey(TeacherKeys.cannotOverlapShareScreenDialog);
    const okButton = new ByValueKey(TeacherKeys.cannotOverlapShareScreenDialogOkButton);
    await driver.waitFor(dialog);
    await driver.tap(okButton);
}

export async function learnerSeesSharedScreenOnLearnerApp(
    learner: LearnerInterface,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const sharedScreen = new ByValueKey(LearnerKeys.liveLessonSharedScreenView);
    if (visible) {
        await driver.waitFor(sharedScreen);
    } else {
        await driver.waitForAbsent(sharedScreen, 15000);
    }
}
