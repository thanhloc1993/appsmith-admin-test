import { CMSInterface } from '@supports/app-types';

import {
    GroupLessonReportTabs,
    tableValueGroupReport,
    textAreaValueGroupReport,
} from 'test-suites/squads/lesson/common/cms-selectors';

export async function userSeeEmptyGroupReport(cms: CMSInterface) {
    const page = cms.page!;

    await page.locator(GroupLessonReportTabs.PERFORMANCE).click();
    await cms.attach('Tab performance');

    await page.locator(GroupLessonReportTabs.REMARK).click();
    await cms.attach('Tab remark');

    const textAreaContents = await page.locator(textAreaValueGroupReport).allTextContents();
    const tableValueContents = await page.locator(tableValueGroupReport).allTextContents();

    const areContentsDoubleDash = [...textAreaContents, ...tableValueContents].every(
        (content) => content === '--'
    );

    weExpect(areContentsDoubleDash, 'Expect all of values are double dash').toEqual(true);
}
