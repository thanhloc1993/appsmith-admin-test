import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x/dist/common/find';

export async function teacherSeesPreviewButtonOnMainBar(
    teacher: TeacherInterface,
    active: boolean
) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(TeacherKeys.previewButtonKey(active)));
}

export async function teacherCannotSeePreviewButtonOnMainBar(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await driver.waitForAbsent(new ByValueKey(TeacherKeys.previewButtonKey(false)));
    await driver.waitForAbsent(new ByValueKey(TeacherKeys.previewButtonKey(true)));
}
