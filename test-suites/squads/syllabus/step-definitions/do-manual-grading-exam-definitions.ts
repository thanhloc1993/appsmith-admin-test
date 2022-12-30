import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSeeStudyPlanItemOnPopupWithStatus(
    teacher: TeacherInterface,
    status: string
) {
    const statusFinder = new ByValueKey(status);
    await teacher.flutterDriver!.waitFor(statusFinder);
    const result = await teacher.flutterDriver!.getText(statusFinder);
    weExpect(result).toEqual(status);
}
