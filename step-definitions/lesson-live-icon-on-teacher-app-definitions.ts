import { TeacherInterface } from '@supports/app-types';

import { teacherWaitForAbsentLessonItem, teacherWaitForLessonItem } from './lesson-teacher-utils';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSeesLessonInActiveListOnTeacherApp(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string,
    shouldDisplay = true
) {
    const driver = teacher.flutterDriver!;

    const activeLessonTab = new ByValueKey(TeacherKeys.lessonActiveTab);
    await driver.tap(activeLessonTab, 20000);

    // Wait for loading lesson
    if (shouldDisplay) return await teacherWaitForLessonItem(teacher, lessonId, lessonName);

    return await teacherWaitForAbsentLessonItem(teacher, lessonId, lessonName);
}

export async function teacherSeesLessonInCompletedListOnTeacherApp(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string,
    shouldDisplay = true
) {
    const driver = teacher.flutterDriver!;

    const activeLessonTab = new ByValueKey(TeacherKeys.lessonCompletedTab);
    await driver.tap(activeLessonTab);
    const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));

    // Wait for loading lesson
    if (shouldDisplay) await driver.waitFor(lessonItem, 30000);
    else await driver.waitForAbsent(lessonItem);
}

export async function teacherSeesLiveLabelOfLessonOnTeacherApp(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = teacher.flutterDriver!;
    const liveLabel = new ByValueKey(TeacherKeys.liveLabelLiveLessonItem(lessonId, lessonName));
    await driver.waitFor(liveLabel);
}

export async function teacherDoesNotSeeLiveLabelOfLessonOnTeacherApp(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = teacher.flutterDriver!;
    const liveLabel = new ByValueKey(TeacherKeys.liveLabelLiveLessonItem(lessonId, lessonName));
    await driver.waitForAbsent(liveLabel);
}
