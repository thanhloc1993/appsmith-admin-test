import { schoolHistoriesAlias } from '@user-common/alias-keys/student';
import { tableBaseBody } from '@user-common/cms-selectors/students-page';
import { SchoolHistoriesTypes } from '@user-common/types/student';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';
import { selectFullDate } from '@user-common/utils/pick-date-time';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    placeholderEnd,
    placeholderStart,
    rootSchoolHistoryDetail,
    schoolHistoryDetailCourseCell,
    schoolHistoryDetailEndDateCell,
    schoolHistoryDetailLevelCell,
    schoolHistoryDetailSchoolName,
    schoolHistoryDetailStartDateCell,
    schoolHistoryTableEndDate,
    schoolHistoryTableStartDate,
} from './school-history-keys';
import {
    buttonAddSchoolHistory,
    schoolLevelColumn,
    schoolNameColumn,
    schoolCourseColumn,
} from './school-history-keys';
import { createSchoolHistoryData } from './school-history-student-detail-utils';
import moment from 'moment-timezone';

export async function checkMasterDataSchoolLevelSchoolInfoSchoolCourse(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const schoolHistories = await createSchoolHistoryData(cms, 1);

    context.set(schoolHistoriesAlias, schoolHistories);
}

export async function fillStudentSchoolHistory(cms: CMSInterface, context: ScenarioContext) {
    const schoolHistories = context.get<SchoolHistoriesTypes[]>(schoolHistoriesAlias);

    await cms.instruction('school admin fills school history', async function () {
        const page = cms.page!;

        for (let i = 0; i < schoolHistories.length; i++) {
            const schoolHistory = schoolHistories[i];
            await page.locator(buttonAddSchoolHistory).click();

            const schoolLevelColumnElement = page.locator(schoolLevelColumn);
            const schoolNameColumnElement = page.locator(schoolNameColumn);
            const schoolCourseColumnElement = page.locator(schoolCourseColumn);
            const schoolHistoryTableStartDateElement = page.locator(schoolHistoryTableStartDate);
            const schoolHistoryTableEndDateElement = page.locator(schoolHistoryTableEndDate);

            if (schoolHistory.schoolLevel) {
                await schoolLevelColumnElement
                    .nth(i)
                    .getByPlaceholder('Level')
                    .type(schoolHistory.schoolLevel.school_level_name);

                // Wait for debounce
                await page?.waitForTimeout(1000);
                await chooseAutocompleteOptionByExactText(
                    cms,
                    schoolHistory.schoolLevel.school_level_name
                );
            }

            if (schoolHistory.schoolInfo) {
                await schoolNameColumnElement
                    .nth(i)
                    .getByPlaceholder('School Name')
                    .type(schoolHistory.schoolInfo.school_name);

                // Wait for debounce
                await page?.waitForTimeout(1000);
                await chooseAutocompleteOptionByExactText(
                    cms,
                    schoolHistory.schoolInfo.school_name
                );
            }

            if (schoolHistory.schoolCourse?.school_course_name) {
                await schoolCourseColumnElement
                    .nth(i)
                    .getByPlaceholder('Course')
                    .type(schoolHistory.schoolCourse?.school_course_name);

                // Wait for debounce
                await page.waitForTimeout(1000);
                await chooseAutocompleteOptionByExactText(
                    cms,
                    schoolHistory.schoolCourse?.school_course_name
                );
            }
            if (schoolHistory.startDate) {
                await selectFullDate(
                    cms,
                    schoolHistory.startDate,
                    placeholderStart,
                    i,
                    schoolHistoryTableStartDateElement
                );
            }

            if (schoolHistory.endDate) {
                await selectFullDate(
                    cms,
                    schoolHistory.startDate,
                    placeholderEnd,
                    i,
                    schoolHistoryTableEndDateElement
                );
            }
        }
    });
}

export async function schoolAdminSeesSchoolHistoryInStudentDetail(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const schoolHistories = context.get<SchoolHistoriesTypes[]>(schoolHistoriesAlias);

    const schoolHistoryDetailElement = cms.page!.locator(rootSchoolHistoryDetail);

    const tableBaseBodyElement = schoolHistoryDetailElement.locator(tableBaseBody);
    await tableBaseBodyElement.scrollIntoViewIfNeeded();

    const levels = tableBaseBodyElement.locator(schoolHistoryDetailLevelCell);
    const schoolNames = tableBaseBodyElement.locator(schoolHistoryDetailSchoolName);
    const schoolCourses = tableBaseBodyElement.locator(schoolHistoryDetailCourseCell);
    const startDate = tableBaseBodyElement.locator(schoolHistoryDetailStartDateCell);
    const endDate = tableBaseBodyElement.locator(schoolHistoryDetailEndDateCell);

    const countLevel = await levels.count();
    const countSchoolNames = await schoolNames.count();
    const countSchoolCourses = await schoolCourses.count();
    const countEndDate = await schoolCourses.count();
    const countStartDate = await schoolCourses.count();

    for (let i = 0; i < countLevel; i++) {
        const textLevel = await levels.nth(i).textContent();
        weExpect(textLevel).toBe(schoolHistories?.[i].schoolLevel.school_level_name);
    }
    for (let i = 0; i < countSchoolNames; i++) {
        const textLevel = await schoolNames.nth(i).textContent();
        weExpect(textLevel).toBe(schoolHistories?.[i].schoolInfo.school_name);
    }

    for (let i = 0; i < countSchoolCourses; i++) {
        const textLevel = await schoolCourses.nth(i).textContent();
        weExpect(textLevel).toBe(schoolHistories?.[i].schoolCourse?.school_course_name || '--');
    }

    for (let i = 0; i < countStartDate; i++) {
        const textLevel = await startDate.nth(i).textContent();
        weExpect(textLevel).toBe(
            schoolHistories?.[i].startDate
                ? moment(schoolHistories?.[i].startDate).format('YYYY/MM/DD')
                : ''
        );
    }

    for (let i = 0; i < countEndDate; i++) {
        const textLevel = await endDate.nth(i).textContent();
        weExpect(textLevel).toBe(
            schoolHistories?.[i].endDate
                ? moment(schoolHistories?.[i].endDate).format('YYYY/MM/DD')
                : ''
        );
    }
}
