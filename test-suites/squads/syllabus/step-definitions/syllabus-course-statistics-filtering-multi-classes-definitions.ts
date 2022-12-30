import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Classes, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export const teacherClicksClassesFilter = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const selectClassDropDownKey = new ByValueKey(SyllabusTeacherKeys.selectClassDropDown);
    await driver.tap(selectClassDropDownKey);
};

export const teacherClicksHideClassesFilter = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    await driver.webDriver!.page.mouse.click(1, 1);
};

export const teacherClicksAllClassesOption = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const allClassesOptionKey = new ByValueKey(SyllabusTeacherKeys.allClassMenuItem);
    await driver.tap(allClassesOptionKey);
};

export const teacherSeesAllClassesOption = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const allClassesOptionKey = new ByValueKey(SyllabusTeacherKeys.allClassMenuItem);
    await driver.waitFor(allClassesOptionKey);
};

export const teacherSeesClassesOptionWithOrder = async (
    teacher: TeacherInterface,
    index: number,
    className: Classes
) => {
    const driver = teacher.flutterDriver!;
    const classOptionKey = new ByValueKey(className + `${index}`);
    await driver.waitFor(classOptionKey);
};
