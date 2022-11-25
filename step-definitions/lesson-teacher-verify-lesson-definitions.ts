import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function seesTheNewLessonOnTeacherApp(
    teacher: TeacherInterface,
    courseId: string,
    lessonNames: string[]
) {
    await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);

    await seesTheLessonOnTeacherApp(teacher, lessonNames);
}

export async function seesTheLessonOnTeacherApp(teacher: TeacherInterface, lessonNames: string[]) {
    const driver = teacher.flutterDriver!;

    // We need map all lessons to string and use it to check on App
    const names = lessonNames.join('');

    await teacher.instruction(`Teacher sees the lessons have names ${names}`, async function () {
        const listActiveLesson = new ByValueKey(TeacherKeys.listActiveLesson(names));
        await driver.waitFor(listActiveLesson);
    });
}

export async function goToCourseDetailOnTeacherApp(teacher: TeacherInterface, courseName: string) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction('Teacher go to course detail', async function () {
        const liveCourseItem = new ByValueKey(TeacherKeys.course(courseName));
        await driver.tap(liveCourseItem, 20000);
    });
}

export async function goToCourseDetailOnTeacherAppByCourseId(
    teacher: TeacherInterface,
    courseId: string
) {
    const driver = teacher.flutterDriver!;

    // go to course detail
    const websiteDomain = await driver.webDriver?.getUrlOrigin();
    const url = `${websiteDomain}courseDetail?course_id=${courseId}`;
    await driver.webDriver?.page.goto(url);
    await driver.waitFor(new ByValueKey(TeacherKeys.courseDetailsScreen), 10000);
}

export async function seesWaitingRoomBannerOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction('Sees waiting room banner', async function () {
        const waitingRoomBanner = new ByValueKey(TeacherKeys.waitingRoomBanner);
        await driver.waitFor(waitingRoomBanner, 10000);
    });
}
