import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, Tenant } from '@supports/app-types';

import { aliasCourseNameByCoursePrefix } from './alias-keys/lesson';
import { LocationLevel } from './lesson-create-course-with-teaching-method-definitions';
import {
    checkCourseNameIsOnTeacherApp,
    createCourseWithOptionalLocation,
    viewDetailCourseByURL,
    checkCourseDetailVisibility,
    viewDetailCourseOnTeacherApp,
    checkCourseDetailVisibilityOnTeacherApp,
    checkCourseNameIsOnPage,
} from './lesson-multi-tenant-create-course-definitions';
import { getCMSInterfaceByRole, getRandomNumber, getTeacherInterfaceFromRole } from './utils';

When(
    '{string} of {string} creates a {string} without location on CMS',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const scenario = this.scenario;

        const courseName = `${prefixCourseName} ${getRandomNumber()}`;
        scenario.set(aliasCourseNameByCoursePrefix(prefixCourseName), courseName);

        await cms.instruction(
            `${primaryRole} of ${tenant} creates a course C1 without location on CMS`,
            async function () {
                await createCourseWithOptionalLocation(cms, primaryRole, scenario, courseName);
            }
        );
    }
);

Then(
    '{string} of {string} sees newly {string} on CMS',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const courseName = this.scenario.get<string>(
            aliasCourseNameByCoursePrefix(prefixCourseName)
        );

        await cms.instruction(
            `${primaryRole} of ${tenant} sees newly ${courseName} on CMS`,
            async function () {
                await checkCourseNameIsOnPage(cms, courseName, true);
            }
        );
    }
);

Then(
    '{string} of {string} does not see newly {string} on CMS',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const courseName = this.scenario.get<string>(
            aliasCourseNameByCoursePrefix(prefixCourseName)
        );

        await cms.instruction(
            `${primaryRole} of ${tenant} does not see newly ${courseName} on CMS`,
            async function () {
                await checkCourseNameIsOnPage(cms, courseName, false);
            }
        );
    }
);

Then(
    '{string} of {string} sees newly {string} on Teacher App',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const teacher = getTeacherInterfaceFromRole(this, primaryRole);
        const courseName = this.scenario.get<string>(
            aliasCourseNameByCoursePrefix(prefixCourseName)
        );

        await teacher.instruction(
            `${primaryRole} of ${tenant} sees newly ${courseName} on Teacher App`,
            async function () {
                await checkCourseNameIsOnTeacherApp(teacher, courseName, true);
            }
        );
    }
);

Then(
    '{string} of {string} does not see newly {string} on Teacher App',
    { timeout: 90000 },
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const teacher = getTeacherInterfaceFromRole(this, primaryRole);
        const courseName = this.scenario.get<string>(
            aliasCourseNameByCoursePrefix(prefixCourseName)
        );

        await teacher.instruction(
            `${primaryRole} of ${tenant} does not see newly ${courseName} on Teacher App`,
            async function () {
                await checkCourseNameIsOnTeacherApp(teacher, courseName, false);
            }
        );
    }
);

When(
    '{string} of {string} views detail of {string} by URL on CMS',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const scenario = this.scenario;
        const courseName = scenario.get<string>(aliasCourseNameByCoursePrefix(prefixCourseName));

        await cms.instruction(
            `${primaryRole} of ${tenant} views detail of ${courseName} by URL`,
            async function () {
                await viewDetailCourseByURL(cms, scenario, courseName);
            }
        );
    }
);

Then(
    '{string} of {string} does not see detail of {string}',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const scenario = this.scenario;
        const courseName = scenario.get<string>(aliasCourseNameByCoursePrefix(prefixCourseName));

        await cms.instruction(
            `${primaryRole} of ${tenant} does not see detail of ${courseName}`,
            async function () {
                await checkCourseDetailVisibility(cms, courseName);
            }
        );
    }
);

When(
    '{string} of {string} views detail of {string} by URL on Teacher App',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const teacher = getTeacherInterfaceFromRole(this, primaryRole);
        const scenario = this.scenario;
        const courseName = scenario.get<string>(aliasCourseNameByCoursePrefix(prefixCourseName));

        await teacher.instruction(
            `${primaryRole} of ${tenant} views detail of ${courseName} by URL on Teacher App`,
            async function () {
                await viewDetailCourseOnTeacherApp(teacher, scenario, courseName);
            }
        );
    }
);

Then(
    '{string} of {string} does not see detail of {string} on Teacher App',
    async function (primaryRole: AccountRoles, tenant: Tenant, prefixCourseName: string) {
        const teacher = getTeacherInterfaceFromRole(this, primaryRole);
        const scenario = this.scenario;
        const courseName = scenario.get<string>(aliasCourseNameByCoursePrefix(prefixCourseName));

        await teacher.instruction(
            `${primaryRole} of ${tenant} does not see detail of ${courseName} on Teacher App`,
            async function () {
                await checkCourseDetailVisibilityOnTeacherApp(teacher);
            }
        );
    }
);

When(
    '{string} of {string} creates a {string} with {string} on CMS',
    async function (
        primaryRole: AccountRoles,
        tenant: Tenant,
        prefixCourseName: string,
        locationLevel: LocationLevel
    ) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const scenario = this.scenario;
        const courseName = `${prefixCourseName} ${getRandomNumber()}`;
        scenario.set(aliasCourseNameByCoursePrefix(prefixCourseName), courseName);

        await cms.instruction(
            `${primaryRole} of ${tenant} creates a ${courseName} with ${locationLevel} on CMS`,
            async function () {
                await createCourseWithOptionalLocation(
                    cms,
                    primaryRole,
                    scenario,
                    courseName,
                    locationLevel
                );
            }
        );
    }
);
