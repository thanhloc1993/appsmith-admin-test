import { TeacherKeys } from '@common/teacher-keys';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    aSchoolAdminOnLoginPageCMS,
    clickLoginButtonAndWaitForEndpoint,
    fillTestAccountLoginInCMS,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import {
    staffProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import {
    forgotPasswordTenantFormTextFieldOrganizations,
    forgotPasswordTenantFormTextFieldUsername,
} from '@user-common/cms-selectors/students-page';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { TeacherInterface, CMSInterface } from '@supports/app-types';
import { UserCredentials, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { userAuthenticationMultiTenant } from './user-definition-utils';
import {
    aSchoolAdminOnLoginTenantPageCMS,
    fillTestAccountMultiTenantLoginInCMS,
} from './user-multi-tenant-authentication-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function getStaffInfo(context: ScenarioContext) {
    const staffProfile = getUserProfileFromContext(context, staffProfileAlias);
    if (staffProfile) return;
    //TODO: Refactor all steps having staffProfileAliasWithAccountRoleSuffix('teacher') to staffProfileAlias
    const staff = getUserProfileFromContext(
        context,
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );

    await context.set(staffProfileAlias, staff);
}

export async function requestNewPassword(
    teacher: TeacherInterface,
    email: string,
    organization?: string
) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction('Teacher goes to forgot password page', async function () {
        const forgotPasswordButtonFinder = new ByValueKey(TeacherKeys.forgotPasswordButton);
        await driver.tap(forgotPasswordButtonFinder);

        const forgotPasswordScreenFinder = new ByValueKey(TeacherKeys.forgot_password_screen_key);
        await driver.waitFor(forgotPasswordScreenFinder);
    });

    if (organization) {
        await teacher.instruction('Teacher submits email and organization', async function () {
            const emailTextFieldFinder = new ByValueKey(TeacherKeys.emailTextField);
            await driver.tap(emailTextFieldFinder);
            await driver.enterText(email);

            const organizationTextFieldFinder = new ByValueKey(TeacherKeys.organization_text_field);
            await driver.tap(organizationTextFieldFinder);
            await driver.enterText(organization);

            const submitEmailButtonFinder = new ByValueKey(TeacherKeys.submitEmailButton);
            await driver.tap(submitEmailButtonFinder);

            const sendingDialogFinder = new ByValueKey(TeacherKeys.sendingDialog);
            await driver.waitForAbsent(sendingDialogFinder);
        });
    } else {
        await teacher.instruction('Teacher submits email', async function () {
            const emailTextFieldFinder = new ByValueKey(TeacherKeys.emailTextField);
            await driver.tap(emailTextFieldFinder);
            await driver.enterText(email);

            const submitEmailButtonFinder = new ByValueKey(TeacherKeys.submitEmailButton);
            await driver.tap(submitEmailButtonFinder);

            const sendingDialogFinder = new ByValueKey(TeacherKeys.sendingDialog);
            await driver.waitForAbsent(sendingDialogFinder);
        });
    }
    await teacher.instruction('Teacher sees email submitted success screen', async function () {
        const submittedEmailScreenFinder = new ByValueKey(TeacherKeys.submitted_email_screen_key);
        await driver.waitFor(submittedEmailScreenFinder);
    });
}

export async function returnToLoginScreen(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction('Teacher goes back to sign in page', async function () {
        const backToSignInButtonFinder = new ByValueKey(TeacherKeys.backToSignInButton);
        await driver.tap(backToSignInButtonFinder);

        const loginScreenFinder = new ByValueKey(TeacherKeys.login_screen_key);
        await driver.waitFor(loginScreenFinder);
    });
}

