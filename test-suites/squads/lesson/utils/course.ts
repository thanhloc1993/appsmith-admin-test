import { CMSInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { courseContainer } from 'test-suites/squads/lesson/common/cms-selectors';

export async function goToCourseByLinkOnCMS(params: { cms: CMSInterface; courseId: string }) {
    const { cms, courseId } = params;
    await cms.page!.goto(`/syllabus/courses/${courseId}/show`);
    await cms.page!.waitForSelector(courseContainer);
}

export async function goToLiveLessonOnTeacherApp(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
}) {
    const { teacher, courseId, lessonId } = params;

    const driver = teacher.flutterDriver!;
    const websiteDomain = await driver.webDriver!.getUrlOrigin();
    const lessonLink = `${websiteDomain}liveLessonDetailScreen?course_id=${courseId}&lesson_id=${lessonId}`;

    await teacher.instruction(
        `Teacher go to live lesson detail screen by link: ${lessonLink}`,
        async function () {
            await driver.webDriver!.page.goto(lessonLink);
            await driver.waitFor(new ByValueKey('Live Lesson Screen'));
        }
    );
}
