import { ManabieAgoraKeys } from '@common/manabie-agora-keys';
import { TeacherKeys } from '@common/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import {
    teacherTapsUserButtonToShowStudentList,
    turnOwnRaiseHandOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

export async function learnerTurnsOffRaiseHandOnLearnerApp(
    learner: LearnerInterface
): Promise<void> {
    await turnOwnRaiseHandOnLearnerApp(learner, true);
}

export async function teacherTurnsOffRaiseHandOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string,
    index: number
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsUserButtonToShowStudentList(teacher);
    const raiseHandButton = new ByValueKey(
        ManabieAgoraKeys.raiseHandButtonOfStudent(learnerId, index)
    );
    await driver.tap(raiseHandButton, 10000);
}

export async function teacherHandsOffAllStudentRaiseHandOnTeacherApp(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsUserButtonToShowStudentList(teacher);
    const handOffAllRaiseHandButton = new ByValueKey(TeacherKeys.handOffButton);
    await driver.tap(handOffAllRaiseHandButton);
}

export async function teacherDoesNotSeeAnyActiveRaiseHandIconInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    learnerIds: string[]
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsUserButtonToShowStudentList(teacher);
    for (const id of learnerIds) {
        await driver.waitForAbsent(
            new ByValueKey(ManabieAgoraKeys.raiseHandButtonOfStudent(id, 0)),
            10000
        );
        await driver.waitForAbsent(
            new ByValueKey(ManabieAgoraKeys.raiseHandButtonOfStudent(id, 1)),
            10000
        );
    }
}
