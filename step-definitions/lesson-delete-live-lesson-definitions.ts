import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { learnerGoToLesson } from './lesson-learner-join-lesson-definitions';
import { teacherWaitForAbsentLessonItem } from './lesson-teacher-utils';
import { goToCourseDetailOnTeacherAppByCourseId } from './lesson-teacher-verify-lesson-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function makeSureTheLessonHasBeenDeletedOnTeacherApp(
    teacher: TeacherInterface,
    courseId: string,
    lessonId: string,
    lessonName: string
) {
    await teacher.instruction(
        'teacher goes to course detail page and does not see the live lesson has been deleted before',
        async function () {
            await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
        }
    );
    await teacherWaitForAbsentLessonItem(teacher, lessonId, lessonName);
}

export async function makeSureTheLessonHasBeenDeletedOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        'learner goes to course detail page and does not see the live lesson has been deleted before',
        async function () {
            await learnerGoToLesson(learner);

            const lesson = new ByValueKey(
                VirtualClassroomKeys.liveLessonItem(lessonId, lessonName)
            );
            await driver.waitForAbsent(lesson);
        }
    );
}
