import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLessonReportData } from './alias-keys/lesson';
import {
    assertPreviousReportButtonStatus,
    seeDoesNotHavePreviousReportMessage,
} from './lesson-cannot-view-the-previous-lesson-report-of-student-definitions';
import {
    createAnIndividualLessonReport,
    getLessonReportDataFromDetailPage,
    openEditLessonReportDialog,
} from './lesson-edit-lesson-report-of-future-lesson-definitions';
import { LessonReportButtonsStatus } from './lesson-report-utils';
import {
    isOnLessonReportDetailPage,
    isOnLessonReportUpsertPage,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    '{string} has created an individual lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} creating lesson report`, async function () {
            await createAnIndividualLessonReport(cms);
        });

        await cms.instruction('Is newly lesson report created', async function () {
            await isOnLessonReportDetailPage(cms);
        });

        await cms.instruction('Save lesson report data', async function () {
            const currentLessonReportData: string[] = await getLessonReportDataFromDetailPage(cms);
            scenario.set(aliasLessonReportData, currentLessonReportData);
        });
    }
);

When(
    '{string} opens editing individual lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} opens editing individual lesson report`, async function () {
            await openEditLessonReportDialog(cms);
        });

        await cms.instruction(`${role} sees lesson report upsert dialog`, async function () {
            await isOnLessonReportUpsertPage(cms);
        });
    }
);

Then(
    '{string} sees the previous lesson report button is {string} on creating lesson report page',
    async function (this: IMasterWorld, role: AccountRoles, state: LessonReportButtonsStatus) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the previous lesson report button is ${state} on creating lesson report page`,
            async function () {
                await assertPreviousReportButtonStatus(cms, state, 'lesson report upsert dialog');
            }
        );
    }
);

Then(
    '{string} sees the previous lesson report button is {string} on editing lesson report page',
    async function (this: IMasterWorld, role: AccountRoles, state: LessonReportButtonsStatus) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the previous lesson report button is ${state} on editing lesson report page`,
            async function () {
                await assertPreviousReportButtonStatus(cms, state, 'lesson report upsert dialog');
            }
        );
    }
);

Then(
    '{string} sees the previous lesson report button is {string} on detail lesson report page',
    async function (this: IMasterWorld, role: AccountRoles, state: LessonReportButtonsStatus) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the previous lesson report button is ${state} on detail lesson report page`,
            async function () {
                await assertPreviousReportButtonStatus(cms, state, 'lesson report detail');
            }
        );
    }
);

Then(
    '{string} sees an message that student does not have the previous lesson report on creating lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees an message that student does not have the previous lesson report on creating lesson report page`,
            async function () {
                await seeDoesNotHavePreviousReportMessage(cms, 'lesson report upsert dialog');
            }
        );
    }
);

Then(
    '{string} sees an message that student does not have the previous lesson report on editing lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees an message that student does not have the previous lesson report on editing lesson report page`,
            async function () {
                await seeDoesNotHavePreviousReportMessage(cms, 'lesson report upsert dialog');
            }
        );
    }
);

Then(
    '{string} sees an message that student does not have the previous lesson report on detail lesson report page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees an message that student does not have the previous lesson report on detail lesson report page`,
            async function () {
                await seeDoesNotHavePreviousReportMessage(cms, 'lesson report detail');
            }
        );
    }
);
