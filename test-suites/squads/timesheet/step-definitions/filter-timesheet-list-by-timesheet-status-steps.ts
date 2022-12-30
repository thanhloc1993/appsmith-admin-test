import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { assertTotalTimesheetCountOnAllStatusTab } from 'test-suites/squads/timesheet/step-definitions/filter-timesheet-list-by-timesheet-status-definitions';

When(
    '{string} navigates to timesheet management page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} goes to timesheet management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
        });

        await cms.waitForSkeletonLoading();
    }
);

Then(
    '{string} sees the total number of timesheets on the All status tab',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            'see total number of timesheets on All status tab',
            async function () {
                await assertTotalTimesheetCountOnAllStatusTab(cms);
            }
        );
    }
);
