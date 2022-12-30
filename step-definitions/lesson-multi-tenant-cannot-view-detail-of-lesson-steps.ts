import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, Tenant } from '@supports/app-types';

import { aliasLessonInfoByLessonName } from 'step-definitions/alias-keys/lesson';
import { invalidLessonLinkMessage } from 'step-definitions/cms-selectors/lesson-management';
import { LessonManagementLessonName } from 'step-definitions/lesson-default-sort-future-lessons-list-definitions';
import { setupAliasForCreateLessonByRoles } from 'step-definitions/lesson-management-utils';
import {
    LessonInfo,
    teacherGoToCourseByURL,
    teacherSeeInvalidURLPageOnTeacherApp,
} from 'step-definitions/lesson-multi-tenant-create-future-and-past-lesson-definitions';
import { goToLessonDetailByLinkWithLessonId } from 'step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import {
    arrayHasItem,
    getCMSInterfaceByRole,
    getTeacherInterfaceFromRole,
} from 'step-definitions/utils';
import { createIndividualLesson } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

When(
    '{string} of {string} creates a {string} online {string} with {string} on CMS',
    async function (
        primaryRole: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName,
        secondaryRole: AccountRoles
    ) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const scenarioContext = this.scenario;

        const setupAliasLesson = setupAliasForCreateLessonByRoles({
            scenarioContext,
            teacherRoles: [secondaryRole],
        });
        const { teacherNames } = setupAliasLesson;

        await cms.instruction(
            `${primaryRole} of ${tenant} creates ${lessonTime} lesson with ${secondaryRole}`,
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
    '{string} of {string} views detail of {string} online {string} by URL on CMS',
    async function (
        accountRole: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, accountRole);
        const { lessonId } = this.scenario.get<LessonInfo>(aliasLessonInfoByLessonName(lessonName));

        await cms.instruction(
            `${accountRole} of ${tenant} views detail of ${lessonTime} online ${lessonName} by URL on CMS`,
            async function () {
                await goToLessonDetailByLinkWithLessonId(cms, lessonId);
            }
        );
    }
);

When(
    '{string} of {string} views detail of {string} online {string} by URL on Teacher App',
    async function (
        accountRole: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const teacher = getTeacherInterfaceFromRole(this, accountRole);

        const { lessonId, studentInfos } = this.scenario.get<LessonInfo>(
            aliasLessonInfoByLessonName(lessonName)
        );

        weExpect(arrayHasItem(studentInfos), `Expect lesson(${lessonId}) has student`).toEqual(
            true
        );

        await teacher.instruction(
            `${accountRole} of ${tenant} views detail of ${lessonTime} online ${lessonName} by URL on Teacher App`,
            async function () {
                for (const student of studentInfos) {
                    // TODO: Refactor to 404 page on CMS
                    // https://manabie.atlassian.net/browse/LT-12329
                    // await teacherGoToLiveLessonDetailByURL(teacher, student.courseId, lessonId);

                    await teacherGoToCourseByURL(teacher, student.courseId);
                }
            }
        );
    }
);

Then(
    '{string} of {string} sees error 404 on CMS',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const cms = getCMSInterfaceByRole(this, accountRole);

        await cms.instruction(
            `${accountRole} of ${tenant} sees error 404 on CMS`,
            async function () {
                // TODO: Refactor to 404 page on CMS
                // https://manabie.atlassian.net/browse/LT-12329
                await cms.page!.waitForSelector(invalidLessonLinkMessage);
            }
        );
    }
);

Then(
    '{string} of {string} sees error 404 on Teacher App',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const teacher = getTeacherInterfaceFromRole(this, accountRole);

        await teacher.instruction(
            `${accountRole} of ${tenant} sees error 404 on Teacher App`,
            async function () {
                await teacherSeeInvalidURLPageOnTeacherApp(teacher);
            }
        );
    }
);
