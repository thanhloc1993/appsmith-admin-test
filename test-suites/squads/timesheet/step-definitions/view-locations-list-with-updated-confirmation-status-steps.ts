import { getLocationByName } from '@legacy-step-definitions/payment-hasura';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import {
    newLocationsAlias,
    timesheetLocationsMapAlias,
} from 'test-suites/squads/timesheet/common/alias-keys';
import {
    ConfirmationStatus,
    LocationData,
    TimesheetStatus,
} from 'test-suites/squads/timesheet/common/types';
import { getRandomString } from 'test-suites/squads/timesheet/common/utils';
import {
    archiveLocations,
    assertLocationRowsStatusCount,
    assertLocationStatusSortedToTop,
    assertLocationRowWithConfirmationStatus,
    assertRecentlyConfirmedLocationsStatus,
    confirmLocationRows,
    createNewLocationWithPrefix,
    createTimesheetsForMultipleLocationsWithStatus,
    searchLocationOnConfirmerTable,
    selectAllOnTable,
} from 'test-suites/squads/timesheet/step-definitions/view-locations-list-with-updated-confirmation-status-definitions';

Given(
    '{string} creates {int} new locations with prefix {string}',
    async function (this: IMasterWorld, role: AccountRoles, count: number, prefix: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        // appends a random string on the prefix to make it unique this run
        const uniquePrefix = `${prefix}${getRandomString(6)}_`;

        // access the actual prefix by using the stated value on the step
        // format it to `${prefix}_alias` to disable direct access to context values through step params
        scenario.set(`${prefix}_alias`, uniquePrefix);

        await cms.instruction(
            `${role} creates ${count} new locations with prefix ${prefix}`,
            async () => {
                const newLocations: LocationData[] = [];
                for (let i = 0; i < count; i++) {
                    const locationData = await createNewLocationWithPrefix(cms, uniquePrefix);
                    const { locationId } = await getLocationByName(cms, locationData.name);
                    const newLocation: LocationData = {
                        ...locationData,
                        location_id: locationId,
                    };
                    newLocations.push(newLocation);
                }
                scenario.set(`${newLocationsAlias}_${prefix}`, newLocations);
            }
        );
    }
);

When(
    '{string} creates {int} timesheet with {string} status for {int} new random locations with prefix {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        numTimesheets: number,
        status: TimesheetStatus,
        numLocations: number,
        prefix: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const newLocations = scenario.get<LocationData[]>(`${newLocationsAlias}_${prefix}`);

        await cms.instruction(
            `${role} creates ${numTimesheets} timesheet with ${status} status for ${numLocations} new random locations with prefix ${prefix}`,
            async () => {
                await createTimesheetsForMultipleLocationsWithStatus(
                    cms,
                    scenario,
                    role,
                    newLocations,
                    status,
                    numTimesheets,
                    numLocations
                );
            }
        );
    }
);

When(
    '{string} goes to timesheet confirmation page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} goes to timesheet confirmation page`, async () => {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_CONFIRMATION);
        });
    }
);

When(
    '{string} searches for new locations with prefix {string} on timesheet confirmation page',
    async function (this: IMasterWorld, role: AccountRoles, prefix: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        // access the actual prefix by using the stated value on the step
        // format it to `${prefix}_alias` to disable direct access to context values through step params
        const searchValue = scenario.get(`${prefix}_alias`);

        await cms.instruction(
            `${role} searches for new locations with prefix ${prefix} on timesheet confirmation page`,
            async () => {
                await searchLocationOnConfirmerTable(cms, searchValue);
            }
        );
    }
);

When(
    '{string} confirms selected locations',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} confirms selected locations`, async () => {
            await confirmLocationRows(cms, scenario);
        });
    }
);

When(
    '{string} selects all valid rows on the location list table',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} selects all valid rows on the location list table`,
            async () => {
                await selectAllOnTable(cms, 'TableHeaderWithCheckbox__checkboxHeader');
            }
        );
    }
);

Then(
    '{string} archives new locations with prefix {string}',
    async function (this: IMasterWorld, role: AccountRoles, prefix: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} archives new locations with prefix ${prefix}`, async () => {
            await archiveLocations(cms, scenario.get(`${newLocationsAlias}_${prefix}`));
        });
    }
);

Then(
    '{string} sees recently confirmed rows with confirmation status {string}',
    async function (this: IMasterWorld, role: AccountRoles, status: ConfirmationStatus) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees recently confirmed rows with confirmation status ${status}`,
            async () => {
                await cms.waitForSkeletonLoading();
                await assertRecentlyConfirmedLocationsStatus(cms, scenario, status);
            }
        );
    }
);

Then(
    '{string} sees {int} row\\(s) with confirmation status {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        rowCount: number,
        status: ConfirmationStatus
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees ${rowCount} row\\(s) with confirmation status ${status}`,
            async () => {
                await assertLocationRowsStatusCount(cms, status, rowCount);
            }
        );
    }
);

Then(
    '{string} sees the {string} location rows shown on top of the location table list',
    async function (this: IMasterWorld, role: AccountRoles, status: ConfirmationStatus) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the ${status} location rows shown on top of the location table list`,
            async () => {
                await assertLocationStatusSortedToTop(cms, status);
            }
        );
    }
);

Then(
    '{string} sees new location rows with confirmation status {string}',
    async function (this: IMasterWorld, role: AccountRoles, status: ConfirmationStatus) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const timesheetLocationsMap = scenario.get<Record<string, string[]>>(
            timesheetLocationsMapAlias
        );
        const locationIds = Object.keys(timesheetLocationsMap);
        await cms.instruction(
            `${role} sees new location rows with confirmation status ${status}`,
            async () => {
                for (let i = 0; i < locationIds.length; i++) {
                    await assertLocationRowWithConfirmationStatus(cms, locationIds[i], status);
                }
            }
        );
    }
);
