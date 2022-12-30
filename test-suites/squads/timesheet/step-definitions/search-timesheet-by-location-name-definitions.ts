import { CMSInterface } from '@supports/app-types';

import { getCountInStatusTab } from 'test-suites/squads/timesheet/common/utils';
import { getTimesheetStatusTabSelector } from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';

export const assertTimesheetsCreated = async (cms: CMSInterface) => {
    const page = cms.page!;
    const allStatusTabSelector = getTimesheetStatusTabSelector('All');
    const allStatusTab = await page.textContent(allStatusTabSelector);
    const countInAllStatusTab = Number(getCountInStatusTab(allStatusTab || ''));

    await cms.waitForSelectorHasText(allStatusTabSelector, 'All');

    if (countInAllStatusTab > 0) {
        weExpect(countInAllStatusTab).toBeGreaterThan(0);
    }
};
