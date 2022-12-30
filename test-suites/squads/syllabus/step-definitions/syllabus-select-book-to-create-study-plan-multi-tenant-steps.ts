import { getSchoolAdminTenantInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { IMasterWorld, SchoolAdminRolesWithTenant } from '@supports/app-types';

import {
    getBookNameWithTenant,
    schoolAdminCannotSeeBookWhenCreatingSP,
    schoolAdminCanSeeBookWhenCreatingSP,
} from './syllabus-select-book-to-create-study-plan-multi-tenant-definitions';
import {
    schoolAdminClickAddStudyPlanButton,
    schoolAdminIsOnStudyPlanTab,
} from './syllabus-study-plan-common-definitions';

export type BookNameWithTenant = 'book 1a' | 'book 1b' | 'book 2a' | 'book 2b';

Then(
    '{string} can see {string} when creating study plan',
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        bookNameWithTenant: BookNameWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const context = this.scenario;

        const courseId = context.get<string>(
            schoolAdminRole === 'school admin Tenant S1' ? 'course Tenant S1' : 'course Tenant S2'
        );

        const bookName = await getBookNameWithTenant(context, bookNameWithTenant);

        await cms.instruction(
            `${schoolAdminRole} goes to master study plan tab on course ${courseId} detail page`,
            async () => {
                await schoolAdminIsOnStudyPlanTab(cms, courseId, 'master');
            }
        );

        await cms.instruction(
            `${schoolAdminRole} clicks add button on master study plan tab`,
            async (cms) => {
                await schoolAdminClickAddStudyPlanButton(cms);
            }
        );

        await cms.instruction(
            `${schoolAdminRole} can see book ${bookName} in study plan form`,
            async (cms) => {
                await schoolAdminCanSeeBookWhenCreatingSP(cms, bookName);
            }
        );
    }
);

Then(
    '{string} cannot see {string} when creating study plan',
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        bookNameWithTenant: BookNameWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const context = this.scenario;

        const courseId = context.get<string>(
            schoolAdminRole === 'school admin Tenant S1' ? 'course Tenant S1' : 'course Tenant S2'
        );

        const bookName = await getBookNameWithTenant(context, bookNameWithTenant);

        await cms.instruction(
            `School admin goes to master study plan tab on course ${courseId} detail page`,
            async () => {
                await schoolAdminIsOnStudyPlanTab(cms, courseId, 'master');
            }
        );

        await cms.instruction(
            `School admin clicks add button on master study plan tab`,
            async (cms) => {
                await schoolAdminClickAddStudyPlanButton(cms);
            }
        );

        await cms.instruction(
            `School admin cannot see book ${bookName} in study plan form`,
            async (cms) => {
                await schoolAdminCannotSeeBookWhenCreatingSP(cms, bookName);
            }
        );
    }
);
