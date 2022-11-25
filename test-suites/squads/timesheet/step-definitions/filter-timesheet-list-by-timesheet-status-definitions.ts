import { CMSInterface } from '@supports/app-types';

import { TimesheetStatus } from 'test-suites/squads/timesheet/common/types';
import { getCountInStatusTab } from 'test-suites/squads/timesheet/common/utils';
import { getTimesheetStatusTabSelector } from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';

export const assertTotalTimesheetCountOnAllStatusTab = async (cms: CMSInterface) => {
    const page = cms.page!;
    const allStatusTab = await page.textContent(getTimesheetStatusTabSelector('All'));
    const countInAllStatusTab = Number(getCountInStatusTab(allStatusTab || ''));

    const statusTabs: TimesheetStatus[] = ['Draft', 'Submitted', 'Approved', 'Confirmed'];
    const countInStatusTabs = [];

    for (const status of statusTabs) {
        const statusTab = await page.textContent(getTimesheetStatusTabSelector(status));
        countInStatusTabs.push(Number(getCountInStatusTab(statusTab || '')));
    }

    const totalTimesheetCount = countInStatusTabs.reduce((previous, current) => previous + current);

    weExpect(countInAllStatusTab).toEqual(totalTimesheetCount);
};
