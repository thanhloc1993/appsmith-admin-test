import { ManabieAgoraKeys } from '@common/manabie-agora-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { teacherTapsUserButtonToShowStudentList } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

export async function teacherDoesNotSeeAnnotateIconOfStudentInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string
) {
    await teacherTapsUserButtonToShowStudentList(teacher);

    const driver = teacher.flutterDriver!;

    const activeAnnotateButtonKey = new ByValueKey(
        ManabieAgoraKeys.multiWhiteboardAnnotationButton(learnerId, true)
    );
    const inactiveAnnotateButtonKey = new ByValueKey(
        ManabieAgoraKeys.multiWhiteboardAnnotationButton(learnerId, false)
    );

    await driver.waitForAbsent(activeAnnotateButtonKey);
    await driver.waitForAbsent(inactiveAnnotateButtonKey);
}
