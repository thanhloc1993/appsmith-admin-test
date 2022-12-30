import { Given, When, Then } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { IMasterWorld } from '@supports/app-types';

import { LearnerInterface } from './../supports/app-types';
import {
    fillUserNameAndPasswordLearnerWeb,
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtAuthMultiScreenLearnerWeb,
    aLearnerAtAuthSearchOrganizationScreenLearnerWeb,
    aLearnerAtAuthLoginScreenLearnerWeb,
} from './learner-email-login-definitions';
import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given('student does not login yet', async function (this: IMasterWorld) {
    await this.learner.instruction(
        'User not login yet, see login form',
        async function (this: LearnerInterface) {
            const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
                userAuthenticationMultiTenant
            );
            const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
                userAuthenticationLearnerRememberedAccount
            );

            if (isEnabledMultiTenantLogin) {
                await aLearnerAtAuthSearchOrganizationScreenLearnerWeb(this);
            } else if (isEnabledRemoveRememberedAccount) {
                await aLearnerAtAuthLoginScreenLearnerWeb(this);
            } else {
                await aLearnerAtAuthMultiScreenLearnerWeb(this);
            }
        }
    );
});

When(
    'student logins with {string} email, {string} password and {string} organization',
    async function (this: IMasterWorld, username: string, password: string, organization) {
        const learner = this.learner;
        await learner.instruction(
            'Fill username, password, organization and press login button',
            async function (this: LearnerInterface) {
                await fillUserNameAndPasswordLearnerWeb({
                    learner,
                    username,
                    password,
                    defaultOrganization: organization,
                });
            }
        );
    }
);

Then('student logins success', async function (this: IMasterWorld) {
    await this.learner.instruction(
        'Logged in, see home screen',
        async function (this: LearnerInterface) {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(this);
        }
    );
});
