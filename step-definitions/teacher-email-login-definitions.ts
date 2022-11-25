import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { TeacherInterface } from '@supports/app-types';

import { homeScreenKey } from './teacher-keys/home-screen';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import { userAuthenticationMultiTenant } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { getSchoolAdminAccount } from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

export async function fillTestAccountLoginInTeacherWeb({
    teacher,
    username,
    password,
    organization,
}: {
    teacher: TeacherInterface;
    username: string;
    password: string;
    organization?: string;
}): Promise<void> {
    const driver = teacher.flutterDriver!;

    if (organization !== undefined) {
        const organizationTextFieldFinder = new ByValueKey(TeacherKeys.organization_text_field);
        await driver.tap(organizationTextFieldFinder);
        await driver.enterText(organization);
    }

    const emailTextFieldFinder = new ByValueKey(TeacherKeys.emailTextField);
    await driver.tap(emailTextFieldFinder);
    await driver.enterText(username);

    const passwordTextFieldFinder = new ByValueKey(TeacherKeys.passwordTextField);
    await driver.tap(passwordTextFieldFinder);
    await driver.enterText(password);

    const loginButtonFinder = new ByValueKey(TeacherKeys.loginButton);
    await driver.tap(loginButtonFinder);
}

export async function aTeacherAtHomeScreenTeacherWeb(teacher: TeacherInterface): Promise<void> {
    await teacher.flutterDriver!.waitForAbsent(new ByValueKey(TeacherKeys.homeScreen), 15000);
}

export async function aTeacherAlreadyLoginSuccessInTeacherWeb(
    teacher: TeacherInterface
): Promise<void> {
    await teacher.flutterDriver!.waitFor(new ByValueKey(homeScreenKey), 30000);
}

export async function aTeacherAlreadyLoginFailedInTeacherWeb(
    teacher: TeacherInterface
): Promise<void> {
    await teacher.flutterDriver!.waitFor(new ByValueKey(TeacherKeys.loginButton), 20000);
}

export async function teacherEnterAccountInformation({
    teacher,
    username,
    password,
    defaultOrganization,
}: {
    teacher: TeacherInterface;
    username: string;
    password: string;
    defaultOrganization?: string;
}) {
    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (isEnabledMultiTenantLogin) {
        const { organization } = getSchoolAdminAccount({
            schoolName: 'school admin Tenant S1',
        });

        await teacher.instruction(
            `teacher enters username: ${username}, password: ${password} and organization: ${
                defaultOrganization ?? organization
            }`,
            async function () {
                await fillTestAccountLoginInTeacherWeb({
                    teacher,
                    username,
                    password,
                    organization: defaultOrganization ?? organization,
                });
            }
        );
    } else {
        await teacher.instruction('teacher enters username and password', async function () {
            await fillTestAccountLoginInTeacherWeb({
                teacher,
                username,
                password,
            });
        });
    }
}
