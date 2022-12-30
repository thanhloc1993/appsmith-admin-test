import { learnerProfileAlias, teacherProfileAlias } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    getStudentInfoByUserProfile,
    StudentInfo,
} from '../step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import { lessonDateV3 } from 'test-suites/squads/lesson/common/cms-selectors';
import { changeDatePickerByDateRange } from 'test-suites/squads/lesson/utils/date-picker';

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

export async function changeLessonDateToTomorrow(cms: CMSInterface, dateRange = 1) {
    const currentDate = await cms.page!.inputValue(lessonDateV3);

    await cms.instruction('Select date of tomorrow', async function () {
        await changeDatePickerByDateRange({
            cms,
            currentDate,
            datePickerSelector: lessonDateV3,
            dateRange,
        });
    });
}

export async function changeLessonDateToYesterday(cms: CMSInterface, dateRange = 1) {
    const pastDateRange = -dateRange;

    const currentDate = await cms.page!.inputValue(lessonDateV3);

    await cms.instruction('Select date of yesterday', async function () {
        await changeDatePickerByDateRange({
            cms,
            currentDate,
            datePickerSelector: lessonDateV3,
            dateRange: pastDateRange,
        });
    });
}
