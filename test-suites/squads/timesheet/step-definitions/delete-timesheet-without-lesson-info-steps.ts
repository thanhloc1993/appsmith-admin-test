import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { timesheetIdAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { confirmDialogButtonClose } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import { goToTimesheetDetail } from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';
import {
    createTimesheetWithWorkingHoursAndRemarks,
    openDeleteTimesheetConfirmation,
    clickDeleteTimesheetButton,
    deleteTimesheet,
    assertTimesheetDeletedOnTimesheetList,
} from 'test-suites/squads/timesheet/step-definitions/delete-timesheet-without-lesson-info-definitions';

Given(
    '{string} creates 1 timesheet with other working hours and remarks',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const staffProfile = getUserProfileFromContext(
            scenario,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );

        const staffName = staffProfile?.name;

        await cms.instruction(
            'Create timesheet with other working hours and remarks',
            async function (cms) {
                await createTimesheetWithWorkingHoursAndRemarks({ cms, role, scenario, staffName });
            }
        );
    }
);

Given(
    '{string} goes to the timesheet detail page of the created timesheet',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const staffProfile = getUserProfileFromContext(
            scenario,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );

        const staffName = staffProfile?.name;

        await cms.instruction(`Go to timesheet for ${staffName}`, async function (cms) {
            const timesheetId = scenario.get(timesheetIdAlias);

            await goToTimesheetDetail(cms, timesheetId);
        });
    }
);

When(
    '{string} clicks the delete timesheet button',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction('See delete timesheet confirmation', async function (cms) {
            await openDeleteTimesheetConfirmation(cms);
        });
    }
);

Then('{string} deletes the timesheet', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction('Deletes the timesheet', async function (cms) {
        await clickDeleteTimesheetButton(cms);
    });
});

Then(
    '{string} does not see the deleted timesheet on the timesheet table list',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction('Does not see timesheet on timesheet list', async function (cms) {
            await assertTimesheetDeletedOnTimesheetList(cms, role, scenario);
        });
    }
);

Then(
    '{string} proceeds to delete the timesheet',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction('Delete the timesheet', async function (cms) {
            await deleteTimesheet(cms);
        });
    }
);

Then(
    '{string} does not see the deleted timesheet on the timesheet table list after refresh',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction('Cancels delete the timesheet', async function (cms) {
            const cancelDeleteButton = cms.page!.locator(confirmDialogButtonClose);

            await cancelDeleteButton.click();
        });

        //TODO: refresh the page and assert timesheet info not found message when issue is fixed
        // https://manabie.atlassian.net/browse/LT-23225

        await cms.instruction('Does not see timesheet on timesheet list', async function (cms) {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
            await assertTimesheetDeletedOnTimesheetList(cms, role, scenario);
        });
    }
);
