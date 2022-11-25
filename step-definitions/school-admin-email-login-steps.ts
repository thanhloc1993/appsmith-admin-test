import { Given, When, Then } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { aSchoolAdminGoToLoginNormalPageCMS } from './credential-account-definitions';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    fillTestAccountLoginInCMS,
    clickLoginButtonAndWaitForEndpoint,
    aSchoolAdminOnLoginPageCMS,
} from './school-admin-email-login-definitions';
import { userAuthenticationMultiTenant } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given('school admin does not login yet', async function () {
    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (isEnabledMultiTenantLogin) {
        await this.cms.instruction(
            'User not login yet, click redirect to login page',
            async function (cms) {
                await aSchoolAdminGoToLoginNormalPageCMS(cms);
            }
        );
    }

    await this.cms.instruction('User see login form', async function (cms) {
        await aSchoolAdminOnLoginPageCMS(cms);
    });
});

When(
    'school admin logins with the email is {string} and the password is {string}',
    async function (username: string, password: string) {
        await this.cms.instruction('Fill username and password', async function (cms) {
            await fillTestAccountLoginInCMS(cms, username, password);
        });

        await clickLoginButtonAndWaitForEndpoint(this.cms);
    }
);

Then('school admin logins success', async function () {
    await this.cms.instruction('Logged in, see home page', async function (cms) {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
});
