import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByText, ByValueKey } from 'flutter-driver-x';

export async function teacherSeesTheSchoolDateColumn(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList));
    await driver.waitFor(new ByText('SCHOOL DATE'));
}

export async function teacherDoesNotSeeTheSchoolDateColumn(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList));
    await driver.waitForAbsent(new ByText('SCHOOL DATE'));
}
