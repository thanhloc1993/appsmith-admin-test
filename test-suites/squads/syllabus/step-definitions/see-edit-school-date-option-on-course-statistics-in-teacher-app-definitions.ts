import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherTapsOnStudyPlanItemsName(
    teacher: TeacherInterface,
    studyPlanItemName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studyPlanItemKey = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsStudyPlanItemName(studyPlanItemName)
    );
    await driver.tap(studyPlanItemKey);
}

export async function teacherSelectsTheCheckboxOfStudent(
    teacher: TeacherInterface,
    studentName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const studentNameCheckBoxKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemCheckBox(studentName)
    );

    await driver.waitFor(studentNameCheckBoxKey);

    try {
        await driver.waitFor(studentNameCheckBoxKey);
        await driver.tap(studentNameCheckBoxKey);
    } catch (error) {
        throw Error(`Can not select the checkbox of study plan item ${studentName}`);
    }
}

export async function teacherTapsOnMoreActionButton(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studyPlanDetailMoreButton = new ByValueKey(SyllabusTeacherKeys.studyPlanDetailMoreButton);
    await driver.scrollIntoView(studyPlanDetailMoreButton, 0.0);
    await driver.tap(studyPlanDetailMoreButton);
}

export async function teacherSeesEditSchoolDate(
    teacher: TeacherInterface,
    canSee: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const editSchoolDate = new ByValueKey(
        SyllabusTeacherKeys.editStudyPlanItemSchoolDateMenuPopupButton
    );

    if (canSee) {
        await driver.waitFor(editSchoolDate);
    } else {
        await driver.waitForAbsent(editSchoolDate);
    }
}
