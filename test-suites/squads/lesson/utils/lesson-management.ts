import { learnerProfileAlias, teacherProfileAlias } from '@user-common/alias-keys/user';

import { ScenarioContext } from '@supports/scenario-context';

import {
    getStudentInfoByUserProfile,
    StudentInfo,
} from '../step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';

export type AliasTeacherAndStudentInfo = {
    teacherNames: string[];
    studentInfos: StudentInfo[];
};

export function setupAliasForCreateLessonOfLessonManagement(
    scenarioContext: ScenarioContext
): AliasTeacherAndStudentInfo {
    const teacherNames = getUsersFromContextByRegexKeys(scenarioContext, teacherProfileAlias).map(
        (element) => element.name
    );

    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
    const studentInfos = learners.map((learner) =>
        getStudentInfoByUserProfile(scenarioContext, learner)
    );

    return { teacherNames, studentInfos };
}
