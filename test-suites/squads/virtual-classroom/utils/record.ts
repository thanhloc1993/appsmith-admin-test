import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherStartsRecordTheLesson(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const startRecordButton = new ByValueKey(VirtualClassroomKeys.startRecordButton);
    await driver.tap(startRecordButton);

    const confirmDialog = new ByValueKey(VirtualClassroomKeys.confirmRecordingDialog);
    const startButton = new ByValueKey(VirtualClassroomKeys.startConfirmRecordingDialogButton);
    await driver.waitFor(confirmDialog);
    await driver.tap(startButton);
}

export async function teacherStopsRecordTheLesson(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const stopRecordButton = new ByValueKey(VirtualClassroomKeys.stopRecordButtonInteraction(true));
    await driver.tap(stopRecordButton);
}

export async function assertRecordButtonVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const startRecordButton = new ByValueKey(VirtualClassroomKeys.startRecordButton);
    if (visible) {
        await driver.waitFor(startRecordButton);
    } else {
        await driver.waitForAbsent(startRecordButton);
    }
}

export async function assertRecordInProgressSnackBarVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const snackBar = new ByValueKey(VirtualClassroomKeys.inProgressRecordingSnackBar);
    if (visible) {
        await driver.waitFor(snackBar);
    } else {
        await driver.waitForAbsent(snackBar);
    }
}

export async function assertStopRecordingSnackBarVisible(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const snackBar = new ByValueKey(VirtualClassroomKeys.stopRecordingSnackBar);
    if (visible) {
        await driver.waitFor(snackBar, 15000);
    } else {
        await driver.waitForAbsent(snackBar, 15000);
    }
}

export async function assertStopRecordingButtonWithStateVisibleOnTeacherApp(
    teacher: TeacherInterface,
    state: boolean
) {
    const driver = teacher.flutterDriver!;
    const stopRecordingButton = new ByValueKey(
        VirtualClassroomKeys.stopRecordButtonInteraction(state)
    );
    await driver.waitFor(stopRecordingButton);
}

export async function assertRECIconInTheLeftVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const RECIcon = new ByValueKey(VirtualClassroomKeys.recordIcon);
    if (visible) {
        await driver.waitFor(RECIcon);
    } else {
        await driver.waitForAbsent(RECIcon);
    }
}

export async function assertRECIconInTheLeftVisibleOnLearnerApp(
    learner: LearnerInterface,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const RECIcon = new ByValueKey(VirtualClassroomKeys.recordIcon);
    if (visible) {
        await driver.waitFor(RECIcon);
    } else {
        await driver.waitForAbsent(RECIcon);
    }
}
