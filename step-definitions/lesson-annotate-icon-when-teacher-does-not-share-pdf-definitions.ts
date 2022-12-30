import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { teacherTapsUserButtonToShowStudentList } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

export async function teacherDoesNotSeeAnnotateIconInStudentListOnTeacherApp(
    teacher: TeacherInterface
) {
    const driver = teacher.flutterDriver!;

    await teacherTapsUserButtonToShowStudentList(teacher);

    await driver.waitForAbsent(
        new ByValueKey(VirtualClassroomKeys.multiWhiteboardAnnotationButton(true))
    );
    await driver.waitForAbsent(
        new ByValueKey(VirtualClassroomKeys.multiWhiteboardAnnotationButton(false))
    );
}
