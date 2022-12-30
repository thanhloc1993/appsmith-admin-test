import { When, Then, Given } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertValueAttendanceStatus,
    fillAttendanceStatusBulkAction,
    getRandomOptionAttendanceStatus,
} from './lesson-bulk-action-in-individual-lesson-report-definitions';
import { cancelBulkAction } from './lesson-cancel-bulk-action-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

When(
    '{string} fills in bulk action with {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const attendanceStatus = getRandomOptionAttendanceStatus(option);

        await fillAttendanceStatusBulkAction(cms, attendanceStatus);
    }
);

Given(
    '{string} has filled in bulk action with {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const attendanceStatus = getRandomOptionAttendanceStatus(option);

        await fillAttendanceStatusBulkAction(cms, attendanceStatus);
    }
);

When('{string} cancels bulk action', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cancelBulkAction(cms);
});

Then(
    '{string} sees Attendance Status of students is blank',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertValueAttendanceStatus(cms, '');
    }
);
