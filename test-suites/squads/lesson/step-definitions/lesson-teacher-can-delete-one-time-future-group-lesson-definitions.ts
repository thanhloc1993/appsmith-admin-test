import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { noResultIcon } from 'test-suites/squads/lesson/common/cms-selectors';
import { ActionCanSee, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    teacherWaitForLessonItem,
    teacherChooseLessonTab,
    teacherGoToCourseDetailById,
    learnerChooseLessonTab,
    assertLearnerSeeLesson,
} from 'test-suites/squads/lesson/utils/lesson-detail';
import { searchLessonByStudentName } from 'test-suites/squads/lesson/utils/lesson-list';
import { getUsersFromContextByRegexKeys } from 'test-suites/squads/lesson/utils/user';

export async function userDoesNotSeeLesson(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
}) {
    const { cms, scenarioContext } = params;

    const student1st = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias)[0];
    await searchLessonByStudentName({ cms, studentName: student1st.name, lessonTime: 'future' });

    await cms.page!.waitForSelector(noResultIcon);
}

export async function assertToSeeTheLessonOnTeacherApp(params: {
    teacher: TeacherInterface;
    lessonTime: LessonTimeValueType;
    courseId: string;
    lessonId: string;
    state?: ActionCanSee;
}) {
    const { teacher, lessonTime, courseId, lessonId, state = 'see' } = params;

    await teacher.instruction(`Go to course by id ${courseId}`, async function () {
        await teacherGoToCourseDetailById(teacher, courseId);
    });

    await teacher.instruction(`Go to tab ${lessonTime} lesson`, async function () {
        await teacherChooseLessonTab({ teacher, lessonTime });
    });

    await teacher.instruction(`Teacher can ${state} lesson item`, async function () {
        await teacherWaitForLessonItem({ teacher, lessonId, lessonName: '', state });
    });
}

export async function assertToSeeTheLessonOnLearnerApp(params: {
    learner: LearnerInterface;
    lessonId: string;
    state?: ActionCanSee;
}) {
    const { learner, lessonId, state = 'see' } = params;

    await learner.instruction('Go to lesson tab', async function () {
        await learnerChooseLessonTab(learner);
    });

    await learner.instruction(`Learner can ${state} lesson item`, async function () {
        await assertLearnerSeeLesson({ learner, lessonId, state });
    });
}
