import { Then, When } from '@cucumber/cucumber';

import { SchoolAdminRolesWithTenant, CMSInterface, IMasterWorld } from '@supports/app-types';

import {
    aliasBookName,
    aliasBookNameTenantS1,
    aliasBookNameTenantS2,
    aliasBookUrlTenantS1,
    aliasBookUrlTenantS2,
    aliasRandomStudyPlanItemsTenantS1,
    aliasRandomStudyPlanItemsTenantS2,
    aliasRandomStudyPlanItemUrlsTenantS1,
    aliasRandomStudyPlanItemUrlsTenantS2,
} from './alias-keys/syllabus';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import { schoolAdminGoesToLODetailsPage } from './syllabus-create-question-definitions';
import {
    schoolAdminDoesNotSeeBookContent,
    schoolAdminDoesNotSeeBookInBookList,
    schoolAdminDuplicateBook,
    schoolAdminSeesBookInBookList,
} from './syllabus-duplicate-book-multi-tenant-definitions';
import {
    Assignment,
    isAssignment,
    LearningObjective,
    StudyPlanItem,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    `{string} duplicates {string} to {string}`,
    async function (
        this: IMasterWorld,
        role: SchoolAdminRolesWithTenant,
        bookName: string,
        duplicatedBookName: string
    ) {
        const cms = role == 'school admin Tenant S1' ? this.cms : this.cms2;
        const context = this.scenario;
        const tenantBookName = context.get<string>(
            role == 'school admin Tenant S1' ? aliasBookNameTenantS1 : aliasBookNameTenantS2
        );

        await cms.instruction(
            `${role} chooses book ${bookName} in book list`,
            async function (cms: CMSInterface) {
                context.set(aliasBookName, tenantBookName);
                await schoolAdminIsOnBookDetailsPage(cms, context);
            }
        );

        await cms.instruction(
            `${role} duplicates ${bookName} to ${duplicatedBookName}`,
            async (cms: CMSInterface) => {
                await schoolAdminDuplicateBook(cms);
            }
        );
    }
);

Then(
    `{string} sees {string}`,
    async function (
        this: IMasterWorld,
        role: SchoolAdminRolesWithTenant,
        duplicatedBookName: string
    ) {
        const cms = role == 'school admin Tenant S1' ? this.cms : this.cms2;
        const context = this.scenario;
        const tenantBookName = context.get<string>(
            role == 'school admin Tenant S1' ? aliasBookNameTenantS1 : aliasBookNameTenantS2
        );

        await cms.instruction(
            `${role} sees ${duplicatedBookName} in book list`,
            async function (cms: CMSInterface) {
                await schoolAdminSeesBookInBookList(cms, tenantBookName);
            }
        );

        await cms.instruction(
            `${role} chooses book ${duplicatedBookName} in book list`,
            async function (cms: CMSInterface) {
                context.set(aliasBookName, `Duplicate - ${tenantBookName}`);
                await schoolAdminIsOnBookDetailsPage(cms, context);
            }
        );
        context.set(
            role == 'school admin Tenant S1' ? aliasBookUrlTenantS1 : aliasBookUrlTenantS2,
            cms.page!.url()
        );

        const studyPlanItems = context.get<StudyPlanItem[]>(
            role == 'school admin Tenant S1'
                ? aliasRandomStudyPlanItemsTenantS1
                : aliasRandomStudyPlanItemsTenantS2
        );
        const loUrls: string[] = [];
        for (const studyPlanItem of studyPlanItems) {
            let studyPlanItemName: string;
            if (isAssignment(studyPlanItem)) {
                const assignment = studyPlanItem as Assignment;
                studyPlanItemName = assignment.name;
            } else {
                const lo = studyPlanItem as LearningObjective;
                studyPlanItemName = lo.info.name;
            }
            await cms.instruction(
                `${role} goes to ${studyPlanItemName}`,
                async function (cms: CMSInterface) {
                    await schoolAdminGoesToLODetailsPage(cms, studyPlanItemName);
                    loUrls.push(cms.page!.url());
                    await cms.page!.goBack({ waitUntil: 'networkidle' });
                }
            );
        }
        context.set(
            role == 'school admin Tenant S1'
                ? aliasRandomStudyPlanItemUrlsTenantS1
                : aliasRandomStudyPlanItemUrlsTenantS2,
            loUrls
        );
    }
);

Then(
    `{string} doesn't see {string}`,
    async function (
        this: IMasterWorld,
        role: SchoolAdminRolesWithTenant,
        otherTenantDuplicatedBookName: string
    ) {
        const cms = role == 'school admin Tenant S1' ? this.cms : this.cms2;
        const context = this.scenario;
        const tenantBookName = context.get<string>(
            role == 'school admin Tenant S1' ? aliasBookNameTenantS2 : aliasBookNameTenantS1
        );

        await cms.instruction(
            `School admin doesn't see ${otherTenantDuplicatedBookName} in book list`,
            async function (cms: CMSInterface) {
                await schoolAdminDoesNotSeeBookInBookList(cms, `Duplicate - ${tenantBookName}`);
            }
        );
    }
);

Then(
    `{string} sees 404 error page when access {string} by url`,
    async function (
        this: IMasterWorld,
        role: SchoolAdminRolesWithTenant,
        otherTenantDuplicatedBookName: string
    ) {
        const cms = role == 'school admin Tenant S1' ? this.cms : this.cms2;
        const context = this.scenario;
        const url = context.get<string>(
            role == 'school admin Tenant S1' ? aliasBookUrlTenantS2 : aliasBookUrlTenantS1
        );

        await cms.instruction(
            `${role} sees 404 error page when access ${otherTenantDuplicatedBookName} url`,
            async function (cms: CMSInterface) {
                await cms.page!.goto(url, { waitUntil: 'networkidle' });
                await schoolAdminDoesNotSeeBookContent(cms);
            }
        );
    }
);

Then(
    `{string} sees 404 error page when access {string} content by url`,
    async function (
        this: IMasterWorld,
        role: SchoolAdminRolesWithTenant,
        otherTenantDuplicatedBookName: string
    ) {
        const cms = role == 'school admin Tenant S1' ? this.cms : this.cms2;
        const context = this.scenario;
        const urls = context.get<string[]>(
            role == 'school admin Tenant S1'
                ? aliasRandomStudyPlanItemUrlsTenantS2
                : aliasRandomStudyPlanItemUrlsTenantS1
        );
        for (const url of urls) {
            await cms.instruction(
                `${role} sees 404 error page when access ${otherTenantDuplicatedBookName} url`,
                async function (cms: CMSInterface) {
                    await cms.page!.goto(url, { waitUntil: 'networkidle' });
                    await schoolAdminDoesNotSeeBookContent(cms);
                }
            );
        }
    }
);
