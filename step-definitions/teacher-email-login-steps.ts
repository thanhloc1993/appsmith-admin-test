import { Given, When, Then } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { IMasterWorld } from '@supports/app-types';

import { TeacherInterface } from './../supports/app-types';
import {
    aTeacherAtHomeScreenTeacherWeb,
    fillTestAccountLoginInTeacherWeb,
    aTeacherAlreadyLoginSuccessInTeacherWeb,
} from './teacher-email-login-definitions';
import { userAuthenticationMultiTenant } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given('teacher does not login yet', async function (this: IMasterWorld) {
    await this.teacher.instruction(
        'User not login yet, see login form',
        async function (this: TeacherInterface) {
            await aTeacherAtHomeScreenTeacherWeb(this);
        }
    );
});

When(
    'teacher logins with {string} email, {string} password and {string} organization',
    async function (this: IMasterWorld, username: string, password: string, organization: string) {
        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        if (isEnabledMultiTenantLogin) {
            await this.teacher.instruction(
                'Fill username, password, organization and press button login',
                async function (this: TeacherInterface) {
                    await fillTestAccountLoginInTeacherWeb({
                        teacher: this,
                        username,
                        password,
                        organization,
                    });
                }
            );
        } else {
            await this.teacher.instruction(
                'Fill username, password and press button login',
                async function (this: TeacherInterface) {
                    await fillTestAccountLoginInTeacherWeb({
                        teacher: this,
                        username,
                        password,
                    });
                }
            );
        }
    }
);

Then('teacher logins success', async function (this: IMasterWorld) {
    await this.teacher.instruction(
        'Logged in, see home screen',
        async function (this: TeacherInterface) {
            await aTeacherAlreadyLoginSuccessInTeacherWeb(this);
        }
    );
});
