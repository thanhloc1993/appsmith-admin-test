import { LessonKeys } from '@common/lesson-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectsPollOption(teacher: TeacherInterface, index: number) {
    const driver = teacher.flutterDriver!;
    await teacher.instruction(`Teacher selects poll option`, async function () {
        const pollOption = new ByValueKey(LessonKeys.optionItemSelect(index, false));
        await driver.scrollIntoView(pollOption, 0.0);
        await driver.tap(pollOption);
    });
}

export async function teacherSelectsMultiplePollOption(teacher: TeacherInterface, length: number) {
    for (let i = 0; i < length; i++) {
        await teacherSelectsPollOption(teacher, i);
    }
}
