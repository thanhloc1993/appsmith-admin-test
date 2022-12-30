import { TeacherKeys } from '@common/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { ActionCanSee, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { MaterialFile, MaterialFileState } from 'test-suites/squads/lesson/types/material';
import {
    teacherChooseLessonTab,
    teacherGoToCourseDetailById,
    teacherWaitForLessonItem,
} from 'test-suites/squads/lesson/utils/lesson-detail';
import { assertMaterialInLiveLesson } from 'test-suites/squads/lesson/utils/materials';

export async function assertLessonWithMaterialOnTeacherApp(params: {
    teacher: TeacherInterface;
    state: ActionCanSee;
    lessonTime: LessonTimeValueType;
    courseId: string;
    lessonId: string;
    materialState: MaterialFileState;
    materials: MaterialFile[];
}) {
    const { teacher, lessonTime, state, courseId, lessonId, materialState, materials } = params;
    const driver = teacher.flutterDriver!;

    await teacher.instruction(`Teacher go to course ${courseId}`, async function () {
        await teacherGoToCourseDetailById(teacher, courseId);
    });

    await teacher.instruction(`Then choose ${lessonTime} lesson tab`, async function () {
        await teacherChooseLessonTab({ teacher, lessonTime });
    });

    await teacher.instruction(`And ${state} the lesson ${lessonId}`, async function () {
        await teacherWaitForLessonItem({ teacher, state, lessonId, lessonName: '' });
    });

    if (state === 'not see') return;

    const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, ''));
    await driver.tap(lessonItem);

    await teacher.instruction(`Material ${materials} ${materialState}`, async function () {
        await assertMaterialInLiveLesson({ teacher, materials, state: materialState });
    });
}
