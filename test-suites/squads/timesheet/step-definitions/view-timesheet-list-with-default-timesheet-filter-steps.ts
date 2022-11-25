import { schoolAdminApplyFilterAdvanced } from '@legacy-step-definitions/cms-common-definitions';
import { changeRowsPerPage, getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { TimesheetStatusExtend } from '../common/types';
import { waitForTimesheetTableRenderRows } from './apply-status-filter-name-search-and-date-filter-definitions';
import {
    assertDateFilterIsDefault,
    assertNotSeeTimesheetDateFilterChips,
    assertTimesheetCountOfStatusTabMatchWithTotalRows,
    assertTimesheetIsFilterByDefaultDateFilter,
    assertTimesheetIsOrderByDateDesc,
    closeTimesheetFilterAdvanced,
    goToTheLastPageOfTable,
    openTimesheetFilterAdvanced,
} from './view-timesheet-list-with-default-timesheet-filter-definitions';
import * as TimesheetListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';

When('{string} clicks the filter button', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`Open timesheet filter advanced`, async function (cms) {
        await openTimesheetFilterAdvanced(cms);
    });
    await waitForTimesheetTableRenderRows(cms);
});

When('{string} applies new date filter', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} applies new date filter`, async function (cms) {
        await openTimesheetFilterAdvanced(cms);
        await schoolAdminApplyFilterAdvanced(cms);
        await closeTimesheetFilterAdvanced(cms);
    });
    await waitForTimesheetTableRenderRows(cms);
});

When(
    '{string} changes the rows per page to 25',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const isNoDataIconVisible = await cms.page?.isVisible(TimesheetListSelectors.noDataIcon);
        if (!isNoDataIconVisible) {
            await cms.instruction(
                `${role} has chosen 25 rows per page in the first result page`,
                async function () {
                    await changeRowsPerPage(cms, 25, false);
                }
            );
        }

        await waitForTimesheetTableRenderRows(cms);
    }
);

When(
    '{string} goes to the last page of the timesheet table',
    { timeout: 120000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        const isNoDataIconVisible = await cms.page?.isVisible(TimesheetListSelectors.noDataIcon);
        if (!isNoDataIconVisible) {
            await cms.instruction(
                `${role} goes to the last page of the timesheet table`,
                async function () {
                    await goToTheLastPageOfTable(cms);
                }
            );
        }
    }
);

Then(
    '{string} sees date filter is from the first to the last day of current month',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees date filter is from the first to the last day of current month`,
            async function (cms) {
                await assertDateFilterIsDefault(cms, role);
            }
        );

        if (role === 'school admin') {
            await closeTimesheetFilterAdvanced(cms);
        }
    }
);

Then(
    '{string} sees the timesheet count of {string} tab is matching with total rows in timesheet list',
    async function (this: IMasterWorld, role: AccountRoles, status: TimesheetStatusExtend) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees the timesheet count of ${status} tab is matching with total rows in timesheet list`,
            async function (cms) {
                await assertTimesheetCountOfStatusTabMatchWithTotalRows(cms, status);
            }
        );
    }
);

Then(
    '{string} sees the table is filtered by the default date filter',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the table is filtered by the default date filter`,
            async function (cms) {
                await assertTimesheetIsFilterByDefaultDateFilter(cms, role);
            }
        );
    }
);

Then(
    '{string} sees the table is sorted by the latest date on top',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the table is sorted by the latest date on top`,
            async function (cms) {
                await assertTimesheetIsOrderByDateDesc(cms, role);
            }
        );
    }
);

Then(
    '{string} does not see the date filter chip',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} does not see the date filter chip`, async function (cms) {
            await assertNotSeeTimesheetDateFilterChips(cms);
        });
    }
);
