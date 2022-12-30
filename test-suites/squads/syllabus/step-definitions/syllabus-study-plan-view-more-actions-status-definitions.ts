import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByText, ByValueKey } from 'flutter-driver-x';

export async function teacherTapsOnStudyPlanItem(
    teacher: TeacherInterface,
    itemName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const loKey = new ByText(itemName);
    await driver.tap(loKey);
}

export async function teacherSelectsMoreActionButton(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studyPlanDetailMoreButton = new ByValueKey(SyllabusTeacherKeys.studyPlanDetailMoreButton);

    await driver.tap(studyPlanDetailMoreButton);
}

export async function teacherSeesEditPopup(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const editButton = new ByValueKey(SyllabusTeacherKeys.editStudyPlanItemTimeButton);
    await driver.waitFor(editButton);
}

export async function teacherNotSeesEditPopup(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const editButton = new ByValueKey(SyllabusTeacherKeys.editStudyPlanItemTimeButton);
    await driver.waitForAbsent(editButton);
}

export async function teacherSelectsCheckboxStudent(
    teacher: TeacherInterface,
    studentName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const studentCheckboxKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemCheckBox(studentName)
    );

    await driver.waitFor(studentCheckboxKey);

    try {
        await driver.tap(studentCheckboxKey);
    } catch (error) {
        throw Error(`Can not select the checkbox of study plan item ${studentName}`);
    }
}
