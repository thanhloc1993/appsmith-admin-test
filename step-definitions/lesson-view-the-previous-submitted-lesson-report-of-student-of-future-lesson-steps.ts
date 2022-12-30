import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLessonIdForPreviousReport, aliasLessonReportData } from './alias-keys/lesson';
import {
    createAnDraftIndividualLessonReport,
    createAnIndividualLessonReport,
    getLessonReportDataFromDetailPage,
} from './lesson-edit-lesson-report-of-future-lesson-definitions';
import { isOnLessonReportDetailPage } from './lesson-teacher-submit-individual-lesson-report-definitions';
import {
    createLessonForCurrentStudent,
    goToNewCreatedLesson,
    seePreviousReport,
    viewPreviousReport,
    viewPreviousReportInEditDialog,
} from './lesson-view-the-previous-submitted-lesson-report-of-student-of-future-lesson-definitions';
import { getCMSInterfaceByRole } from './utils';

Then('{string} views the previous lesson report of student', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} views the previous lesson report of student`, async function () {
        await viewPreviousReport(cms);
    });
});

Given(
    '{string} has created previous lesson report for this student in this course',
    { timeout: 90000 },
    async function (role: AccountRoles) {
        const cmsSchoolAdmin = this.cms;
        const cmsTeacher = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cmsSchoolAdmin.instruction(
            `school admin creates a lesson for current student`,
            async function () {
                await createLessonForCurrentStudent(cmsSchoolAdmin, scenarioContext);
            }
        );

        await cmsTeacher.instruction(`${role} goes to new created lesson`, async function () {
            const newLessonId = scenarioContext.get(aliasLessonIdForPreviousReport);
            await goToNewCreatedLesson(cmsTeacher, newLessonId);
        });

        await cmsTeacher.instruction(`${role} is creating lesson report`, async function () {
            await createAnIndividualLessonReport(cmsTeacher);
        });

        await cmsTeacher.instruction('Is newly lesson report created', async function () {
            await isOnLessonReportDetailPage(cmsTeacher);
        });

        await cmsTeacher.instruction('Save lesson report data', async function () {
            await getLessonReportDataFromDetailPage(cmsTeacher);
        });
    }
);

Then(
    '{string} sees the previous {string} lesson report of student',
    async function (role: AccountRoles, status: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees the previous ${status} lesson report of student`,
            async function () {
                await seePreviousReport(cms);
            }
        );
    }
);

When(
    '{string} views the previous lesson report of student in editing lesson report dialog',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;
        await cms.instruction(
            `${role} views the previous lesson report of student in editing lesson report dialog`,
            async function () {
                await viewPreviousReportInEditDialog(page);
            }
        );
    }
);

When(
    '{string} saves draft individual lesson report of {string} lesson',
    async function (this: IMasterWorld, role: AccountRoles, state: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} saves draft individual lesson report of ${state} lesson`,
            async function () {
                await createAnDraftIndividualLessonReport(cms, true);
            }
        );

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
    '{string} creates an individual lesson report',
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
