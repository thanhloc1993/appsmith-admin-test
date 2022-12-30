import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    assertTimesheetManagementTableColumnExists,
    assertTimesheetManagementApproveButtonExists,
} from 'test-suites/squads/timesheet/step-definitions/view-timesheet-pages-as-confirmer-definitions';

Then(
    '{string} sees approve timesheet button on timesheet management page',
    async function (this: IMasterWorld, role: string) {
        const cms = this.cms;
        await cms.instruction(
            `${role} sees create timesheet button on timesheet management page`,
            async () => {
                await assertTimesheetManagementApproveButtonExists(cms);
            }
        );
    }
);

Then(
    '{string} sees column {string} on timesheet management table',
    async function (this: IMasterWorld, role: string, columnLabel: string) {
        const cms = this.cms;
        await cms.instruction(
            `${role} sees column ${columnLabel} on timesheet management table`,
            async () => {
                await assertTimesheetManagementTableColumnExists(cms, columnLabel);
            }
        );
    }
);
