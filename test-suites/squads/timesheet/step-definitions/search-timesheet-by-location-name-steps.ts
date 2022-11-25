import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { assertTimesheetsCreated } from 'test-suites/squads/timesheet/step-definitions/search-timesheet-by-location-name-definitions';

Given(
    '{string} has created timesheets for a staff',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction('goes to timesheet management page', async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
        });

        await cms.instruction('sees timesheets have been created', async function () {
            await assertTimesheetsCreated(cms);
        });
    }
);
