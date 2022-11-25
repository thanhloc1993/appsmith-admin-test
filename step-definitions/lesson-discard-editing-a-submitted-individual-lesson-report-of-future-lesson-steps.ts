import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLessonReportData } from './alias-keys/lesson';
import {
    compareOldAndNewLessonReportData,
    createAnDraftIndividualLessonReport,
    getLessonReportDataFromDetailPage,
} from './lesson-edit-lesson-report-of-future-lesson-definitions';
import {
    discardLessonReportUpsertForm,
    DiscardOptions,
} from './lesson-teacher-discard-individual-lesson-report-definitions';
import {
    checkLessonReportStatusTag,
    isOnLessonReportDetailPage,
    LessonReportStatusTag,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    '{string} has saved draft individual lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} saved draft individual lesson report`, async function () {
            await createAnDraftIndividualLessonReport(cms, true);
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
    '{string} discards editing lesson report by {string}',
    async function (this: IMasterWorld, role: AccountRoles, discardOption: DiscardOptions) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} discards editing lesson report by ${discardOption}`,
            async function () {
                await discardLessonReportUpsertForm(cms, discardOption);
            }
        );

        await cms.instruction(`${role} confirm discard`, async function () {
            await cms.confirmDialogAction();
        });
    }
);

Then(
    '{string} does not see updated lesson report',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const oldLessonReportData = scenario.get<string[]>(aliasLessonReportData);

        await cms.instruction(`${role} does not see updated lesson report`, async function () {
            await compareOldAndNewLessonReportData({
                cms,
                oldLessonReportData,
                shouldBeSame: true,
            });
        });
    }
);

Then(
    '{string} still sees {string} tag of lesson report',
    async function (this: IMasterWorld, role: AccountRoles, tag: LessonReportStatusTag) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees ${tag} tag of lesson report`, async function () {
            await checkLessonReportStatusTag(cms, tag);
        });
    }
);

When(
    '{string} cancels discarding editing lesson report by {string}',
    async function (this: IMasterWorld, role: AccountRoles, discardOption: DiscardOptions) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} discards editing lesson report by ${discardOption}`,
            async function () {
                await discardLessonReportUpsertForm(cms, discardOption);
            }
        );

        await cms.instruction(`${role} cancel discard`, async function () {
            await cms.cancelDialogAction();
        });
    }
);
