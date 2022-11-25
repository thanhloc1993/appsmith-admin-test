import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSeesShareScreenBarOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const shareScreenBar = new ByValueKey(TeacherKeys.liveLessonScreenShareBar);
    if (visible) {
        await driver.waitFor(shareScreenBar);
    } else {
        await driver.waitForAbsent(shareScreenBar);
    }
}
