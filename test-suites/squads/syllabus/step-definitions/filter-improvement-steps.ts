import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Then } from '@cucumber/cucumber';

import { ByValueKey } from 'flutter-driver-x';

Then('teacher sees LO name and student search boxes', async function () {
    const teacher = this.teacher;
    const searchByStudentNameTextfield = new ByValueKey(
        SyllabusTeacherKeys.searchByStudentNameTextfield
    );
    const searchByLONameTextfield = new ByValueKey(
        SyllabusTeacherKeys.searchByStudentNameTextfield
    );

    await teacher.instruction('teacher sees LO Name search box', async () => {
        await teacher.flutterDriver?.waitFor(searchByLONameTextfield);
    });
    await teacher.instruction('teacher sees student name search box', async () => {
        await teacher.flutterDriver?.waitFor(searchByStudentNameTextfield);
    });
});

Then('teacher sees default for LO name and student search boxes is empty', async function () {
    const teacher = this.teacher;
    const searchByStudentNameTextfield = new ByValueKey(
        SyllabusTeacherKeys.searchByStudentNameTextfield
    );
    const searchByLONameTextfield = new ByValueKey(
        SyllabusTeacherKeys.searchByStudentNameTextfield
    );

    await teacher.instruction('teacher sees LO Name search box is empty', async () => {
        const loNameSearchBoxText = await teacher.flutterDriver?.getText(searchByLONameTextfield);
        weExpect(loNameSearchBoxText).toEqual('');
    });
    await teacher.instruction('teacher sees student name search box is empty', async () => {
        const studentNameSearchBoxText = await teacher.flutterDriver?.getText(
            searchByStudentNameTextfield
        );
        weExpect(studentNameSearchBoxText).toEqual('');
    });
});
