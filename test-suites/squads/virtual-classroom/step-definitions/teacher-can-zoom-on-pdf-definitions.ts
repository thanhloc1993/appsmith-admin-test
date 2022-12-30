import { WhiteboardKeys } from '@common/whiteboard-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey, delay } from 'flutter-driver-x';

export async function seesDefaultPenToolIconInWhiteBoardOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const pencilToolIcon = new ByValueKey(`${WhiteboardKeys.selectorToolKey} - pencil - true`);

    await driver.waitFor(pencilToolIcon);
}

export async function assertZoomInAndOutControllerVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const zoomInAndOutController = new ByValueKey(WhiteboardKeys.zoomInAndOutPdfController);

    if (visible) {
        await driver.waitFor(zoomInAndOutController);
    } else {
        await driver.waitForAbsent(zoomInAndOutController);
    }
}

export async function assertMovePdfControllerVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const movePdfController = new ByValueKey(WhiteboardKeys.movePdfController);

    if (visible) {
        await driver.waitFor(movePdfController);
    } else {
        await driver.waitForAbsent(movePdfController);
    }
}

export async function assertSharingPdfWithZoomRatio(teacher: TeacherInterface, percentage: string) {
    const driver = teacher.flutterDriver!;
    const currentPercentageText = new ByValueKey(
        `${WhiteboardKeys.currentZoomPercentage} ${percentage}`
    );

    await driver.waitFor(currentPercentageText, 10000);
}

export async function selectsZoomInTool(teacher: TeacherInterface, { boolean: isUsing = false }) {
    const driver = teacher.flutterDriver!;
    const zoomInToolButton = new ByValueKey(
        `${WhiteboardKeys.selectorToolKey} - zoomIn - ${isUsing}`
    );

    await driver.tap(zoomInToolButton);
}

export async function zoomsInPdfOnTeacher(teacher: TeacherInterface, count: number) {
    const driver = teacher.flutterDriver!;
    const zoomInButton = new ByValueKey(WhiteboardKeys.zoomInButton);
    for (let i = 0; i < count; i++) {
        await driver.tap(zoomInButton);
        // DeBouncer in Teacher App
        await delay(500);
    }
}

export async function zoomsOutPdfOnTeacher(teacher: TeacherInterface, count: number) {
    const driver = teacher.flutterDriver!;
    const zoomOutButton = new ByValueKey(WhiteboardKeys.zoomOutButton);
    for (let i = 0; i < count; i++) {
        await driver.tap(zoomOutButton);
        // DeBouncer in Teacher App
        await delay(500);
    }
}

export async function seesDefaultPenToolIconInWhiteBoardOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const pencilToolIcon = new ByValueKey(`${WhiteboardKeys.selectorToolKey} - pencil - true`);

    await driver.waitFor(pencilToolIcon);
}
