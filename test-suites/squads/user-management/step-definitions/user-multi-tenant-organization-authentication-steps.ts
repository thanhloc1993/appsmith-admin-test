import { aSchoolAdminAlreadyLoginSuccessInCMS } from '@legacy-step-definitions/school-admin-email-login-definitions';
import { getAppInterface } from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    MultiTenantAccountType,
    Platform,
    TeacherInterface,
    SchoolAdminRolesWithTenant,
    Tenant,
} from '@supports/app-types';

import {
    aSchoolAdminLoginAsTenantInCMS,
    schoolAdminTenantRegisterFirstGrantedLocation,
    schoolAdminVerifiesStaffListWithResourcePath,
    schoolAdminVerifiesStudentsListWithResourcePath,
} from './user-multi-tenant-authentication-definitions';
import { schoolAdminLogoutCMS } from './user-multi-tenant-create-staff-definitions';
import {
    parentLoginsLearnerAppSuccessfully,
    schoolAdminCreateANewStudentWithTenantGRPC,
    schoolAdminCreateANewStaffWithTenantGRPC,
    schoolAdminLoginsCMSFailed,
    schoolAdminLoginsWithoutTenant,
    schoolAdminSwitchBetweenTenants,
    studentLoginsLearnerAppSuccessfully,
    staffLoginsTeacherAppFailed,
    staffLoginsTeacherAppSuccessfully,
    staffLoginsWithoutTenant,
    staffLoginsWithTenant,
    staffLoginsWithTenantOnTeacherApp,
    staffSwitchBetweenTenants,
    userLoginsLearnerAppFailed,
    userLoginsLearnerAppWithoutTenant,
    userLoginsLearnerAppWithTenant,
    userSwitchBetweenTenants,
} from './user-multi-tenant-organization-authentication-definitions';

Given(
    'school admin {string} creates a new {string}',
    async function (this: IMasterWorld, tenant: Tenant, accountType: MultiTenantAccountType) {
        const cms = this.cms!;
        const scenarioContext = this.scenario;
        await cms.instruction(`School admin logins CMS with tenant: ${tenant}`, async () => {
            await aSchoolAdminLoginAsTenantInCMS({
                masterWorld: this,
                role: `school admin ${tenant}`,
                shouldUseCmsInterfaceAsDefault: true,
            });
        });

        await schoolAdminTenantRegisterFirstGrantedLocation(this, `school admin ${tenant}`, true);

        switch (accountType) {
            case 'student':
                await schoolAdminCreateANewStudentWithTenantGRPC({
                    cms,
                    context: scenarioContext,
                    tenant,
                });
                break;
            case 'parent':
                await schoolAdminCreateANewStudentWithTenantGRPC({
                    cms,
                    context: scenarioContext,
                    tenant,
                    parentLength: 1,
                });
                break;
            case 'teacher':
                await schoolAdminCreateANewStaffWithTenantGRPC({
                    cms,
                    context: scenarioContext,
                    tenant,
                });
                break;
            default:
                break;
        }

        await cms.instruction('School admin logout CMS', async () => {
            await schoolAdminLogoutCMS(cms);
        });
    }
);

// This step create new account when CMS already login
Given(
    'school admin {string} creates a new {string} with tenant on CMS',
    async function (this: IMasterWorld, tenant: Tenant, accountType: MultiTenantAccountType) {
        const cms = getAppInterface(this, 'school admin', tenant) as CMSInterface;
        const scenarioContext = this.scenario;

        switch (accountType) {
            case 'student':
                await schoolAdminCreateANewStudentWithTenantGRPC({
                    cms,
                    context: scenarioContext,
                    tenant,
                });
                break;
            case 'parent':
                await schoolAdminCreateANewStudentWithTenantGRPC({
                    cms,
                    context: scenarioContext,
                    tenant,
                    parentLength: 1,
                });
                break;
            case 'teacher':
                await schoolAdminCreateANewStaffWithTenantGRPC({
                    cms,
                    context: scenarioContext,
                    tenant,
                });
                break;
            default:
                break;
        }
    }
);

