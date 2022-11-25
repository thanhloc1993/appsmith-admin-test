import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, Tenant } from '@supports/app-types';

import { aliasLessonInfoByLessonName } from './alias-keys/lesson';
import { LessonReportStatusTag } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { LessonManagementLessonName } from 'step-definitions/lesson-default-sort-future-lessons-list-definitions';
import { setupAliasForCreateLessonByRoles } from 'step-definitions/lesson-management-utils';
import { LessonInfo } from 'step-definitions/lesson-multi-tenant-create-future-and-past-lesson-definitions';
import {
    assertNotSeeIndividualLessonReport,
    assertSeeIndividualLessonReport,
    getFirstStudentOfLesson,
    saveDraftIndividualLessonReport,
    submitIndividualLessonReport,
} from 'step-definitions/lesson-multi-tenant-submit-and-save-draft-lesson-report-definitions';
import { getCMSInterfaceByRole } from 'step-definitions/utils';
import { createIndividualLesson } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

Given(
    '{string} of {string} has created a {string} online {string} with {string} on CMS',
    async function (
        accountRole: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName,
        teacherRole: AccountRoles
    ) {
        const cms = getCMSInterfaceByRole(this, accountRole);
        const scenarioContext = this.scenario;

        const { teacherNames } = setupAliasForCreateLessonByRoles({
            scenarioContext,
            teacherRoles: [teacherRole],
        });

        await cms.instruction(
            `${accountRole} of ${tenant} has created a ${lessonTime} online ${lessonName} with ${teacherRole} on CMS`,
            async function () {
                await createIndividualLesson({
                    cms,
                    scenarioContext,
                    tenant,
                    lessonTime,
                    lessonName,
                    teacherNames,
                });
            }
        );
    }
);

When(
    '{string} of {string} submits individual lesson report for {string} online {string} on CMS',
    async function (
        accountRole: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, accountRole);
        const context = this.scenario;
        const { lessonId } = context.get<LessonInfo>(aliasLessonInfoByLessonName(lessonName));

        await cms.instruction(
            `${accountRole} of ${tenant} submits individual lesson report for ${lessonTime} online ${lessonName} on CMS`,
            async function () {
                await submitIndividualLessonReport(cms, lessonId);
            }
        );
    }
);

Then(
    '{string} of {string} sees {string} lesson report of {string} online {string} on CMS',
    async function (
        accountRole: AccountRoles,
        tenant: Tenant,
        lessonReportStatus: LessonReportStatusTag,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, accountRole);
        const scenarioContext = this.scenario;
        const firstStudent = await getFirstStudentOfLesson(scenarioContext, lessonName);
        const { lessonId } = scenarioContext.get<LessonInfo>(
            aliasLessonInfoByLessonName(lessonName)
        );
        await cms.instruction(
            `${accountRole} of ${tenant} sees ${lessonReportStatus} lesson report of ${lessonTime} online ${lessonName} on CMS`,
            async function () {
                await assertSeeIndividualLessonReport(
                    cms,
                    accountRole,
                    lessonTime,
                    lessonId,
                    firstStudent!.studentName
                );
            }
        );
    }
);

Then(
    '{string} of {string} does not see {string} lesson report of {string} online {string} on CMS',
    async function (
        accountRole: AccountRoles,
        tenant: Tenant,
        lessonReportStatus: LessonReportStatusTag,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, accountRole);
        const scenarioContext = this.scenario;
        const firstStudent = await getFirstStudentOfLesson(scenarioContext, lessonName);

        await cms.instruction(
            `${accountRole} of ${tenant} does not sees ${lessonReportStatus} lesson report of ${lessonTime} online ${lessonName} on CMS`,
            async function () {
                await assertNotSeeIndividualLessonReport(
                    cms,
                    lessonTime,
                    firstStudent!.studentName
                );
            }
        );
    }
);

When(
    '{string} of {string} saves draft individual lesson report for {string} online {string} on CMS',
    async function (
        accountRole: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, accountRole);
        const scenarioContext = this.scenario;
        const { lessonId } = scenarioContext.get<LessonInfo>(
            aliasLessonInfoByLessonName(lessonName)
        );

        await cms.instruction(
            `${accountRole} of ${tenant} saves draft individual lesson report for ${lessonTime} online ${lessonName} on CMS`,
            async function () {
                await saveDraftIndividualLessonReport(cms, lessonId);
            }
        );
    }
);
