import { getAppInterface } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithMultiTenantAccountRoleSuffix } from '@user-common/alias-keys/user';

import { When, Then } from '@cucumber/cucumber';

import {
    AccountAction,
    CMSInterface,
    IMasterWorld,
    LoginStatus,
    TeacherInterface,
    Tenant,
} from '@supports/app-types';

import { forgotPasswordStaff, schoolAdminSeesNewStaffInCMS } from './user-create-staff-definitions';
import { getSchoolAdminAccount } from './user-multi-tenant-authentication-definitions';
import {
    schoolAdminLogoutCMS,
    staffLoginsCMS,
    staffLoginsTeacherAppFailed,
    staffLoginsTeacherAppSuccessfully,
    tenantSchoolAdminCreateNewStaff,
    tenantSchoolAdminDoesNotSeeNewStaffInCMS,
} from './user-multi-tenant-create-staff-definitions';

When(
    'school admin {string} creates a staff on {string}',
    async function (this: IMasterWorld, tenant: Tenant, tenantInterface: Tenant) {
        const cms = tenantInterface === 'Tenant S2' ? this.cms2! : this.cms!;
        const context = this.scenario;

        await cms.instruction('School admin create staff', async () => {
            await tenantSchoolAdminCreateNewStaff(cms, context, tenant);
        });
    }
);

Then(
    'school admin {string} {string} newly created staff {string} on CMS',
    async function (
        this: IMasterWorld,
        schoolAdminTenant: Tenant,
        action: AccountAction,
        staffTenant: Tenant
    ) {
        const appInterface = getAppInterface(
            this,
            'school admin',
            schoolAdminTenant
        ) as CMSInterface;
        const context = this.scenario;

        const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(
            `school admin ${staffTenant}`
        );

        if (action === 'sees') {
            await appInterface.instruction(
                'Go to the list staff page and see new staff',
                async function (this: CMSInterface) {
                    await schoolAdminSeesNewStaffInCMS(this, context, staffAlias);
                }
            );
        } else {
            await appInterface.instruction(
                'Go to the list staff page and not see new staff',
                async function (this: CMSInterface) {
                    await tenantSchoolAdminDoesNotSeeNewStaffInCMS(this, context, staffTenant);
                }
            );
        }
    }
);

Then(
    'staff {string} logins CMS {string} with {string}',
    async function (this: IMasterWorld, staffTenant: Tenant, status: LoginStatus, tenant: Tenant) {
        const cms = getAppInterface(this, 'school admin', staffTenant) as CMSInterface;
        const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(
            `school admin ${staffTenant}`
        );
        const { context } = this.scenario;
        const { organization } = getSchoolAdminAccount({
            schoolName: `school admin ${tenant}`,
        });

        if (status === 'failed') {
            await cms.instruction('school admin logout CMS', async function (cms: CMSInterface) {
                await schoolAdminLogoutCMS(cms);
            });
        }

        await cms.instruction(`staff logins CMS ${status}`, async function (cms: CMSInterface) {
            await staffLoginsCMS({
                cms,
                context,
                staffAlias,
                organization,
                status,
            });
        });
    }
);

Then(
    'staff {string} logins Teacher App {string} after forgot password with credentials of {string}',
    async function (this: IMasterWorld, staffTenant: Tenant, status: LoginStatus, tenant: Tenant) {
        const cms = getAppInterface(this, 'school admin', staffTenant) as CMSInterface;
        const teacher = getAppInterface(this, 'teacher', tenant) as TeacherInterface;
        const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(
            `school admin ${staffTenant}`
        );
        const context = this.scenario;
        const { organization } = getSchoolAdminAccount({
            schoolName: `school admin ${tenant}`,
        });

        await cms.instruction('Forget password staff account', async function (this: CMSInterface) {
            await forgotPasswordStaff(
                this,
                context,
                staffProfileAliasWithMultiTenantAccountRoleSuffix(`school admin ${staffTenant}`)
            );
        });

        if (status === 'successfully') {
            await staffLoginsTeacherAppSuccessfully({
                teacher,
                context,
                staffAlias,
                organization,
            });
        } else {
            await staffLoginsTeacherAppFailed({
                teacher,
                context,
                staffAlias,
                organization,
            });
        }
    }
);
