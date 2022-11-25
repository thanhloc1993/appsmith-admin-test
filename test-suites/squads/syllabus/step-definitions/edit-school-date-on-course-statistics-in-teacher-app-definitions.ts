import { TeacherKeys } from '@common/teacher-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import { DateType } from './syllabus-update-study-plan-item-time-definitions';
import { ByText, ByValueKey } from 'flutter-driver-x/dist/common/find';

export async function teacherTapsOnEditSchoolDateButton(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const editSchoolDate = new ByValueKey(TeacherKeys.editStudyPlanItemSchoolDateMenuPopupButton);
    await driver.waitFor(editSchoolDate);
    await driver.tap(editSchoolDate);
}

export async function teacherEditsSchoolDateForStudents(
    teacher: TeacherInterface,
    date: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherPickDateTimeOnCourseStatisticsDetail(teacher, date, 'school date');
    await driver.tap(new ByValueKey(TeacherKeys.okEditStudyPlanItemTimeButton));
}

export async function teacherPickDateTimeOnCourseStatisticsDetail(
    teacher: TeacherInterface,
    date: Date,
    type: DateType
): Promise<void> {
    const driver = teacher.flutterDriver!;
    let datePickerKey: string;

    switch (type) {
        case 'start date':
            datePickerKey = SyllabusTeacherKeys.courseStatisticsStudyPlanItemStartDatePicker;
            break;
        case 'end date':
            datePickerKey = SyllabusTeacherKeys.courseStatisticsStudyPlanItemEndDatePicker;
            break;
        case 'school date':
            datePickerKey = SyllabusTeacherKeys.studyPlanItemSchoolDatePicker;
            break;
    }

    await driver.tap(new ByValueKey(datePickerKey));

    await driver.tap(new ByText(`${date.getDate()}`));

    await driver.tap(new ByText('OK'));
    if (type != 'school date') {
        await driver.tap(new ByText('OK'));
    }
}

export async function teacherSeesTheSchoolDateEdited(
    teacher: TeacherInterface,
    date: Date,
    studentName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;

    let schoolDateStr = '--';
    const thisYear = new Date().getFullYear();

    if (thisYear != date.getFullYear()) {
        schoolDateStr = formatDate(date, 'YYYY/MM/DD');
    } else {
        schoolDateStr = formatDate(date, 'MM/DD');
    }

    const studyPlanItemSchoolDate = new ByValueKey(
        TeacherKeys.studyPlanItemV2SchoolDate(studentName, schoolDateStr)
    );

    await driver.waitFor(studyPlanItemSchoolDate);
}
