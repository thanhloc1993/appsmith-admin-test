import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasAttendanceStatusBulkAction } from './alias-keys/lesson';
import {
    openLessonReportBulkActionUpsertDialog,
    assertValueAttendanceStatusBulkAction,
    teacherAppliesBulkAction,
    assertValueAttendanceStatus,
} from './lesson-bulk-action-in-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';
import { AttendanceStatus } from 'step-definitions/lesson-management-utils';

When('{string} opens bulk action', async function (this: IMasterWorld, role: AccountRoles) {
    await openLessonReportBulkActionUpsertDialog(this, role);
});

Given('{string} has opened bulk action', async function (this: IMasterWorld, role: AccountRoles) {
    await openLessonReportBulkActionUpsertDialog(this, role);
});

Then(
    '{string} sees default value is {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: AttendanceStatus) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees default value is ${option}`, async function () {
            await assertValueAttendanceStatusBulkAction(cms, option);
        });
    }
);

When(
    '{string} applies bulk action with {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        await openLessonReportBulkActionUpsertDialog(this, role);
        await teacherAppliesBulkAction(this, role, option);
    }
);

Then(
    '{string} sees Attendance Status of students is {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: AttendanceStatus) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertValueAttendanceStatus(cms, option);
    }
);

Given(
    '{string} has applied bulk action with {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: AttendanceStatus) {
        await openLessonReportBulkActionUpsertDialog(this, role);
        await teacherAppliesBulkAction(this, role, option);
    }
);

Then(
    '{string} sees Attendance Status of student is updated to {string}',
    async function (this: IMasterWorld, role: AccountRoles, _: AttendanceStatus) {
        const cms = getCMSInterfaceByRole(this, role);
        const attendanceStatus = this.scenario.get<AttendanceStatus>(
            aliasAttendanceStatusBulkAction
        );

        await assertValueAttendanceStatus(cms, attendanceStatus);
    }
);
