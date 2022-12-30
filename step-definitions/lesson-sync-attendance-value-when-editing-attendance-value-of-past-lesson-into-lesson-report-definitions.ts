import { CMSInterface } from '@supports/app-types';

import {
    attendanceStatusDetailValue,
    LessonManagementLessonDetailTabNames,
} from './cms-selectors/lesson-management';
import { assertFieldValueInPage } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

export async function assertUpdatedAttendanceInReportInfo(
    cms: CMSInterface,
    attendanceValue: string
) {
    const page = cms.page!;
    await page.reload();
    const reportTab = await cms.waitForTabListItem(
        LessonManagementLessonDetailTabNames.LESSON_REPORT
    );
    await reportTab!.click();

    await assertFieldValueInPage(page, attendanceStatusDetailValue, attendanceValue);
}
