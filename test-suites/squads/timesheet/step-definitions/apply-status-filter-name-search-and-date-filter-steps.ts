import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { getFirstDayOfMonth, getLastDayOfMonth } from '@supports/utils/time/time';

import { TimesheetStatusExtend } from '../common/types';
import {
    assertSeeTimesheetDateFilterChips,
    assertSeeTimesheetStatusTabSelected,
    assertTimesheetListRowsMatchedTheFilter,
    assertTimesheetListRowsMatchTheInputStaffName,
    searchTimesheetByStaffName,
    selectTimesheetDateFilter,
    selectTimesheetStatusTab,
    waitForTimesheetTableRenderRows,
} from './apply-status-filter-name-search-and-date-filter-definitions';
import { closeTimesheetFilterAdvanced } from './view-timesheet-list-with-default-timesheet-filter-definitions';

When(
    '{string} selects timesheet {string} tab',
    async function (this: IMasterWorld, role: AccountRoles, status: TimesheetStatusExtend) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`Select timesheet ${status} tab`, async function (cms) {
            await selectTimesheetStatusTab(cms, scenario, status);
        });
    }
);

When(
    '{string} searches timesheet by {string}',
    async function (this: IMasterWorld, role: AccountRoles, staffName: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`Search timesheet for ${staffName}`, async function (cms) {
            await searchTimesheetByStaffName(cms, scenario, staffName);
        });
        await waitForTimesheetTableRenderRows(cms);
    }
);

When(
    '{string} applies the timesheet date filter',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const fromDate = getFirstDayOfMonth();
        const toDate = getLastDayOfMonth();
        await cms.instruction(
            `Select timesheet date filter from ${fromDate} to ${toDate}`,
            async function (cms) {
                await selectTimesheetDateFilter(cms, scenario, fromDate, toDate, role);
            }
        );

        await waitForTimesheetTableRenderRows(cms);
        if (role === 'school admin') {
            await closeTimesheetFilterAdvanced(cms);
        }
    }
);

Then(
    '{string} sees tab {string} is selected',
    async function (this: IMasterWorld, role: AccountRoles, status: TimesheetStatusExtend) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees tab ${status} is selected`, async function () {
            await assertSeeTimesheetStatusTabSelected(cms, status);
        });
    }
);

Then(
    '{string} sees from date and to date chip filters in result page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees from date and to date chip filters in result page`,
            async function () {
                await assertSeeTimesheetDateFilterChips(cms);
            }
        );
    }
);

Then(
    '{string} sees all the timesheet in results match the selected status, staff name and date',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees all the timesheet in results match the selected status, staff name and date`,
            async function () {
                await assertTimesheetListRowsMatchedTheFilter(cms, scenario, role);
            }
        );
    }
);

Then(
    '{string} sees all the timesheets in the results match the input staff name',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees all the timesheets in the results match the input staff name`,
            async function () {
                await assertTimesheetListRowsMatchTheInputStaffName(cms, scenario, role);
            }
        );
    }
);
