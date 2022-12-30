import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    discardLessonReportUpsertForm,
    DiscardOptions,
    notSeenIndividualLessonReport,
} from './lesson-teacher-discard-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

When(
    '{string} discards lesson report by {string}',
    async function (this: IMasterWorld, role: AccountRoles, discardOption: DiscardOptions) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} discards lesson report by ${discardOption}`,
            async function () {
                await discardLessonReportUpsertForm(cms, discardOption);
            }
        );
    }
);

When(
    '{string} confirms discarding lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} confirms discarding lesson report`, async function () {
            await cms.confirmDialogAction();
        });
    }
);

When(
    '{string} cancels discarding lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} cancels discarding lesson report`, async function () {
            await cms.cancelDialogAction();
        });
    }
);

Then(
    '{string} does not see new individual lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} does not see new individual lesson report`,
            async function () {
                await notSeenIndividualLessonReport(cms);
            }
        );
    }
);
