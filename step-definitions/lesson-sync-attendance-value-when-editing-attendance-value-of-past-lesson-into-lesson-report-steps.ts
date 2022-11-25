import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { assertUpdatedAttendanceInReportInfo } from './lesson-sync-attendance-value-when-editing-attendance-value-of-past-lesson-into-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';
import { aliasAttendanceStatusValue } from 'step-definitions/alias-keys/lesson';

Then(
    '{string} sees {string} Attendance status in detailed lesson report info',
    async function (role: AccountRoles, _attendanceStatus: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const attendanceValue = scenarioContext.get(aliasAttendanceStatusValue);

        await cms.instruction(
            `${role} sees ${attendanceValue} Attendance status in detailed lesson report info`,
            async function () {
                await assertUpdatedAttendanceInReportInfo(cms, attendanceValue);
            }
        );
    }
);
