import { Page } from 'playwright';

import {
    cancelSubmitIndReportButton,
    tableActionFormLessonReportInd,
} from 'test-suites/squads/lesson/common/cms-selectors';

export async function userIsOnUpsertLessonReportInd(page: Page) {
    await page.waitForSelector(tableActionFormLessonReportInd);
}

export async function cancelSubmitIndLessonReport(page: Page) {
    await page.locator(cancelSubmitIndReportButton).click();
}
