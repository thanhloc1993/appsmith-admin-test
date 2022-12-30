import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasAttendanceStatusValue } from './alias-keys/lesson';
import { lessonInfoAttendanceStatusColumn } from './cms-selectors/lesson-management';
import {
    goToDetailedLessonInfoPage,
    submitIndividualLessonReport,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import { assertFieldValueInPage } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import { selectAttendanceStatus } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { getRandomOneOfArray } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function seeUpdatedAttendanceInDetailedLesson(
    cms: CMSInterface,
    lessonId: string,
    attendanceValue: string
) {
    await goToDetailedLessonInfoPage(cms, lessonId);
    await assertFieldValueInPage(cms.page!, lessonInfoAttendanceStatusColumn, attendanceValue);
}

export async function editToRandomAttendanceStatus(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    attendanceSelector: string,
    attendanceValuesList: string
) {
    const attendanceStatus = getRandomOneOfArray(attendanceValuesList) as AttendanceStatusValues;
    scenarioContext.set(aliasAttendanceStatusValue, attendanceStatus);

    await selectAttendanceStatus(cms, attendanceStatus, attendanceSelector);
    await submitIndividualLessonReport(cms, true);
}
