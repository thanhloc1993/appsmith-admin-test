import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    clickApproveTimesheetButton,
    assertConfirmationMessage,
    clickProceedApproveTimesheetButton,
} from 'test-suites/squads/timesheet/step-definitions/approver-approves-the-timesheet-definitions';
import { assertApproveButtonIsEnabled } from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';

When(
    '{string} can see the Approve button is enabled',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertApproveButtonIsEnabled(cms);
    }
);

When(
    '{string} clicks on the Approve button',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await clickApproveTimesheetButton(cms);
    }
);

When(
    '{string} sees the confirmation box with message {string}',
    async function (this: IMasterWorld, role: AccountRoles, message: string) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertConfirmationMessage(cms, message);
    }
);

When(
    '{string} proceeds to approve the timesheet\\(s)',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await clickProceedApproveTimesheetButton(cms);
    }
);
