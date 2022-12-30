import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonReportData } from 'test-suites/squads/lesson/common/alias-keys';
import {
    openLessonReportUpsertDialog,
    saveDraftGroupLessonReport,
    openEditingLessonReport,
    fillValueGroupLessonReport,
    compareOldAndNewLessonReportData,
    saveDraftLessonReportGrp,
    submitAllLessonReportGrp,
    userIsOnLessonReportGrpUpsertDialog,
} from 'test-suites/squads/lesson/utils/lesson-report';

Given(
    '{string} has saved draft group lesson report with missing all fields',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(
            `${role} has opened group lesson report upsert dialog`,
            async function () {
                await openLessonReportUpsertDialog({
                    page,
                    lessonType: 'group',
                    upsertType: 'creating',
                });
                await saveDraftGroupLessonReport(cms);
            }
        );
    }
);

Given('{string} has opened editing group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction(
        `${role} has opened group lesson report upsert dialog`,
        async function () {
            await openEditingLessonReport(cms, scenario);
        }
    );
});

Given(
    '{string} has changed fields info of group lesson report',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} refills lesson info of group lesson report`,
            async function () {
                await fillValueGroupLessonReport({
                    cms,
                    index: 2,
                    fields: [
                        'Content',
                        'Remark (Internal Only)',
                        'Homework',
                        'Announcement',
                        'Homework Completion',
                        'In-lesson Quiz',
                        'Remark',
                    ],
                });
            }
        );
    }
);

When('{string} saves draft a group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} saves draft a group lesson report`, async function () {
        await saveDraftLessonReportGrp(cms.page!);
    });
});

When('{string} clicks submit all group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} clicks submit all group lesson report`, async function () {
        await submitAllLessonReportGrp(cms.page!);
    });
});

Then('{string} sees updated lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;
    const oldLessonReportData = scenario.get<string[]>(aliasLessonReportData);

    await cms.instruction(
        'compare current lesson report with old lesson report data',
        async function () {
            await compareOldAndNewLessonReportData(cms, oldLessonReportData, false);
        }
    );
});

Then('{string} is still in editing group lesson report page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(
        `${role} is still in editing group lesson report page`,
        async function () {
            await userIsOnLessonReportGrpUpsertDialog(cms.page!);
        }
    );
});
