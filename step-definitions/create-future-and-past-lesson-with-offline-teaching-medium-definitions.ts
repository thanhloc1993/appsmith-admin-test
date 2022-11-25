import { TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasCourseId, aliasLessonId, aliasLessonName } from './alias-keys/lesson';
import { assertToSeeTheLessonOnTeacherApp } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

export const teacherNotSeeLessonItemOnTeacherApp = async (
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonManagementLessonTime
) => {
    const courseId = scenarioContext.get(aliasCourseId);
    const lessonId = scenarioContext.get(aliasLessonId);
    const lessonName = scenarioContext.get(aliasLessonName) || '';

    await assertToSeeTheLessonOnTeacherApp({
        teacher,
        lessonTime,
        courseId,
        lessonId,
        lessonName,
        lessonItemShouldDisplay: false,
    });
};
