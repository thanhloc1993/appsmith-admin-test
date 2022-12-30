import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey } from 'flutter-driver-x';
import {
    aliasLessonIdByLessonName,
    aliasLessonInfoByLessonName,
} from 'step-definitions/alias-keys/lesson';
import { LessonManagementLessonName } from 'step-definitions/lesson-default-sort-future-lessons-list-definitions';
import { AliasTeacherAndStudentInfo } from 'step-definitions/lesson-management-utils';
import { TeacherKeys } from 'step-definitions/teacher-keys/teacher-keys';
import { arrayHasItem, getUserProfileFromContext } from 'step-definitions/utils';
import { getStudentInfoByUserProfile } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

export type LessonInfo = {
    lessonId: string;
    lessonTime: LessonManagementLessonTime;
    teacherNames: AliasTeacherAndStudentInfo['teacherNames'];
    studentInfos: AliasTeacherAndStudentInfo['studentInfos'];
};

export function saveLessonInfoByLessonName(params: {
    scenarioContext: ScenarioContext;
    lessonName: LessonManagementLessonName;
    lessonTime: LessonManagementLessonTime;
    teacherNames: AliasTeacherAndStudentInfo['teacherNames'];
    studentInfos: AliasTeacherAndStudentInfo['studentInfos'];
}) {
    const { scenarioContext, lessonName, lessonTime, teacherNames, studentInfos } = params;

    const lessonId = scenarioContext.get(aliasLessonIdByLessonName(lessonName));

    if (!arrayHasItem(studentInfos)) {
        const learner = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const studentInfo = getStudentInfoByUserProfile(scenarioContext, learner);
        studentInfos.push(studentInfo);
    }

    const lessonInfo: LessonInfo = { lessonId, lessonTime, teacherNames, studentInfos };
    scenarioContext.set(aliasLessonInfoByLessonName(lessonName), lessonInfo);
}

export async function teacherSeeInvalidURLPageOnTeacherApp(teacher: TeacherInterface) {
    const invalidURLScreen = new ByValueKey(TeacherKeys.invalidURLScreen);
    await teacher.flutterDriver!.waitFor(invalidURLScreen, 10000);
}

export async function teacherGoToCourseByURL(teacher: TeacherInterface, courseId: string) {
    const driver = teacher.flutterDriver!;
    const websiteDomain = await driver.webDriver!.getUrlOrigin();
    const courseURL = `${websiteDomain}courseDetail?course_id=${courseId}`;

    await teacher.instruction(`Go to the course by URL: ${courseURL}`, async function () {
        await driver.webDriver!.page.goto(courseURL);
    });
}

export async function teacherDoesNotSeeCourseWithAccessByURL(
    teacher: TeacherInterface,
    courseId: string
) {
    await teacherGoToCourseByURL(teacher, courseId);
    await teacherSeeInvalidURLPageOnTeacherApp(teacher);
}
