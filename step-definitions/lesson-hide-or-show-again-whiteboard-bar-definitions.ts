import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherShowsWhiteboardBarOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const toolButton = new ByValueKey(TeacherKeys.annotationButton);
    await driver.tap(toolButton);
}

export async function teacherHidesWhiteboardBarByTool(teacher: TeacherInterface, tool: string) {
    const driver = teacher.flutterDriver!;
    let toolButton;
    if (tool === 'icon in action bar') {
        toolButton = new ByValueKey(TeacherKeys.annotationButton);
    } else {
        toolButton = new ByValueKey(TeacherKeys.closeAnnotationButton);
    }
    await driver.tap(toolButton);
}

export async function teacherSeesWhiteboardBarOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const whiteboardBar = new ByValueKey(TeacherKeys.annotationBar);
    if (visible) {
        await driver.waitFor(whiteboardBar, 10000);
    } else {
        await driver.waitForAbsent(whiteboardBar, 10000);
    }
}

export async function teacherSeesAnnotateIconOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const annotateIcon = new ByValueKey(TeacherKeys.annotationButton);
    if (visible) {
        await driver.waitFor(annotateIcon, 10000);
    } else {
        await driver.waitForAbsent(annotateIcon, 10000);
    }
}

export async function learnerShowsWhiteboardBarOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const toolButton = new ByValueKey(LearnerKeys.annotationButton);
    await driver.tap(toolButton);
}

export async function learnerHidesWhiteboardBarByTool(learner: LearnerInterface, tool: string) {
    const driver = learner.flutterDriver!;
    let toolButton;
    if (tool === 'icon in action bar') {
        toolButton = new ByValueKey(LearnerKeys.annotationButton);
    } else {
        toolButton = new ByValueKey(LearnerKeys.closeAnnotationBarButton);
    }
    await driver.tap(toolButton);
}
