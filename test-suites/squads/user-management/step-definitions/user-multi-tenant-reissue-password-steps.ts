import { aliasFirstGrantedLocationWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { IMasterWorld, LoginStatus, Tenant } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { LocationObjectGRPC, UserType } from '@supports/types/cms-types';

import { createARandomStudentGRPC } from './user-create-student-definitions';
import {
    getUserProfileWithTennantFromContext,
    schoolAdminGoesToStudentDetailPage,
    setUserProfileWithTennantToContext,
    userAuthenticationMultiTenant,
} from './user-definition-utils';
import {
    schoolAdminReIssuePassword,
    userLoginLeanerAppWithPasswordType,
} from './user-reissue-password-definitions';

Given(
    'school admin {string} has created a student with student info and parent info',
    async function (this: IMasterWorld, tenant: Tenant) {
        const cms = this.cms!;
        const scenarioContext = this.scenario;

        await cms.instruction(
            `School admin ${tenant} creates a student with student info and parent info by gRPC`,
            async function () {
                const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(
                    aliasFirstGrantedLocationWithAccountRoleSuffix(`school admin ${tenant}`)
                );
                const response = await createARandomStudentGRPC(cms, {
                    locations: [firstGrantedLocation],
                });

                setUserProfileWithTennantToContext({
                    context: scenarioContext,
                    accountType: 'student',
                    data: response.student,
                    tenant,
                });

                setUserProfileWithTennantToContext({
                    context: scenarioContext,
                    accountType: 'parent',
                    data: response.parents,
                    tenant,
                });
            }
        );
    }
);

When(
    'school admin {string} reissues {string} password',
    async function (this: IMasterWorld, tenant: Tenant, userType: UserType) {
        const cms = this.cms!;
        const scenarioContext = this.scenario;

        const student = getUserProfileWithTennantFromContext<UserProfileEntity>({
            context: scenarioContext,
            accountType: 'student',
            tenant,
        });

        await schoolAdminGoesToStudentDetailPage(cms, student);
        await schoolAdminReIssuePassword(cms, userType);
    }
);

Then(
    '{string} logins {string} with old username, {string} and organization {string}',
    async function (
        this: IMasterWorld,
        userType: UserType,
        status: LoginStatus,
        passwordType: 'old password' | 'new password',
        tenant: Tenant
    ) {
        const user = userType === UserType.STUDENT ? this.learner! : this.parent!;
        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );
        await user.instruction(
            `Fill email, old password, organization of ${tenant} and press login button`,
            async () => {
                await userLoginLeanerAppWithPasswordType({
                    world: this,
                    userType,
                    shouldLoginSuccess: status === 'successfully',
                    tenant: isEnabledMultiTenantLogin ? tenant : undefined,
                    passwordType,
                });
            }
        );
    }
);
