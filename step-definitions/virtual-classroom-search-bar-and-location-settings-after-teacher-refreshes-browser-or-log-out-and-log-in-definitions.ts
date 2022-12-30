import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherLogoutsTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await driver.tap(new ByValueKey(TeacherKeys.userProfileButton));
    await driver.tap(new ByValueKey(TeacherKeys.logoutButton));
    await driver.tap(new ByValueKey(TeacherKeys.signOutDialogButton));
}
