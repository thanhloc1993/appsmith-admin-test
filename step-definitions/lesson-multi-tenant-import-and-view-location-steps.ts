import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, Locations, Tenant } from '@supports/app-types';

import {
    aliasLocationIdWithTenant,
    aliasLocationNameWithTenant,
} from 'step-definitions/alias-keys/lesson';
import { checkBoxLocation } from 'step-definitions/cms-selectors/cms-keys';
import {
    assertNotSeeLocationInLocationSettingOnTeacherApp,
    assertNotSeeOtherTenantLocationInCourse,
    assertNotSeeOtherTenantLocationInDropDownList,
    assertNotSeeOtherTenantLocationInLocationSettingOnNav,
    assertSeeLocationInLocationSettingOnTeacherApp,
    openCenterDropDownListAndSelectCenterInCreatingLessonPage,
    userImportLocationWithTenant,
    userOpenLocationPopupInCoursePage,
} from 'step-definitions/lesson-multi-tenant-import-and-view-location-definition';
import { checkEqualCenterNameInAutoCompleteInput } from 'step-definitions/lesson-search-center-in-center-field-of-lesson-definitions';
import { schoolAdminOpensLocationSettingsInNavBar } from 'step-definitions/lesson-select-and-view-location-in-location-setting-popup-navbar-definitions';
import { teacherOpenLocationFilterDialogOnTeacherApp } from 'step-definitions/lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { getCMSInterfaceByRole, getTeacherInterfaceFromRole } from 'step-definitions/utils';

Given(
    '{string} of {string} has imported {string}',
    async function (accountRole: AccountRoles, tenant: Tenant, tenantLocation: Locations) {
        const allowListRoles: AccountRoles[] = ['school admin 1', 'school admin 2'];

        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to import Location`);
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${accountRole} of ${tenant} has imported ${tenantLocation}`,
            async function () {
                await userImportLocationWithTenant(cms, scenarioContext, tenant);
            }
        );
    }
);

When(
    '{string} of {string} opens location popup in creating course page on CMS',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = ['school admin 1', 'school admin 2'];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to create course`);
        }

        const cms = getCMSInterfaceByRole(this, accountRole);

        await cms.instruction(
            `${accountRole} of ${tenant} opens location popup in creating course page on CMS`,
            async function () {
                await userOpenLocationPopupInCoursePage(cms);
            }
        );
    }
);

Then(
    '{string} of {string} sees {string} in location popup on CMS',
    async function (accountRole: AccountRoles, tenant: Tenant, tenantLocation: Locations) {
        const allowListRoles: AccountRoles[] = ['school admin 1', 'school admin 2'];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to open location popup`);
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const tenantLocationId = this.scenario.get(aliasLocationIdWithTenant(tenant));

        await cms.instruction(
            `${accountRole} of ${tenant} sees ${tenantLocation} in location popup on CMS`,
            async function () {
                await cms.waitForDataValue(tenantLocationId);
            }
        );
    }
);

Then(
    '{string} of {string} does not see {string} of {string} in location popup on CMS',
    async function (
        accountRole: AccountRoles,
        currentTenant: Tenant,
        otherTenantLocation: Locations,
        otherTenant: Tenant
    ) {
        const allowListRoles: AccountRoles[] = [
            'school admin 1',
            'school admin 2',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to open location popup`);
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const page = cms.page!;
        const otherTenantLocationName = this.scenario.get(aliasLocationNameWithTenant(otherTenant));
        await cms.instruction(
            `${accountRole} of ${currentTenant} does not see ${otherTenantLocation} of ${otherTenant} in location popup on CMS`,
            async function () {
                await assertNotSeeOtherTenantLocationInCourse(page, otherTenantLocationName);
            }
        );
    }
);

When(
    '{string} of {string} opens location setting popup in navigation bar on CMS',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = [
            'school admin 1',
            'school admin 2',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(
                `${accountRole} is not allowed to opens location setting popup in navigation bar`
            );
        }

        const cms = getCMSInterfaceByRole(this, accountRole);

        await cms.instruction(
            `${accountRole} of ${tenant} opens location setting popup in navigation bar on CMS`,
            async function () {
                await schoolAdminOpensLocationSettingsInNavBar(cms);
            }
        );
    }
);

Then(
    '{string} of {string} sees {string} in location setting popup on CMS',
    async function (accountRole: AccountRoles, tenant: Tenant, tenantLocation: Locations) {
        const allowListRoles: AccountRoles[] = [
            'school admin 1',
            'school admin 2',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to open location setting popup`);
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const tenantLocationId = this.scenario.get(aliasLocationIdWithTenant(tenant));

        await cms.instruction(
            `${accountRole} of ${tenant} sees ${tenantLocation} in location setting popup on CMS`,
            async function () {
                await cms.page!.waitForSelector(checkBoxLocation(tenantLocationId));
            }
        );
    }
);

