import { ManabieAgoraKeys } from '@common/manabie-agora-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';
import { teacherTapsUserButtonToShowStudentList } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

export async function teacherEnablesWhiteboardForAllLearnerOnTeacherApp(
    teacher: TeacherInterface,
    enable: boolean
) {
    const driver = teacher.flutterDriver!;

    await teacherTapsUserButtonToShowStudentList(teacher);

    const multiWhiteboardAnnotationButton = new ByValueKey(
        VirtualClassroomKeys.multiWhiteboardAnnotationButton(!enable)
    );

    await driver.tap(multiWhiteboardAnnotationButton);
}

export async function teacherEnablesWhiteboardAnnotateForLearner(
    teacher: TeacherInterface,
    learnerId: string,
    enable: boolean
) {
    const driver = teacher.flutterDriver!;

    await teacherTapsUserButtonToShowStudentList(teacher);

    const multiWhiteboardAnnotationButton = new ByValueKey(
        ManabieAgoraKeys.multiWhiteboardAnnotationButton(learnerId, !enable)
    );

    await driver.tap(multiWhiteboardAnnotationButton);
}

export async function teacherSeesAnnotationButtonOnTeacherApp(
    teacher: TeacherInterface,
    active: boolean
) {
    const driver = teacher.flutterDriver!;

    await teacherTapsUserButtonToShowStudentList(teacher);

    const annotationButtonKey = new ByValueKey(
        VirtualClassroomKeys.multiWhiteboardAnnotationButton(active)
    );
    await driver.waitFor(annotationButtonKey);
}

export async function teacherSeesAnnotateIconInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string,
    active: boolean
) {
    await teacherTapsUserButtonToShowStudentList(teacher);

    const driver = teacher.flutterDriver!;
    const annotateButtonKey = new ByValueKey(
        ManabieAgoraKeys.multiWhiteboardAnnotationButton(learnerId, active)
    );
    await driver.waitFor(annotateButtonKey);
}

export async function learnerSeesWhiteboardBarOnLearnerApp(
    learner: LearnerInterface,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const whiteboardBarKey = new ByValueKey(LearnerKeys.annotationBar);

    if (visible) {
        await driver.waitFor(whiteboardBarKey, 10000);
    } else {
        await driver.waitForAbsent(whiteboardBarKey, 60000);
    }
}

export async function learnerSeesAnnotateIconOnLearnerApp(
    learner: LearnerInterface,
    hidden: boolean
) {
    const driver = learner.flutterDriver!;
    const whiteboardBarKey = new ByValueKey(LearnerKeys.annotationButton);

    if (hidden) {
        await driver.waitForAbsent(whiteboardBarKey, 10000);
    } else {
        await driver.waitFor(whiteboardBarKey, 10000);
    }
}
