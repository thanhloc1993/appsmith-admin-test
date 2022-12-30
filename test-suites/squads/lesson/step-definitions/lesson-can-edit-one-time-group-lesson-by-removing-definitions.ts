import { TeacherKeys } from '@common/teacher-keys';

import { CMSInterface, TeacherInterface } from '@supports/app-types';

import {
    classAutoCompleteV3,
    columnStudentName,
    lessonInfoTeachers,
    removeAutocompleteClass,
    studentInfoNoData,
} from '../common/cms-selectors';
import { ByValueKey } from 'flutter-driver-x';

export async function assertTeacherNameExistInLessonDetailPageOnCMS(
    cms: CMSInterface,
    teacherName: string,
    exist: boolean
) {
    const contents = await cms.page!.textContent(lessonInfoTeachers);
    weExpect(
        contents?.includes(teacherName),
        `Teacher name is ${exist ? 'exist' : 'not exist'}`
    ).toEqual(exist);
}

export async function assertStudentNameExistInLessonDetailPageOnCMS(
    cms: CMSInterface,
    studentName: string,
    exist: boolean
) {
    const tableRowData = cms.page!.locator(columnStudentName);
    const content = await tableRowData.allTextContents();
    weExpect(
        content?.includes(studentName) ?? false,
        `Student Name is ${exist ? 'exist' : 'not exist'}`
    ).toEqual(exist);
}

export async function assertStudentExistInStudentListOnTeacherApp(
    teacher: TeacherInterface,
    studentId: string,
    exist: boolean
) {
    const driver = teacher.flutterDriver!;
    const student = new ByValueKey(TeacherKeys.student(studentId));
    exist ? await driver.waitFor(student) : await driver.waitForAbsent(student);
}

export async function removeClass(cms: CMSInterface) {
    await cms.page!.click(classAutoCompleteV3);
    await cms.page!.click(removeAutocompleteClass);
    await cms.confirmDialogAction();
}

export async function assertClassIsBlank(cms: CMSInterface) {
    const isVisibleTableStudentNoData = await cms.page!.locator(studentInfoNoData).isVisible();
    weExpect(isVisibleTableStudentNoData, 'Is exist table student with no data').toEqual(true);
}
