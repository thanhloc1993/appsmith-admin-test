import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Classes, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectCourseStatisticsClass(
    teacher: TeacherInterface,
    className: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const classDropdown = new ByValueKey(SyllabusTeacherKeys.classDropdown);

    await driver.tap(classDropdown);
    await driver.tap(
        new ByValueKey(SyllabusTeacherKeys.courseStatisticsClassName(className)),
        5000
    );
}

export async function teacherSelectCourseStatisticsStudyPlan(
    teacher: TeacherInterface,
    studyPlanName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studyPlanDropdown = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsStudyPlanDropdownKey
    );

    await driver.tap(studyPlanDropdown);
    await driver.tap(
        new ByValueKey(SyllabusTeacherKeys.courseStatisticsStudyPlanName(studyPlanName)),
        5000
    );
}

export const teacherSelectCourseStatisticsClassV2 = async (
    teacher: TeacherInterface,
    index: number,
    className: Classes
) => {
    const driver = teacher.flutterDriver!;
    const classOptionKey = new ByValueKey(className + `${index}`);
    await driver.tap(classOptionKey);
};
