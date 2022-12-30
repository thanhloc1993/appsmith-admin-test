import { ManabieAgoraKeys } from '@common/manabie-agora-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherDoesNotSeeStudentInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string
) {
    const driver = teacher.flutterDriver!;
    const student = new ByValueKey(ManabieAgoraKeys.userRowInJoinedSection(learnerId));
    await driver.waitForAbsent(student);
}
