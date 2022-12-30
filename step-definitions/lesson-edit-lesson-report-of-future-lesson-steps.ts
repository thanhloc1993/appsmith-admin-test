import { Given, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLessonReportData } from './alias-keys/lesson';
import {
    clearAttendanceStatus,
    createAnDraftIndividualLessonReport,
    getLessonReportDataFromDetailPage,
    openEditLessonReportDialog,
} from './lesson-edit-lesson-report-of-future-lesson-definitions';
import {
    isOnLessonReportDetailPage,
    isOnLessonReportUpsertPage,
    submitIndividualLessonReport,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    '{string} has saved draft individual lesson report with missing all fields',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} create draft lesson report with missing all fields`,
            async function () {
                await createAnDraftIndividualLessonReport(cms);
            }
        );

        await cms.instruction('Is newly lesson report created', async function () {
            await isOnLessonReportDetailPage(cms);
        });

        await cms.instruction('Save lesson report data', async function () {
            const currentLessonReportData: string[] = await getLessonReportDataFromDetailPage(cms);
            scenario.set(aliasLessonReportData, currentLessonReportData);
        });
    }
);

Given(
    '{string} has opened editing individual lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} opens editing individual lesson report`, async function () {
            await openEditLessonReportDialog(cms);
        });

        await cms.instruction(`See lesson report upsert dialog`, async function () {
            await isOnLessonReportUpsertPage(cms);
        });
    }
);

When(
    '{string} submits for editing lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} submits for editing lesson report`, async function () {
            await submitIndividualLessonReport(cms, true);
        });
    }
);

Given(
    '{string} has cleared Attendance status value',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has cleared Attendance status value`, async function () {
            await clearAttendanceStatus(cms);
        });
    }
);
