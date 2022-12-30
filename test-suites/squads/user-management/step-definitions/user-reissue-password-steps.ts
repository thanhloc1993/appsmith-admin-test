import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import {
    learnerProfileAlias,
    learnerProfileAliasWithTenantAccountRoleSuffix,
    parentProfilesAlias,
    parentProfilesAliasWithTenantAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { DialogButtonType, LocationObjectGRPC, UserType } from '@supports/types/cms-types';

import { createARandomStudentGRPC } from './user-create-student-definitions';
import {
    schoolAdminGoesToStudentDetailPage,
    userAuthenticationMultiTenant,
} from './user-definition-utils';
import {
    userPasswordIsReissued,
    userLoginLeanerAppWithPasswordType,
    schoolAdminReIssuePassword,
} from './user-reissue-password-definitions';

Given(
    'school admin has created 1 student with student info and parent info',
    async function (this: IMasterWorld) {
        const self = this;

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        const learnerAlias = isEnabledMultiTenantLogin
            ? learnerProfileAliasWithTenantAccountRoleSuffix(`school admin Tenant S1`)
            : learnerProfileAlias;
        const parentAlias = isEnabledMultiTenantLogin
            ? parentProfilesAliasWithTenantAccountRoleSuffix(`school admin Tenant S1`)
            : parentProfilesAlias;

        await this.cms.instruction(
            'School admin creates a student with student info and parent info by gRPC',
            async function () {
                const firstGrantedLocation =
                    self.scenario.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

                const response = await createARandomStudentGRPC(self.cms, {
                    locations: [firstGrantedLocation],
                });

                self.scenario.set(learnerAlias, response.student);

                self.scenario.set(parentAlias, response.parents);
            }
        );
    }
);

When(
    'school admin reissues {string} password',
    async function (this: IMasterWorld, userType: UserType) {
        const cms = this.cms!;
        const scenarioContext = this.scenario;

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        const learnerAlias = isEnabledMultiTenantLogin
            ? learnerProfileAliasWithTenantAccountRoleSuffix(`school admin Tenant S1`)
            : learnerProfileAlias;

        const student = scenarioContext.get<UserProfileEntity>(learnerAlias);
        await schoolAdminGoesToStudentDetailPage(cms, student, true);
        await schoolAdminReIssuePassword(cms, userType);
    }
);

Then('{string} password is reissued', async function (this: IMasterWorld, userType: UserType) {
    const self = this;
    await this.cms.instruction('Assert reissue user password successfully', async function () {
        await userPasswordIsReissued(self, userType);
    });
});

Then(
    '{string} logins failed with old username and old password',
    async function (this: IMasterWorld, userType: UserType) {
        const self = this;

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        /// Have instructions inside
        await userLoginLeanerAppWithPasswordType({
            world: self,
            userType,
            shouldLoginSuccess: false,
            tenant: isEnabledMultiTenantLogin ? 'Tenant S1' : undefined,
            passwordType: 'old password',
        });
    }
);

Then(
    '{string} logins successfully with old username and new password',
    async function (this: IMasterWorld, userType: UserType) {
        const self = this;

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        /// Have instructions inside
        await userLoginLeanerAppWithPasswordType({
            world: self,
            userType,
            shouldLoginSuccess: true,
            tenant: isEnabledMultiTenantLogin ? 'Tenant S1' : undefined,
            passwordType: 'new password',
        });
    }
);

When(
    'school admin {string} reissue password',
    async function (this: IMasterWorld, buttonType: DialogButtonType) {
        const cms = this.cms!;

        await cms.selectAButtonByAriaLabel(buttonType === 'confirm' ? 'Confirm' : 'Cancel');
    }
);

Then(
    'the account {string} does not reissue password',
    async function (this: IMasterWorld, userType: UserType) {
        const self = this;

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        /// Have instructions inside
        await userLoginLeanerAppWithPasswordType({
            world: self,
            userType,
            shouldLoginSuccess: true,
            tenant: isEnabledMultiTenantLogin ? 'Tenant S1' : undefined,
            passwordType: 'old password',
        });
    }
);
