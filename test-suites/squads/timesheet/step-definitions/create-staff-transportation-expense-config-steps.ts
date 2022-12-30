import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { goToStaffTimesheetSettingTab } from './auto-remove-lesson-hours-in-timesheet-definitions';
import {
    addEmptyTransportationExpenseRow,
    assertStaffTransportationExpenseIsSaved,
    openTransportationExpenseModal,
    saveStaffTransportationExpenses,
    fillInValidStaffTransportationExpenseInputs,
    reloadTimesheetSettingTab,
} from './create-staff-transportation-expense-config-definitions';
import { transportationExpensesAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { staffTransportationExpenseTableRow } from 'test-suites/squads/timesheet/common/cms-selectors/staff-transportation-expense';
import { assertElementCountToBe } from 'test-suites/squads/timesheet/common/step-definitions/common-assertion-definitions';
import { StaffTransportationExpensesDataTable } from 'test-suites/squads/timesheet/common/types';

Given(
    '{string} goes to staff timesheet setting tab for requestor',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const staff = context.get<UserProfileEntity>(
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );

        await cms.instruction(`${role} goes to staff detail page`, async () => {
            await goToStaffTimesheetSettingTab(cms, staff);
        });
    }
);

When(
    '{string} opens edit staff transportation expense modal',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} opens transportation expense modal`, async () => {
            await openTransportationExpenseModal(cms);
        });
    }
);

When(
    '{string} adds 1 row on staff transportation expense table',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} adds empty transportation expense row`, async () => {
            await addEmptyTransportationExpenseRow(cms);
        });
    }
);

When(
    '{string} adds and saves {int} rows on staff transportation expense table',
    async function (this: IMasterWorld, role: AccountRoles, count: number) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await openTransportationExpenseModal(cms);
        await cms.waitForSkeletonLoading();

        for (let i = 0; i < count; i++) {
            await cms.instruction(`${role} adds empty transportation expense row`, async () => {
                await addEmptyTransportationExpenseRow(cms);
            });

            await cms.instruction(
                `${role} fills in required fields on transportation expense table row with valid data`,
                async () => {
                    await fillInValidStaffTransportationExpenseInputs(cms, role, scenarioContext);
                }
            );
        }

        await cms.instruction(`${role} saves staff transportation expenses`, async () => {
            await saveStaffTransportationExpenses(cms);
        });
    }
);

When(
    '{string} fills in required fields on staff transportation expense table row with valid data',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} fills in required fields on transportation expense table row with valid data`,
            async () => {
                await fillInValidStaffTransportationExpenseInputs(cms, role, scenarioContext);
            }
        );
    }
);

When(
    '{string} saves staff transportation expense data',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} saves staff transportation expenses`, async () => {
            await saveStaffTransportationExpenses(cms);
        });
    }
);

When(
    '{string} reloads timesheet setting tab',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} reloads timesheet setting tab`, async () => {
            await reloadTimesheetSettingTab(cms);
        });
    }
);

Then(
    '{string} sees staff transportation expense table updated with new rows',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const transportationExpenses = scenarioContext.get<StaffTransportationExpensesDataTable[]>(
            `${transportationExpensesAlias}-${role}`
        );
        await cms.instruction(
            `${role} sees staff transportation expense table updated with new rows`,
            async () => {
                await assertStaffTransportationExpenseIsSaved(cms, transportationExpenses);
            }
        );
    }
);

Then(
    '{string} sees staff transportation expense table updated with new rows saved by school admin',
    async function (this: IMasterWorld, role: AccountRoles) {
        const targetRole: AccountRoles = 'school admin';
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const transportationExpenses = scenarioContext.get<StaffTransportationExpensesDataTable[]>(
            `${transportationExpensesAlias}-${targetRole}`
        );
        await cms.instruction(
            `${role} sees staff transportation expense table updated with new rows saved by ${targetRole}`,
            async () => {
                await assertStaffTransportationExpenseIsSaved(cms, transportationExpenses);
            }
        );
    }
);

Then(
    'school admin and school admin 2 sees 4 rows on staff transportation expense table',
    async function (this: IMasterWorld) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const cms2 = getCMSInterfaceByRole(this, 'school admin 2');

        await cms.instruction(
            'school admin sees 4 rows on staff transportation expense table',
            async () => {
                await assertElementCountToBe(cms, staffTransportationExpenseTableRow, 4);
            }
        );
        await cms2.instruction(
            'school admin 2 sees 4 rows on staff transportation expense table',
            async () => {
                await assertElementCountToBe(cms2, staffTransportationExpenseTableRow, 4);
            }
        );
    }
);
