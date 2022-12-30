import { TeacherInterface } from '@supports/app-types';

export async function teacherGoToLiveLessonDetailByURL(
    teacher: TeacherInterface,
    courseId: string,
    lessonId: string
) {
    const driver = teacher.flutterDriver!;
    const websiteDomain = await driver.webDriver!.getUrlOrigin();
    const lessonLink = `${websiteDomain}liveLessonDetailScreen?course_id=${courseId}&lesson_id=${lessonId}`;

    await teacher.instruction(
        `Teacher go to live lesson detail screen by link: ${lessonLink}`,
        async function () {
            await driver.webDriver!.page.goto(lessonLink);
        }
    );
}
