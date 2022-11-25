import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { studentAttendanceStatusInput } from './cms-selectors/lesson-management';
import { getCMSInterfaceByRole } from './utils';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import { submitLessonOfLessonManagement } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { assertValueOfAttendanceInfoStatus } from 'test-suites/squads/lesson/step-definitions/school-admin-duplicate-group-lesson-definitions';
import { selectAttendanceStatus } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has set {string} Attendance value of student',
    async function (role: AccountRoles, attendanceValue: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} has set {string} Attendance value of student`,
            async function () {
                await selectAttendanceStatus(cms, attendanceValue, studentAttendanceStatusInput);
            }
        );
    }
);

Given('{string} has created the lesson of lesson management', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;

    await cms.instruction(`${role} has created the lesson of lesson management`, async function () {
        await submitLessonOfLessonManagement(cms, scenarioContext);
    });
});

Then(
    '{string} sees {string} Attendance value of student',
    async function (role: AccountRoles, attendanceValue: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees ${attendanceValue} Attendance value of student`,
            async function () {
                await assertValueOfAttendanceInfoStatus(cms, attendanceValue);
            }
        );
    }
);
