import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { getLastDayOfMonth } from '@supports/utils/time/time';

import {
    changeDateFilterForLocationsList,
    assertTableOnFirstPage,
    assertLocationsListRowsMatchTheSearchKeyword,
} from 'test-suites/squads/timesheet/step-definitions/combine-searching-and-date-filter-definitions';
import { searchLocationOnConfirmerTable } from 'test-suites/squads/timesheet/step-definitions/view-locations-list-with-updated-confirmation-status-definitions';

Given(
    '{string} has applied a date filter for the locations table list',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} applies date filter`, async function () {
            const lastDayOfMonth = getLastDayOfMonth();
            const secondToTheLastDayOfMonth = new Date(
                new Date().setDate(lastDayOfMonth.getDate() - 1)
            );

            await changeDateFilterForLocationsList({
                cms,
                selectToDate: secondToTheLastDayOfMonth,
            });
        });
    }
);

When(
    '{string} searches for {string} with location keyword {string} on timesheet confirmation page',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        searchItems: 'timesheets' | 'locations',
        searchValue: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `searches for ${searchItems} with location keyword "${searchValue}" on timesheet confirmation page`,
            async () => {
                await searchLocationOnConfirmerTable(cms, searchValue);
            }
        );
    }
);

Then(
    '{string} sees the table turn back to the first page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction('sees table on first page', async function () {
            await cms.waitForSkeletonLoading();
            await assertTableOnFirstPage(cms);
        });
    }
);

Then(
    '{string} sees the list of locations match with the search keyword {string}',
    async function (this: IMasterWorld, role: AccountRoles, searchValue: string) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            'sees all locations in the results match the input search keyword',
            async function () {
                await cms.page!.waitForTimeout(15000);
                await cms.waitForSkeletonLoading();
                await assertLocationsListRowsMatchTheSearchKeyword(cms, searchValue);
            }
        );
    }
);
