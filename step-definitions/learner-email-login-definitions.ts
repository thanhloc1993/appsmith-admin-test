import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { LearnerInterface } from './../supports/app-types';
import { homeScreenKey } from './learner-keys/home-screen';
import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';
import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { getSchoolAdminAccount } from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

export async function fillUserNameAndPasswordLearnerWeb({
    learner,
    username,
    password,
    defaultOrganization,
    isMultiTenantLogin,
}: {
    learner: LearnerInterface;
    username: string;
    password: string;
    defaultOrganization?: string;
    isMultiTenantLogin?: boolean;
}): Promise<void> {
    const driver = learner.flutterDriver!;

    let isEnabledMultiTenantLogin = isMultiTenantLogin;
    if (isEnabledMultiTenantLogin === undefined) {
        isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );
    }
    const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
        userAuthenticationLearnerRememberedAccount
    );

    if (isEnabledMultiTenantLogin) {
        await learner.instruction(
            'User not login yet, show auth search organization screen',
            async function () {
                await aLearnerAtAuthSearchOrganizationScreenLearnerWeb(learner);
            }
        );

        await learner.instruction(
            'Fill organization in auth search organization page',
            async function () {
                const { organization } = getSchoolAdminAccount({
                    schoolName: 'school admin Tenant S1',
                });

                await fillOrganization(learner, defaultOrganization ?? organization);
            }
        );
    } else if (!isEnabledRemoveRememberedAccount) {
        await learner.instruction('Press add a new account button', async function () {
            //tap on add new account button
            const addANewAccountAccountButton = new ByValueKey(LearnerKeys.addANewAccountButton);
            await driver.tap(addANewAccountAccountButton);
        });
    }

    await fillEmailAndPassword(learner, username, password);
}

export async function fillEmailAndPassword(
    learner: LearnerInterface,
    username: string,
    password: string
): Promise<void> {
    const driver = learner.flutterDriver!;

    //tap on email box
    await learner.instruction(`Fill email ${username}`, async function () {
        const emailTextFieldFinder = new ByValueKey(LearnerKeys.emailTextBox);
        await driver.tap(emailTextFieldFinder);
        await driver.enterText(username);
    });

    //tap on pass box
    await learner.instruction(`Fill password ${password}`, async function () {
        const passwordTextFieldFinder = new ByValueKey(LearnerKeys.passwordTextBox);
        await driver.tap(passwordTextFieldFinder);
        await driver.enterText(password);
    });

    await learner.instruction('Pressed login button', async function () {
        const signInButtonFinder = new ByValueKey(LearnerKeys.signInButton);
        await driver.tap(signInButtonFinder);
    });
}

export async function fillOrganization(
    learner: LearnerInterface,
    organization: string
): Promise<void> {
    const driver = learner.flutterDriver!;

    //tap on organization box
    await learner.instruction(`Fill organization ${organization}`, async function () {
        const organizationTextFieldFinder = new ByValueKey(LearnerKeys.organizationTextBox);
        await driver.tap(organizationTextFieldFinder);
        await driver.enterText(organization);
    });

    await learner.instruction('Pressed next button', async function () {
        const searchOrgButton = new ByValueKey(LearnerKeys.searchOrgButton);
        await driver.tap(searchOrgButton);
    });
}

export async function aLearnerAtAuthMultiScreenLearnerWeb(
    learner: LearnerInterface
): Promise<void> {
    await learner.flutterDriver!.waitFor(new ByValueKey(LearnerKeys.authMultiUsersScreen));
}

export async function aLearnerAtAuthSearchOrganizationScreenLearnerWeb(
    learner: LearnerInterface
): Promise<void> {
    await learner.flutterDriver!.waitFor(new ByValueKey(LearnerKeys.authSearchOrganizationScreen));
}

export async function aLearnerAtAuthLoginScreenLearnerWeb(
    learner: LearnerInterface
): Promise<void> {
    await learner.flutterDriver!.waitFor(new ByValueKey(LearnerKeys.authSignInScreen));
}

export async function aLearnerAlreadyLoginSuccessInLearnerWeb(
    learner: LearnerInterface
): Promise<void> {
    await learner.flutterDriver?.waitFor(new ByValueKey(LearnerKeys.welcomeBackScreen), 20000);

    const startButtonFinder = new ByValueKey(LearnerKeys.letStartButton);
    await learner.flutterDriver?.tap(startButtonFinder);
}

export async function aLearnerAtHomeScreenLearnerWeb(learner: LearnerInterface): Promise<void> {
    await learner.flutterDriver?.waitFor(new ByValueKey(homeScreenKey), 30000);
}

export async function aLearnerAlreadyLoginFailedInLearnerWeb(
    learner: LearnerInterface
): Promise<void> {
    await learner.flutterDriver?.waitFor(new ByValueKey(LearnerKeys.authSignInScreen));
}

export async function loginLearnerAccountFailed({
    learner,
    email,
    password,
    organization,
}: {
    learner: LearnerInterface;
    email: string;
    password: string;
    organization?: string;
}) {
    /// Have instructions inside
    await fillUserNameAndPasswordLearnerWeb({
        learner,
        username: email,
        password,
        defaultOrganization: organization,
    });

    await learner.instruction(
        'Logged in failed, does not see home screen',
        async function (this: LearnerInterface) {
            await aLearnerAlreadyLoginFailedInLearnerWeb(this);
        }
    );
}

export async function loginOnLearnerApp({
    learner,
    email,
    name,
    password,
    organization,
}: {
    learner: LearnerInterface;
    email: string;
    name: string;
    password: string;
    organization?: string;
}) {
    await learner.instruction(
        `${name} login with credentials`,
        async function (this: LearnerInterface) {
            await fillUserNameAndPasswordLearnerWeb({
                learner: this,
                username: email,
                password,
                defaultOrganization: organization,
            });
        }
    );

    await learner.instruction(
        `Verify ${name} is at HomeScreen after login successfully`,
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
        }
    );

    await learner.instruction(`Verify name: ${name} on Learner App`, async function () {
        await learner.checkUserName(name);
    });
}
