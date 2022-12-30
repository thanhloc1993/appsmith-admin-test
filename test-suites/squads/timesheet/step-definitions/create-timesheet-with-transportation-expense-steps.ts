import { getCMSInterfaceByRole, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When, Then, DataTable } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import {
    otherWorkingHoursAlias,
    transportationExpensesAlias,
    timesheetDateAlias,
    locationNameAlias,
    staffProfileAlias,
} from 'test-suites/squads/timesheet/common/alias-keys';
import { waitForCreateTimesheetResponse } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import { TimesheetPages } from 'test-suites/squads/timesheet/common/types';
import {
    OtherWorkingHoursDataTable,
    TransportationExpensesDataTable,
} from 'test-suites/squads/timesheet/common/types';
import { getTimesheetInfoFromContext } from 'test-suites/squads/timesheet/common/utils';
import {
    openCreateTimesheetPage,
    fillGeneralInfoSection,
    getStaffNewLocation,
    addOtherWorkingHours,
    addTransportationExpenses,
    fillRemarksSection,
    saveTimesheet,
    assertSeeTimesheetInfoOnTimesheetDetailPage,
} from 'test-suites/squads/timesheet/step-definitions/create-timesheet-with-transportation-expense-definitions';

Given(
    '{string} goes to timesheet management page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} goes to timesheet management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
        });
    }
);

When(
    '{string} opens create timesheet page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} opens create timesheet page`, async function () {
            await openCreateTimesheetPage(cms, role);
        });
    }
);

When(
    '{string} fills in general info section',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const cms = getCMSInterfaceByRole(this, role);
        const adminCMS = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        const staffProfile = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        const staffName = staffProfile.name;
        const currentDate = new Date();

        if (role === 'teacher') {
            await cms.instruction(`${role} fills in general info form fields`, async function () {
                const { name: locationName } = await getStaffNewLocation(adminCMS);
                await fillGeneralInfoSection({
                    cms,
                    location: locationName,
                    timesheetDate: currentDate,
                });
                scenarioContext.set(locationNameAlias, locationName);
            });
        } else {
            await cms.instruction(
                `${role} fills in general info form fields for teacher`,
                async function () {
                    const { name: locationName } = await getStaffNewLocation(cms);
                    await fillGeneralInfoSection({
                        cms,
                        location: locationName,
                        timesheetDate: currentDate,
                        staff: staffName,
                    });
                    scenarioContext.set(locationNameAlias, locationName);
                }
            );
        }

        scenarioContext.set(timesheetDateAlias, currentDate);
        scenarioContext.set(staffProfileAlias, staffProfile);
    }
);

When(
    '{string} adds {string} rows in other working hours section',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        numberOfRows: string,
        otherWorkingHoursTable: DataTable
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const otherWorkingHours: OtherWorkingHoursDataTable[] = otherWorkingHoursTable.hashes();

        await cms.instruction(
            `${role} adds ${numberOfRows} other working hours`,
            async function () {
                await addOtherWorkingHours(cms, otherWorkingHours);
            }
        );

        scenarioContext.set(otherWorkingHoursAlias, otherWorkingHours);
    }
);

When(
    '{string} adds {string} rows in transportation expenses section',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        numberOfRows: string,
        transportationExpensesTable: DataTable
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const transportationExpenses: TransportationExpensesDataTable[] =
            transportationExpensesTable.hashes();

        await cms.instruction(
            `${role} adds ${numberOfRows} transportation expenses`,
            async function () {
                await addTransportationExpenses(cms, transportationExpenses);
            }
        );

        scenarioContext.set(transportationExpensesAlias, transportationExpenses);
    }
);

When('{string} fills in remarks section', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;

    await cms.instruction(`${role} fills in remarks section`, async function () {
        await fillRemarksSection(cms, scenarioContext);
    });
});

When('{string} saves the timesheet', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction(`${role} clicks save button`, async function () {
        await Promise.all([waitForCreateTimesheetResponse(cms, context), saveTimesheet(cms)]);
    });
});

Then(
    '{string} is redirected to {string} page',
    async function (this: IMasterWorld, role: AccountRoles, pageTitle: TimesheetPages) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is redirected to ${pageTitle} page`, async function () {
            await cms.assertThePageTitle(pageTitle);
        });
    }
);

Then(
    '{string} sees newly created timesheet with correct information',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const timesheetInfo = getTimesheetInfoFromContext(scenarioContext);

        await cms.instruction(
            `${role} sees newly created timesheet with correct information`,
            async function () {
                await assertSeeTimesheetInfoOnTimesheetDetailPage(cms, timesheetInfo);
            }
        );
    }
);
