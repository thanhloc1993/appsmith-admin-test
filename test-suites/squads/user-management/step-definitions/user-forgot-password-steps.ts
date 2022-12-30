import { buttonLogout, profileButtonSelector } from '@legacy-step-definitions/cms-selectors/appbar';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    aSchoolAdminOnCMSLoginPageAndSeeLoginForm,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginFailedInTeacherWeb,
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { adminProfileAlias, staffProfileAlias } from '@user-common/alias-keys/user';

import { When, Then, Given } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, IMasterWorld, TeacherInterface } from '@supports/app-types';
import { UserCredentials, UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    forgotPasswordStaff,
    staffLoginAccountFromTeacherWorld,
    staffSeesTheirInfo,
} from './user-create-staff-definitions';
import { userAuthenticationMultiTenant } from './user-definition-utils';
import {
    adminGoBackToLoginScreen,
    adminIsOnForgotPasswordPage,
    adminLoginWithNewPassword,
    adminResetPassword,
    getCredentialsToLoginCMSAndTeacherApp,
    getStaffInfo,
    requestNewPassword,
    returnToLoginScreen,
} from './user-forgot-password-definitions';
import { loginCMSByUserNameAndPassWord } from './user-login-fail-by-wrong-username-or-password-definitions';
import {
    getSchoolAdminAccount,
    getTenantSchoolAdminSequence,
} from './user-multi-tenant-authentication-definitions';

export type AuthResultTypes = 'can login' | 'can not login';

When('staff resets password by forgot password feature', async function (this: IMasterWorld) {
    const context = this.scenario;

    await getStaffInfo(context);

    const { email } = context.get<UserProfileEntity>(staffProfileAlias);

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    const { organization } = getSchoolAdminAccount({
        schoolName: 'school admin Tenant S1',
    });

    await this.teacher.instruction(
        'staff resets new password',
        async function (this: TeacherInterface) {
            await requestNewPassword(this, email, isEnabledMultiTenantLogin ? organization : '');
        }
    );

    await this.cms.instruction(
        'Simulate reset password from email by gRPC',
        async function (this: CMSInterface) {
            await forgotPasswordStaff(this, context);
        }
    );
});

Then(
    'staff logins Teacher App successfully with new password',
    async function (this: IMasterWorld) {
        const context = this.scenario;

        await returnToLoginScreen(this.teacher);

        await this.teacher.instruction(
            'Logged in, see home screen',
            async function (this: TeacherInterface) {
                await staffLoginAccountFromTeacherWorld({
                    teacher: this,
                    context,
                });
            }
        );

        await this.teacher.instruction(
            'staff sees their info',
            async function (this: TeacherInterface) {
                await staffSeesTheirInfo(this, context);
            }
        );
    }
);

Given('school admin has not logged in yet', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;
    const randomAdminAccount = getTenantSchoolAdminSequence();
    const adminCredentials = {
        email: randomAdminAccount.username,
        password: randomAdminAccount.password,
        organization: randomAdminAccount.organization,
    };
    context.set(adminProfileAlias, adminCredentials);

    await cms.instruction('User goes to cms login page and see login form', async function () {
        await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms);
    });
});

When(
    'school admin resets password by forgot password feature',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const context = this.scenario;

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        await adminIsOnForgotPasswordPage(cms, isEnabledMultiTenantLogin);

        await cms.instruction(
            'User get new password by reset password function',
            async function () {
                const adminCredentials = context.get<UserCredentials & { organization: string }>(
                    adminProfileAlias
                );
                await adminResetPassword(
                    cms,
                    adminCredentials.email,
                    isEnabledMultiTenantLogin ? adminCredentials.organization : ''
                );
            }
        );
    }
);

Then('school admin logins CMS successfully with new password', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    await adminGoBackToLoginScreen(cms, isEnabledMultiTenantLogin);

    const adminCredentials = context.get<UserCredentials & { organization: string }>(
        adminProfileAlias
    );

    await cms.instruction('User logins successfully with new password', async function () {
        await adminLoginWithNewPassword(
            cms,
            adminCredentials.email,
            adminCredentials.password,
            isEnabledMultiTenantLogin ? adminCredentials.organization : ''
        );
    });
});

Then(
    `staff {string} CMS with {string}`,
    async function (this: IMasterWorld, result: AuthResultTypes, value: string) {
        const cms = this.cms;
        const context = this.scenario;
        await cms.instruction(
            'staff logs out current account on CMS',
            async function (cms: CMSInterface) {
                await cms.selectElementByDataTestId(profileButtonSelector);
                await cms.page!.click(buttonLogout);
            }
        );

        const staffCredentials = await getCredentialsToLoginCMSAndTeacherApp(context, value);

        await cms.instruction(
            `staff logins CMS again with email= ${staffCredentials.username} and password= ${staffCredentials.password}`,
            async function (cms: CMSInterface) {
                await loginCMSByUserNameAndPassWord(
                    cms,
                    staffCredentials.username,
                    staffCredentials.password
                );
            }
        );
        if (result === 'can login') {
            await cms.instruction('Logged in, see home page', async function (cms: CMSInterface) {
                await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
            });
        } else {
            await cms.instruction(
                'Logged in failed on CMS, does not see home screen',
                async function (cms) {
                    await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms);
                }
            );
        }
    }
);

Then(
    `staff {string} Teacher Web with {string}`,
    async function (this: IMasterWorld, result: AuthResultTypes, value: string) {
        const teacher = this.teacher;
        const context = this.scenario;
        await returnToLoginScreen(this.teacher);

        const staffCredentials = await getCredentialsToLoginCMSAndTeacherApp(context, value);

        await teacher.instruction(
            `staff logins Teacher Web again with email= ${staffCredentials.username} and password= ${staffCredentials.password}`,
            async function (teacher: TeacherInterface) {
                await teacherEnterAccountInformation({
                    teacher,
                    username: staffCredentials.username,
                    password: staffCredentials.password,
                });
            }
        );
        if (result === 'can login') {
            await teacher.instruction(
                'Login successfully on Teacher Web',
                async function (this: TeacherInterface) {
                    await aTeacherAlreadyLoginSuccessInTeacherWeb(this);
                }
            );
        } else {
            await teacher.instruction(
                'Logged in failed, does not see home screen',
                async function (teacher: TeacherInterface) {
                    await aTeacherAlreadyLoginFailedInTeacherWeb(teacher);
                }
            );
        }
    }
);