When(
    '{string} {string} logins with tenant on {string}',
    async function (
        this: IMasterWorld,
        accountType: MultiTenantAccountType,
        tenant: Tenant,
        platform: Platform
    ) {
        switch (accountType) {
            case 'school admin': {
                const cms = this.cms!;
                await cms.instruction(
                    `School admin logins CMS with tenant: ${tenant}`,
                    async () => {
                        await aSchoolAdminLoginAsTenantInCMS({
                            masterWorld: this,
                            role: `school admin ${tenant}`,
                            shouldUseCmsInterfaceAsDefault: true,
                        });

                        await schoolAdminTenantRegisterFirstGrantedLocation(
                            this,
                            `school admin ${tenant}`,
                            true
                        );
                    }
                );
                break;
            }
            case 'student':
            case 'parent':
                await userLoginsLearnerAppWithTenant({
                    masterWorld: this,
                    accountType,
                    tenant,
                });
                break;
            case 'teacher':
                await staffLoginsWithTenant({
                    masterWorld: this,
                    platform,
                    tenant,
                });
                break;
            default:
                break;
        }
    }
);

Given(
    'Teacher of tenant {string} login on Teacher App',
    async function (this: IMasterWorld, tenant: Tenant) {
        const teacher = getAppInterface(this, 'teacher', tenant) as TeacherInterface;

        await teacher.instruction(`Teacher logins Teacher App with tenant: ${tenant}`, async () => {
            await staffLoginsWithTenantOnTeacherApp({
                tenant: tenant,
                masterWorld: this,
            });
        });
    }
);

When(
    '{string} {string} switch to {string} on {string}',
    async function (
        this: IMasterWorld,
        accountType: MultiTenantAccountType,
        currentTenant: Tenant,
        nextTenant: Tenant,
        platform: Platform
    ) {
        switch (accountType) {
            case 'school admin':
                await schoolAdminSwitchBetweenTenants(this, currentTenant, nextTenant);
                break;
            case 'student':
            case 'parent':
                await userSwitchBetweenTenants({
                    masterWorld: this,
                    userType: accountType,
                    currentTenant,
                    nextTenant,
                });
                break;
            case 'teacher':
                await staffSwitchBetweenTenants({
                    masterWorld: this,
                    platform,
                    currentTenant,
                    nextTenant,
                });
                break;
            default:
                break;
        }
    }
);

When(
    '{string} {string} logins without tenant identifier on {string}',
    async function (
        this: IMasterWorld,
        accountType: MultiTenantAccountType,
        tenant: Tenant,
        platform: Platform
    ) {
        switch (accountType) {
            case 'school admin':
                await schoolAdminLoginsWithoutTenant(this, tenant);
                break;
            case 'student':
            case 'parent':
                await userLoginsLearnerAppWithoutTenant(this, accountType);
                break;
            case 'teacher':
                await staffLoginsWithoutTenant({
                    masterWorld: this,
                    platform,
                    tenant,
                });
                break;
            default:
                break;
        }
    }
);

Then(
    '{string} {string} logins {string} successfully',
    async function (
        this: IMasterWorld,
        accountType: MultiTenantAccountType,
        tenant: Tenant,
        platform: Platform
    ) {
        switch (accountType) {
            case 'school admin': {
                const cms = this.cms!;

                await cms.instruction(
                    'Logged in, see home page',
                    async function (cms: CMSInterface) {
                        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
                    }
                );
                break;
            }
            case 'student':
                await studentLoginsLearnerAppSuccessfully(this, tenant);
                break;
            case 'parent':
                await parentLoginsLearnerAppSuccessfully(this, tenant);
                break;
            case 'teacher':
                await staffLoginsTeacherAppSuccessfully(this, platform, tenant);
                break;
            default:
                break;
        }
    }
);

Then(
    '{string} {string} can not login on {string}',
    async function (
        this: IMasterWorld,
        accountType: MultiTenantAccountType,
        tenant: Tenant,
        platform: Platform
    ) {
        switch (accountType) {
            case 'school admin':
                await schoolAdminLoginsCMSFailed(this, tenant);
                break;
            case 'student':
            case 'parent':
                await userLoginsLearnerAppFailed(this);
                break;
            case 'teacher':
                await staffLoginsTeacherAppFailed(this, platform, tenant);
                break;
            default:
                break;
        }
    }
);

Then(
    '{string} sees student list and staff list display correctly',
    async function (this: IMasterWorld, accountRoles: SchoolAdminRolesWithTenant) {
        const cms = this.cms!;

        await cms.instruction(`${accountRoles} sees student list display correctly`, async () => {
            await schoolAdminVerifiesStudentsListWithResourcePath(cms);
        });

        await cms.instruction(`${accountRoles} sees staff list display correctly`, async () => {
            await schoolAdminVerifiesStaffListWithResourcePath(cms);
        });
    }
);
