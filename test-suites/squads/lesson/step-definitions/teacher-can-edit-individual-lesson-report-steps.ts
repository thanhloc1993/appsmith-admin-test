import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { IndividualLessonReportFieldArray } from 'test-suites/squads/lesson/common/constants';
import { IndividualLessonReportField, LessonType } from 'test-suites/squads/lesson/common/types';
import {
    assertAlertMessageBelowIndReportField,
    assertLessonReportDetailUpdated,
    clearFieldLessonReportInd,
} from 'test-suites/squads/lesson/step-definitions/teacher-can-edit-individual-lesson-report-definitions';
import {
    openLessonReportUpsertDialog,
    updateIndividualLessonReport,
} from 'test-suites/squads/lesson/utils/lesson-report';

Given(
    '{string} has changed individual lesson report fields info',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has changed individual lesson report fields info`,
            async function () {
                await updateIndividualLessonReport(cms);
            }
        );
    }
);

Given(
    '{string} has opened editing {string} lesson report page',
    async function (role: AccountRoles, lessonType: LessonType) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(
            `${role} has opened ${lessonType} lesson report upsert dialog`,
            async function () {
                await openLessonReportUpsertDialog({
                    page,
                    lessonType,
                    upsertType: 'editing',
                });
            }
        );
    }
);

Then('{string} sees updated individual lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const page = cms.page!;

    await cms.instruction(`${role} sees updated individual lesson report`, async function () {
        await assertLessonReportDetailUpdated(page);
    });
});

Given(
    '{string} has cleared {string} value in individual lesson report',
    async function (role: AccountRoles, field: IndividualLessonReportField) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(
            `${role} has cleared ${field} value in individual lesson report`,
            async function () {
                await clearFieldLessonReportInd({
                    page,
                    field,
                });
            }
        );
    }
);

Then(
    '{string} sees alert message below {string} field of completed individual lesson',
    async function (role: AccountRoles, reportIndField: IndividualLessonReportField) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees alert message below ${reportIndField} field of completed individual lesson`,
            async function () {
                await assertAlertMessageBelowIndReportField({
                    cms,
                    reportIndField,
                    completedLesson: true,
                });
            }
        );
    }
);

Then(
    '{string} sees alert message below {string} field of individual lesson',
    async function (role: AccountRoles, reportIndField: IndividualLessonReportField) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees alert message below ${reportIndField} field of individual lesson`,
            async function () {
                await assertAlertMessageBelowIndReportField({
                    cms,
                    reportIndField,
                });
            }
        );
    }
);

Given(
    '{string} has cleared all fields of individual lesson report',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;
        const clearFieldsArray = IndividualLessonReportFieldArray.filter(
            (field) => field !== 'Attendance Notice'
        );
        // Don't clear Attendance Notice field because this field is cleared automatically when Attendance Status field is cleared

        await cms.instruction(
            `${role} has cleared all fields of individual lesson report`,
            async function () {
                for (const field of clearFieldsArray) {
                    await clearFieldLessonReportInd({
                        page,
                        field,
                    });
                }
            }
        );
    }
);
