import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherIsNotRedirectedToSetUpPollingPageOnTeacherApp(
    teacher: TeacherInterface
) {
    const driver = teacher.flutterDriver!;
    const setUpPollingView = TeacherKeys.setUpPollingView;
    await driver.waitForAbsent(new ByValueKey(setUpPollingView));
}
