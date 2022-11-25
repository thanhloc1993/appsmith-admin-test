import { getAppInterface } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithTenantAccountRoleSuffix } from '@user-common/alias-keys/user';

import { When, Then } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld, Tenant } from '@supports/app-types';
import { MappedLearnerProfile } from '@supports/entities/user-profile-entity';

import { searchStudentOnCMS, seeEmptyResultListOnCMS } from './user-definition-utils';

When(
    'school admin {string} searches for name of student {string}',
    async function (this: IMasterWorld, adminTenant: Tenant, studentTenant: Tenant) {
        const cms = getAppInterface(this, 'school admin', adminTenant) as CMSInterface;

        const profile = this.scenario.get<MappedLearnerProfile>(
            learnerProfileAliasWithTenantAccountRoleSuffix(`school admin ${studentTenant}`)
        );
        await searchStudentOnCMS(cms, profile.name);
    }
);

Then(
    'no result page is displayed on {string} CMS',
    async function (this: IMasterWorld, tenant: Tenant) {
        const cms = getAppInterface(this, 'school admin', tenant) as CMSInterface;

        await seeEmptyResultListOnCMS(cms);
    }
);
