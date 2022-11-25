import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { assertTimesheetListRowsMatchedTheFilter } from './apply-status-filter-name-search-and-date-filter-definitions';

Then(
    '{string} sees all timesheets in results match the selected status and date',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees all the timesheet in results match the selected status and date`,
            async function () {
                await assertTimesheetListRowsMatchedTheFilter(cms, scenario, role);
            }
        );
    }
);
