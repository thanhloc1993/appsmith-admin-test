import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { userSeeEmptyGroupReport } from 'test-suites/squads/lesson/step-definitions/lesson-teacher-saves-draft-group-lesson-report-of-past-lesson-definitions';
import { saveDraftGroupLessonReport } from 'test-suites/squads/lesson/utils/lesson-report';

When('{string} saves draft group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} saves draft group lesson report`, async function () {
        await saveDraftGroupLessonReport(cms);
    });
});

Then('{string} sees blank group lesson report info', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} sees blank group lesson report info`, async function () {
        await userSeeEmptyGroupReport(cms);
    });
});

When(
    '{string} saves draft group lesson report with missing all fields',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} saves draft group lesson report with missing all fields`,
            async function () {
                await saveDraftGroupLessonReport(cms);
            }
        );
    }
);
