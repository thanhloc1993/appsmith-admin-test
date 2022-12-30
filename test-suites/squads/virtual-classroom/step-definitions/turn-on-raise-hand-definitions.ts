import { LearnerKeys } from '@common/learner-key';
import { ManabieAgoraKeys } from '@common/manabie-agora-keys';
import { TeacherKeys } from '@common/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function turnOwnRaiseHandOnLearnerApp(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;
    await driver.runUnsynchronized(async () => {
        const raiseHandButton = new ByValueKey(LearnerKeys.raiseHandButton([active]));
        await driver.tap(raiseHandButton);
    });
}

export async function learnerSeesRaiseHandIconOnLearnerApp(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const raiseHandButton = new ByValueKey(LearnerKeys.raiseHandButton([active]));
    await driver.waitFor(raiseHandButton);
}

export async function teacherSeesRaiseHandIconInMainScreenOnTeacherApp(
    teacher: TeacherInterface,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const raiseHandButton = new ByValueKey(TeacherKeys.raiseHandNotificationButton([active]));
    await driver.waitFor(raiseHandButton, 10000);
}

export async function teacherSeesVisibleRaiseHandIconInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string,
    index: number,
    visible: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsUserButtonToShowStudentList(teacher);

    const raiseHandIcon = new ByValueKey(
        ManabieAgoraKeys.raiseHandButtonOfStudent(learnerId, index)
    );
    if (visible) {
        await driver.waitFor(raiseHandIcon, 10000);
    } else {
        await driver.waitForAbsent(raiseHandIcon, 10000);
    }
}

export async function teacherTapsUserButtonToShowStudentList(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const userManagerTab = new ByValueKey(TeacherKeys.liveLessonUserTab);
    const userButton = new ByValueKey(TeacherKeys.userButtonInteraction(true));
    try {
        await driver.waitFor(userManagerTab);
    } catch {
        await driver.tap(userButton);
    }
}

export async function teacherTapsUserButtonToHideStudentList(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const userManagerTab = new ByValueKey(TeacherKeys.liveLessonUserTab);
    const userButton = new ByValueKey(TeacherKeys.userButtonInteraction(true));
    await driver.waitFor(userManagerTab);
    await driver.tap(userButton);
}
