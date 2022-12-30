import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectsUnarchive(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const unarchiveButton = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsUnarchiveStudyPlanItemsMenuPopupButton
    );
    await driver.tap(unarchiveButton);
}