Then(
    '{string} of {string} does not see {string} of {string} in location setting popup on CMS',
    async function (
        accountRole: AccountRoles,
        currentTenant: Tenant,
        otherTenantLocation: Locations,
        otherTenant: Tenant
    ) {
        const allowListRoles: AccountRoles[] = [
            'school admin 1',
            'school admin 2',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to open location setting popup`);
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const page = cms.page!;
        const otherTenantLocationId = this.scenario.get(aliasLocationIdWithTenant(otherTenant));
        await cms.instruction(
            `${accountRole} of ${currentTenant} does not see ${otherTenantLocation} of ${otherTenant} in location setting popup on CMS`,
            async function () {
                await assertNotSeeOtherTenantLocationInLocationSettingOnNav(
                    page,
                    otherTenantLocationId
                );
            }
        );
    }
);

When(
    '{string} of {string} opens center dropdown list in creating lesson page on CMS',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = [
            'school admin 1',
            'school admin 2',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(
                `${accountRole} is not allowed to open center dropdown list in creating lesson page`
            );
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const tenantLocationName = this.scenario.get(aliasLocationNameWithTenant(tenant));

        await cms.instruction(
            `${accountRole} of ${tenant} opens center dropdown list in creating lesson page on CMS`,
            async function () {
                await openCenterDropDownListAndSelectCenterInCreatingLessonPage(
                    cms,
                    tenantLocationName
                );
            }
        );
    }
);

Then(
    '{string} of {string} sees {string} in center dropdown list on CMS',
    async function (accountRole: AccountRoles, tenant: Tenant, tenantLocation: string) {
        const allowListRoles: AccountRoles[] = [
            'school admin 1',
            'school admin 2',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(
                `${accountRole} is not allowed to open center dropdown list in creating lesson page`
            );
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const tenantLocationName = this.scenario.get(aliasLocationNameWithTenant(tenant));

        await cms.instruction(
            `${accountRole} of ${tenant} sees ${tenantLocation} in center dropdown list on CMS`,
            async function () {
                await checkEqualCenterNameInAutoCompleteInput(cms, tenantLocationName);
            }
        );
    }
);

Then(
    '{string} of {string} does not see {string} of {string} in center dropdown list on CMS',
    async function (
        accountRole: AccountRoles,
        currentTenant: Tenant,
        otherTenantLocation: Locations,
        otherTenant: Tenant
    ) {
        const allowListRoles: AccountRoles[] = [
            'school admin 1',
            'school admin 2',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to open in center dropdown list on CMS`);
        }

        const cms = getCMSInterfaceByRole(this, accountRole);
        const otherTenantLocationName = this.scenario.get(aliasLocationNameWithTenant(otherTenant));

        await cms.instruction(
            `${accountRole} of ${currentTenant} does not see ${otherTenantLocation} of ${otherTenant} in center dropdown list on CMS`,
            async function () {
                await assertNotSeeOtherTenantLocationInDropDownList(cms, otherTenantLocationName);
            }
        );
    }
);

When(
    '{string} of {string} opens location setting popup in navigation bar on Teacher App',
    async function (teacherRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];

        if (!allowListRoles.includes(teacherRole)) {
            throw new Error(
                `${teacherRole} is not allowed to opens location setting popup in navigation bar on Teacher App`
            );
        }
        const teacherInterface = getTeacherInterfaceFromRole(this, teacherRole);
        const driver = teacherInterface.flutterDriver!;

        await teacherInterface.instruction(
            `${teacherRole} of ${tenant} opens location setting popup in navigation bar on Teacher App`,
            async function () {
                await driver.reload();
                await teacherOpenLocationFilterDialogOnTeacherApp(teacherInterface);
            }
        );
    }
);

Then(
    '{string} of {string} sees {string} in location setting popup on Teacher App',
    async function (teacherRole: AccountRoles, tenant: Tenant, tenantLocation: string) {
        const allowListRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];

        if (!allowListRoles.includes(teacherRole)) {
            throw new Error(
                `${teacherRole} is not allowed to opens location setting popup in navigation bar on Teacher App`
            );
        }

        const teacherInterface = getTeacherInterfaceFromRole(this, teacherRole);
        const driver = teacherInterface.flutterDriver!;

        const scenarioContext = this.scenario;
        const tenantLocationId = scenarioContext.get(aliasLocationIdWithTenant(tenant));
        const tenantLocationName = scenarioContext.get(aliasLocationNameWithTenant(tenant));

        await teacherInterface.instruction(
            `${teacherRole} of ${tenant} sees ${tenantLocationName} of ${tenantLocation} in location setting popup on Teacher App`,
            async function () {
                await assertSeeLocationInLocationSettingOnTeacherApp(driver, tenantLocationId);
            }
        );
    }
);

Then(
    '{string} of {string} does not see {string} of {string} in location setting popup on Teacher App',
    async function (
        teacherRole: AccountRoles,
        currentTenant: Tenant,
        otherTenantLocation: Locations,
        otherTenant: Tenant
    ) {
        const allowListRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];

        if (!allowListRoles.includes(teacherRole)) {
            throw new Error(
                `${teacherRole} is not allowed to opens location setting popup in navigation bar on Teacher App`
            );
        }

        const teacherInterface = getTeacherInterfaceFromRole(this, teacherRole);
        const scenarioContext = this.scenario;
        const otherTenantLocationId = scenarioContext.get(aliasLocationIdWithTenant(otherTenant));

        await teacherInterface.instruction(
            `${teacherRole} of ${currentTenant} does not see ${otherTenantLocation} of ${otherTenant} in location setting on Teacher App`,
            async function () {
                await assertNotSeeLocationInLocationSettingOnTeacherApp(
                    scenarioContext,
                    currentTenant,
                    otherTenantLocationId
                );
            }
        );
    }
);
