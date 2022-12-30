import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherTapOnLessonItem(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher go to lesson detail, tap lesson item ${lessonName}, ID: ${lessonId} `,
        async function () {
            await driver.runUnsynchronized(async () => {
                const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));
                await driver.tap(lessonItem, 10000);
            });
        }
    );
}

// I dont add instruction here because in my cases, wait for only a step for precondition to prepare doing something next, and it's not a main action to screenshot
export async function teacherWaitForLessonItem(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = teacher.flutterDriver!;

    await driver.runUnsynchronized(async () => {
        const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));
        await driver.waitFor(lessonItem, 10000);
    });
}

export async function teacherWaitForAbsentLessonItem(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = teacher.flutterDriver!;

    await driver.runUnsynchronized(async () => {
        const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));
        await driver.waitForAbsent(lessonItem, 10000);
    });
}