export async function adminIsOnForgotPasswordPage(cms: CMSInterface, isMultiTenantLogin?: boolean) {
    const dataTestIdForgotPasswordLink = isMultiTenantLogin
        ? CMSKeys.multiTenantForgotPasswordLink
        : CMSKeys.loginFormButtonForgot;

    await cms.instruction('User clicks Forgot Password link', async function () {
        await cms.selectElementByDataTestId(dataTestIdForgotPasswordLink);
    });
    await cms.instruction('User sees forgot password form', async function () {
        await cms.page?.waitForSelector(
            isMultiTenantLogin ? CMSKeys.multiTenantForgotForm : CMSKeys.forgotForm
        );
    });
}

export async function adminResetPassword(cms: CMSInterface, email: string, organization?: string) {
    const page = cms.page!;

    if (organization) {
        await cms.instruction('User fills organization in organization field', async function () {
            await page.fill(forgotPasswordTenantFormTextFieldOrganizations, organization);
        });

        await cms.instruction('User fills email in username field', async function () {
            await page.fill(forgotPasswordTenantFormTextFieldUsername, email);
        });

        await cms.instruction('User clicks Reset Password button', async function () {
            await cms.selectElementByDataTestId(CMSKeys.multiTenantResetPasswordButton);
        });
    } else {
        await cms.instruction('User fills email in username field', async function () {
            await page.fill(CMSKeys.formInput, email);
        });

        await cms.instruction('User clicks Reset Password button', async function () {
            await cms.selectElementByDataTestId(CMSKeys.resetPasswordButton);
        });
    }
    await cms.instruction('User sees the email is sent', async function () {
        await page.waitForSelector(CMSKeys.resendEmailForm);
    });
    //handle reset password by gRPC later
}
export async function adminGoBackToLoginScreen(cms: CMSInterface, isMultiTenantLogin?: boolean) {
    await cms.instruction('User clicks Back To Sign In button', async function () {
        await cms.selectElementByDataTestId(CMSKeys.backToSignInButton);
    });
    if (isMultiTenantLogin) {
        await aSchoolAdminOnLoginTenantPageCMS(cms);
    } else {
        await aSchoolAdminOnLoginPageCMS(cms);
    }
}
export async function adminLoginWithNewPassword(
    cms: CMSInterface,
    username: string,
    password: string,
    organization?: string
) {
    if (organization) {
        await cms.instruction(
            `Fill username ${username}, password ${password}, organization ${organization} in multi-tenant login form`,
            async function () {
                await fillTestAccountMultiTenantLoginInCMS(cms, {
                    username,
                    password,
                    organization,
                });
            }
        );
    } else {
        await cms.instruction(
            `Fill username ${username} and password ${password} in login form`,
            async function () {
                await fillTestAccountLoginInCMS(cms, username, password);
            }
        );
    }
    await clickLoginButtonAndWaitForEndpoint(cms);
    await cms.instruction(`User has successfully logged in`, async function () {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
}

export async function getCredentialsToLoginCMSAndTeacherApp(
    context: ScenarioContext,
    credentialTypes: string
) {
    const staffProfile = context.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );
    const updatedStaffProfile = context.get<UserProfileEntity>(staffProfileAlias);

    const [emailType, passwordType] = credentialTypes.split(' and ');

    const staffCredentials = {
        username: emailType === 'old email' ? staffProfile.email : updatedStaffProfile.email,
        password:
            passwordType === 'old password' ? staffProfile.password : updatedStaffProfile.password,
    };
    return staffCredentials;
}

export async function adminResetPwdByForgotPwdFeature(cms: CMSInterface, context: ScenarioContext) {
    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    await cms.instruction(
        'school admin resets password by forgot password feature',
        async function () {
            await adminIsOnForgotPasswordPage(cms, isEnabledMultiTenantLogin);
        }
    );

    await cms.instruction(
        'school admin gets new password by reset password function',
        async function () {
            const adminCredentials = context.get<UserCredentials & { organization: string }>(
                staffProfileAlias
            );
            await adminResetPassword(
                cms,
                adminCredentials.email,
                isEnabledMultiTenantLogin ? adminCredentials.organization : ''
            );
        }
    );
}
