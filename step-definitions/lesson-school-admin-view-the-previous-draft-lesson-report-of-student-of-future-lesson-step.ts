import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { openEditLessonReportDialog } from 'step-definitions/lesson-edit-lesson-report-of-future-lesson-definitions';
import { assertLessonReportButtonStatus } from 'step-definitions/lesson-management-view-study-plan-of-student-of-future-lesson-definitions';
import { isOnLessonReportUpsertPage } from 'step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { seePreviousReport } from 'step-definitions/lesson-view-the-previous-submitted-lesson-report-of-student-of-future-lesson-definitions';
import { ViewStudyPlanOrPreviousReportButtonType } from 'step-definitions/types/content';
import { getCMSInterfaceByRole } from 'step-definitions/utils';

Then(
    '{string} goes to editing individual lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} goes to editing individual lesson report page`,
            async function () {
                await openEditLessonReportDialog(cms);
            }
        );

        await cms.instruction(`${role} sees lesson report upsert dialog`, async function () {
            await isOnLessonReportUpsertPage(cms);
        });
    }
);

When(
    "{string} sees {string} button's state is {string}",
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        button: ViewStudyPlanOrPreviousReportButtonType,
        state: 'enabled' | 'disabled'
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees ${button} button's state is ${state}`,
            async function () {
                await assertLessonReportButtonStatus(cms, button, state);
            }
        );
    }
);

Then(
    '{string} sees the previous {string} lesson report of this student',
    async function (role: AccountRoles, status: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees the previous ${status} lesson report of this student`,
            async function () {
                await seePreviousReport(cms);
            }
        );
    }
);
