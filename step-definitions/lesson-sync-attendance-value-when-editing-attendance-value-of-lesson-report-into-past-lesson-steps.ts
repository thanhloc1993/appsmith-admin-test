import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasAttendanceStatusValue } from './alias-keys/lesson';
import {
    attendanceStatusAutocompleteInput,
    attendanceStatusDetailValue,
} from './cms-selectors/lesson-management';
import { editToRandomAttendanceStatus } from './lesson-sync-attendance-value-when-editing-attendance-value-of-lesson-report-into-past-lesson-definitions';
import { submitIndividualLessonReport } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import { assertFieldValueInPage } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import { selectAttendanceStatus } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has chosen {string} Attendance status of student',
    async function (role: AccountRoles, attendanceStatus: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has chosen ${attendanceStatus} Attendance status of student`,
            async function () {
                await selectAttendanceStatus(
                    cms,
                    attendanceStatus,
                    attendanceStatusAutocompleteInput
                );
            }
        );
    }
);

Given('{string} has submitted individual lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} has submitted individual lesson report`, async function () {
        await submitIndividualLessonReport(cms, true);
    });
});

When(
    '{string} edits to {string} Attendance status',
    async function (role: AccountRoles, attendanceValuesList: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} edits to ${attendanceValuesList} Attendance status`,
            async function () {
                await editToRandomAttendanceStatus(
                    cms,
                    scenarioContext,
                    attendanceStatusAutocompleteInput,
                    attendanceValuesList
                );
            }
        );
    }
);

Then(
    '{string} sees {string} Attendance status in detailed lesson report info page',
    async function (role: AccountRoles, _attendanceStatus: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const attendanceValue = scenarioContext.get(aliasAttendanceStatusValue);

        await cms.instruction(
            `${role} sees ${attendanceValue} Attendance status in detailed lesson report info page`,
            async function () {
                await assertFieldValueInPage(
                    cms.page!,
                    attendanceStatusDetailValue,
                    attendanceValue
                );
            }
        );
    }
);
