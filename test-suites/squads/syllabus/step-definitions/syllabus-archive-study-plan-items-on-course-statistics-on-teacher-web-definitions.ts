import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectsArchive(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const archiveButton = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsArchiveStudyPlanItemsMenuPopupButton
    );
    await driver.tap(archiveButton);
}