import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { IndividualLessonReportField } from 'test-suites/squads/lesson/common/types';
import {
    cancelSubmitIndLessonReport,
    userIsOnUpsertLessonReportInd,
} from 'test-suites/squads/lesson/step-definitions/teacher-can-submit-individual-lesson-report-definitions';
import { submitIndLessonReport } from 'test-suites/squads/lesson/utils/lesson-report';

When(
    '{string} submits individual lesson report with missing {string} field',
    async function (role: AccountRoles, field: IndividualLessonReportField) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(
            `${role} submits individual lesson report with missing ${field} field`,
            async function () {
                await submitIndLessonReport(page);
            }
        );
    }
);

When('{string} cancels submitting individual lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const page = cms.page!;

    await cms.instruction(`${role} cancels submitting individual lesson report`, async function () {
        await submitIndLessonReport(page);
        await cancelSubmitIndLessonReport(page);
    });
});

Then('{string} is in creating individual lesson report page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const page = cms.page!;

    await cms.instruction(
        `${role} is in creating individual lesson report page`,
        async function () {
            await userIsOnUpsertLessonReportInd(page);
        }
    );
});
