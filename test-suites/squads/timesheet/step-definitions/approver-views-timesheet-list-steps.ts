import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    TimesheetStatus,
    TimesheetStatusExtend,
    HyperlinkColumns,
    HyperlinkPages,
} from 'test-suites/squads/timesheet/common/types';
import { selectTimesheetStatusTab } from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';
import { getTimesheetStatusTabSelector } from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';
import {
    selectTimesheetRows,
    clickNextPageButton,
    assertApproveButtonIsEnabled,
    createTimesheetsWithStatus,
    assertAndSelectHyperlinkByColumn,
    assertRedirectToPageOnNewTab,
    checkNumberOfTimesheetsWithStatusCreated,
    assertColumnsOnAdminTimesheetListTable,
} from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';

Given(
    '{string} has created {int} timesheet\\(s) with {string} status',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        numOfTimesheets: number,
        timesheetStatus: TimesheetStatus
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const statusTabSelector = getTimesheetStatusTabSelector(timesheetStatus);

        await cms.waitForSkeletonLoading();
        await cms.waitForSelectorHasText(statusTabSelector, timesheetStatus);

        await checkNumberOfTimesheetsWithStatusCreated(
            cms,
            role,
            scenarioContext,
            numOfTimesheets,
            timesheetStatus,
            statusTabSelector
        );
    }
);

Given(
    '{string} creates {int} timesheet with {string} status',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        numOfTimesheets: number,
        timesheetStatus: TimesheetStatus
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} creates ${numOfTimesheets} with ${timesheetStatus} status`,
            async function (cms) {
                await createTimesheetsWithStatus({
                    cms,
                    role,
                    scenarioContext,
                    numOfTimesheets,
                    timesheetStatus,
                });
            }
        );
    }
);

Given(
    '{string} clicks on timesheet {string} tab',
    async function (this: IMasterWorld, role: AccountRoles, status: TimesheetStatusExtend) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`Select timesheet ${status} tab`, async function (cms) {
            await selectTimesheetStatusTab(cms, scenario, status);
        });
    }
);

When(
    '{string} selects {int} row\\(s) on the timesheet table list',
    async function (this: IMasterWorld, role: AccountRoles, numOfRows: number) {
        const cms = getCMSInterfaceByRole(this, role);

        await selectTimesheetRows(cms, numOfRows);
    }
);

When('{string} goes to the next page', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await clickNextPageButton(cms);
});

When(
    '{string} clicks the {string} hyperlink for a timesheet row',
    async function (this: IMasterWorld, role: AccountRoles, column: HyperlinkColumns) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`Select timesheet ${column} tab`, async function (cms) {
            await cms.waitForSkeletonLoading();
            await assertAndSelectHyperlinkByColumn(cms, column);
        });
    }
);

Then(
    '{string} sees the Approve button is enabled',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertApproveButtonIsEnabled(cms);
    }
);

Then(
    '{string} sees the timesheet list table has correct label and order of columns',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertColumnsOnAdminTimesheetListTable(cms);
    }
);

Then(
    '{string} is redirected to {string} page on a new tab',
    async function (this: IMasterWorld, role: AccountRoles, page: HyperlinkPages) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`sees ${page} page open on a new tab`, async function (cms) {
            await assertRedirectToPageOnNewTab(cms, page);
        });
    }
);
