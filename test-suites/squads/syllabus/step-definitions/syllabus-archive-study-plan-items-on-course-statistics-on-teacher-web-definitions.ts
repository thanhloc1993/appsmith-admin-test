import { TeacherKeys } from '@common/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectsArchive(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const archiveButton = new ByValueKey(
        TeacherKeys.courseStatisticsArchiveStudyPlanItemsMenuPopupButton
    );
    await driver.tap(archiveButton);
}
