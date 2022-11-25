import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { saveDraftIndividualLessonReport } from './lesson-teacher-save-draft-individual-lesson-report-definitions';
import {
    createLessonManagementIndividualLessonWithGRPC,
    fillAllPercentageFields,
    fillAllTextAreaFields,
    fillAllTextFields,
    selectValueLessonReportAutocomplete,
    isLessonReportFulfilled,
    isOnLessonReportUpsertPage,
    openLessonReportUpsertDialog,
    seeAlertMessageMissingAttendanceStatus,
    seeErrorIconOnStudentListOfLessonReport,
    submitIndividualLessonReport,
    fulfillLessonReportInfo,
    clickSubmitAllLessonReport,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    'school admin has created a lesson of lesson management with start date&time is within 10 minutes from now',
    { timeout: 90000 },
    async function (this: IMasterWorld) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson of lesson management with start date&time is within 10 minutes from now`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'within 10 minutes from now'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson of lesson management that has been completed over 24 hours',
    { timeout: 90000 },
    async function (this: IMasterWorld) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson of lesson management that has been completed over 24 hours`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'completed over 24 hours'
                );
            }
        );
    }
);

When(
    '{string} opens creating individual lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} opens lesson report upsert dialog`, async function () {
            await cms.waitingForLoadingIcon();
            await openLessonReportUpsertDialog(cms);
        });
    }
);

Given(
    '{string} has fulfilled lesson report info',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} fulfills lesson report form`, async function () {
            await fulfillLessonReportInfo(cms);
        });
    }
);

When(
    '{string} submits individual lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} submits individual lesson report`, async function () {
            await submitIndividualLessonReport(cms, true);
        });
    }
);

When(
    '{string} clicks submit all individual lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} clicks submit all individual lesson report`,
            async function () {
                await clickSubmitAllLessonReport(cms);
            }
        );
    }
);

Then(
    '{string} sees fulfilled lesson report info',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees fulfilled lesson report info`, async function () {
            await isLessonReportFulfilled(cms);
        });
    }
);

When(
    '{string} submits lesson report with missing Attendance Status field',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} submits lesson report with missing Attendance Status field`,
            async function () {
                await cms.waitingForLoadingIcon();

                await selectValueLessonReportAutocomplete({
                    cms,
                    chooseItemAt: 1,
                    shouldSelectAutocomplete: 'without attendance status',
                });
                await fillAllTextFields(cms, 'Sample Text');
                await fillAllPercentageFields(cms, 99);
                await fillAllTextAreaFields(cms, 'Sample Text');

                await clickSubmitAllLessonReport(cms);
            }
        );
    }
);

Then(
    '{string} sees alert message below Attendance Status field',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees alert message below Attendance Status field`,
            async function () {
                await seeAlertMessageMissingAttendanceStatus(cms);
            }
        );
    }
);

Then(
    '{string} sees alert icon in student list',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees alert icon in student list`, async function () {
            await seeErrorIconOnStudentListOfLessonReport(cms);
        });
    }
);

Then(
    '{string} is still in creating individual lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} is still in creating individual lesson report page`,
            async function () {
                await isOnLessonReportUpsertPage(cms);
            }
        );
    }
);

When(
    '{string} cancels submitting lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} cancels submitting lesson report`, async function () {
            await submitIndividualLessonReport(cms, false);
        });
    }
);

Then(
    '{string} is still in editing individual lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} is still in editing individual lesson report page`,
            async function () {
                await isOnLessonReportUpsertPage(cms);
            }
        );
    }
);

When(
    '{string} saves draft for editing lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} saves draft for editing lesson report`, async function () {
            await saveDraftIndividualLessonReport(cms);
        });
    }
);
