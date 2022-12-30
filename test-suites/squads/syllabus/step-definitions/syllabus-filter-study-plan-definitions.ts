import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectStudyPlan(
    teacher: TeacherInterface,
    studyPlanName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studyPlanDropdown = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDown);

    await driver.tap(studyPlanDropdown);
    await driver.tap(new ByValueKey(SyllabusTeacherKeys.studentStudyPlanName(studyPlanName)));
}
