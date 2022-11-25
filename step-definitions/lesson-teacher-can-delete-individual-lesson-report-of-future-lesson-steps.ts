import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import { assertLessonReportNotExist } from './lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import { isOnLessonReportDetailPage } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

When(
    '{string} confirms to delete lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} confirms to delete lesson report`, async function () {
            await cms.selectActionButton(ActionOptions.DELETE, {
                target: 'actionPanelTrigger',
            });
            await cms.confirmDialogAction();
        });
    }
);

Then(
    '{string} does not see lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} does not see lesson report`, async function () {
            await assertLessonReportNotExist(cms);
        });
    }
);

When(
    '{string} cancels deleting lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} cancels deleting lesson report`, async function () {
            await cms.selectActionButton(ActionOptions.DELETE, {
                target: 'actionPanelTrigger',
            });
            await cms.cancelDialogAction();
        });
    }
);

Then(
    '{string} is still in detailed lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} is still in detailed lesson report page`, async function () {
            await cms.waitingForLoadingIcon();
            await isOnLessonReportDetailPage(cms);
        });
    }
);
