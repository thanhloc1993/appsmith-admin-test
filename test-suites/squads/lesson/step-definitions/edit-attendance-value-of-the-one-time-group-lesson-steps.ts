import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    AttendanceNoticeValues,
    AttendanceReasonValues,
    AttendanceStatusValues,
} from 'test-suites/squads/lesson/common/types';
import {
    addStudentToLessonOnLessonPage,
    assertAttendanceNoticeEnable,
    updatesAttendanceNote,
    updatesAttendanceNotice,
    updatesAttendanceReason,
    updatesAttendanceStatus,
} from 'test-suites/squads/lesson/step-definitions/edit-attendance-value-of-the-one-time-group-lesson-definitions';
import {
    assertValueOfAttendanceInfoNote,
    assertValueOfAttendanceInfoNotice,
    assertValueOfAttendanceInfoReason,
    assertValueOfAttendanceInfoStatus,
} from 'test-suites/squads/lesson/step-definitions/school-admin-duplicate-group-lesson-definitions';

Given('{string} has added student in lesson page on CMS', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction(`${role} has added student in lesson page on CMS`, async function () {
        await addStudentToLessonOnLessonPage(cms, context);
    });
});

When('{string} adds student in lesson page on CMS', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction(`${role} adds student in lesson page on CMS`, async function () {
        await addStudentToLessonOnLessonPage(cms, context);
    });
});

When(
    '{string} updates {string}, {string}, {string}, and {string} of student',
    async function (
        role: AccountRoles,
        status: AttendanceStatusValues,
        notice: AttendanceNoticeValues,
        reason: AttendanceReasonValues,
        note: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} updates ${status}, ${notice}, ${reason}, and ${note} of student`,
            async function () {
                await updatesAttendanceStatus(cms, status);
                if (status !== 'Attend' && status !== '') {
                    await updatesAttendanceNotice(cms, notice);
                }
                await updatesAttendanceReason(cms, reason);
                await updatesAttendanceNote(cms, note);
            }
        );
    }
);

Then(
    '{string} sees Attendance is {string}, {string}, {string}, and {string} of student',
    async function (
        role: AccountRoles,
        status: AttendanceStatusValues,
        notice: AttendanceNoticeValues,
        reason: AttendanceReasonValues,
        note: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees Attendance is ${status}, ${notice}, ${reason}, and ${note} of student`,
            async function () {
                await assertValueOfAttendanceInfoStatus(cms, status);
                await assertValueOfAttendanceInfoNotice(cms, notice);
                await assertValueOfAttendanceInfoReason(cms, reason);
                await assertValueOfAttendanceInfoNote(cms, note);
            }
        );
    }
);

Then(
    '{string} sees attendance Status info of students is {string}',
    async function (role: AccountRoles, status: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees attendance Status info of students is ${status}`,
            async function () {
                await assertValueOfAttendanceInfoStatus(cms, status);
            }
        );
    }
);

Then('{string} sees default Attendance Notice is disable', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} sees default Attendance Notice is disable`, async function () {
        await assertAttendanceNoticeEnable(cms, false);
    });
});
