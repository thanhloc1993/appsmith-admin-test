import { ManabieAgoraKeys } from '@common/manabie-agora-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function assertStudentVisibleInJoinedSectionStudentListOnTeacherApp(
    teacher: TeacherInterface,
    studentUserId: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const studentRow = new ByValueKey(ManabieAgoraKeys.userRowInJoinedSection(studentUserId));
    if (visible) {
        await driver.waitFor(studentRow);
    } else {
        await driver.waitForAbsent(studentRow);
    }
}

export async function assertStudentVisibleInUnjoinedSectionStudentListOnTeacherApp(
    teacher: TeacherInterface,
    studentUserId: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const studentRow = new ByValueKey(VirtualClassroomKeys.userRowInUnjoinedSection(studentUserId));
    if (visible) {
        await driver.waitFor(studentRow);
    } else {
        await driver.waitForAbsent(studentRow);
    }
}
