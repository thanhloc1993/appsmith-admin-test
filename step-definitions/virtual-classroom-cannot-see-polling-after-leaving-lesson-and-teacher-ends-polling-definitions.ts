import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherDoesNotSeePollingDetailPageOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const pollingDetailPageKey = new ByValueKey(TeacherKeys.pollingDetailPageKey);
    await driver.waitForAbsent(pollingDetailPageKey);
}
