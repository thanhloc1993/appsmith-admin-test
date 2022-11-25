import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { TimesheetStatus } from 'test-suites/squads/timesheet/common/types';
import { createTimesheetsWithStatus } from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';
import {
    getTimesheetContextKey,
    getTimesheetIdFromURL,
} from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';

Given(
    '{string} creates {int} timesheet {string} with {string} status',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        numOfTimesheets: number,
        timesheetKey: string,
        timesheetStatus: TimesheetStatus
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(`Create draft timesheet ${timesheetKey}`, async () => {
            await createTimesheetsWithStatus({
                cms,
                role,
                scenarioContext,
                numOfTimesheets,
                timesheetStatus,
            });

            scenarioContext.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
            });
        });
    }
);

When('{string} reloads page', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} reloads page`, async (cms) => {
        await cms.page!.reload();
    });
});
