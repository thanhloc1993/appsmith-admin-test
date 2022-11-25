import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { lessonUpsertStudentAttendanceStatusInput } from 'test-suites/squads/lesson/common/cms-selectors';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import { selectStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { assertValueOfAttendanceInfoStatus } from 'test-suites/squads/lesson/step-definitions/school-admin-duplicate-group-lesson-definitions';
import { selectAttendanceStatus } from 'test-suites/squads/lesson/utils/lesson-upsert';

When('{string} adds student in lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} adds student in lesson`, async function () {
        await selectStudentSubscriptionV2({ cms });
    });
});

Then('{string} sees default Attendance value is blank', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(
        `${role} sees default Attendance status value of student is blank`,
        async function () {
            await assertValueOfAttendanceInfoStatus(cms, '');
        }
    );
});

Given('{string} has added student in lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} adds student in lesson`, async function () {
        await selectStudentSubscriptionV2({ cms });
    });
});

When(
    '{string} updates Attendance value of student with {string}',
    async function (role: AccountRoles, attendanceValue: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} updates attendance status of student to ${attendanceValue}`,
            async function () {
                await selectAttendanceStatus(
                    cms,
                    attendanceValue,
                    lessonUpsertStudentAttendanceStatusInput
                );
            }
        );
    }
);

Then(
    '{string} sees Attendance value of students is {string} in creating lesson page',
    async function (role: AccountRoles, attendanceValue: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees attendance status of student is ${attendanceValue}`,
            async function () {
                await assertValueOfAttendanceInfoStatus(cms, attendanceValue);
            }
        );
    }
);
