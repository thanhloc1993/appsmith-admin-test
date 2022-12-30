import { buttonLogout, profileButtonSelector } from '@legacy-step-definitions/cms-selectors/appbar';
import { submitButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    clickLoginButtonAndWaitForEndpointInMultiTenant,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    changeRowsPerPage,
    getSchoolAdminTenantInterfaceFromRole,
    randomInteger,
} from '@legacy-step-definitions/utils';
import {
    aliasFirstGrantedLocationWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import {
    loginCardContent,
    loginFormRedirectLoginTenant,
    loginTenantFormTextFieldPassword,
    loginTenantFormTextFieldOrganizations,
    loginTenantFormTextFieldUsername,
    menuItem,
} from '@user-common/cms-selectors/students-page';

import { Page } from 'playwright';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import {
    CMSInterface,
    SchoolAdminRolesWithTenant,
    Tenant,
    IMasterWorld,
    AccountRoles,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { CMSProfile } from '@supports/types/cms-types';

import { createARandomStaffFromGRPC } from './user-create-staff-definitions';
import {
    findNewlyCreatedLearnerOnCMSStudentsPage,
    userAuthenticationMultiTenant,
} from './user-definition-utils';
import { StudentTypes } from './user-view-student-list-definitions';
import { notStrictEqual, strictEqual } from 'assert';
import { schoolAdminGetFirstGrantedLocation } from 'test-suites/squads/architecture/step-definitions/architecture-auto-select-first-granted-location-definitions';

export type AccountSchoolAdmin = {
    organization: string;
    username: string;
    password: string;
};

type SampleSchoolAdminAccountsWithTenant = {
    'school admin Tenant S1': AccountSchoolAdmin;
    'school admin Tenant S2': AccountSchoolAdmin;
};

// TODO: We will remove it soon
export const sampleSchoolAdminAccountsWithTenant: SampleSchoolAdminAccountsWithTenant = {
    'school admin Tenant S1': {
        organization: 'e2e',
        username: 'thu.vo+e2eschool@manabie.com',
        password: 'M@nabie123',
    },
    'school admin Tenant S2': {
        organization: 'e2e-hcm',
        username: 'phuc.chau+e2ehcmschooladmin@manabie.com',
        password: 'Manabie123',
    },
};

export const tenantIdentifiers: Record<Tenant, string> = {
    'Tenant S1': 'e2e',
    'Tenant S2': 'e2e-hcm',
};

export function getTenantSchoolAdminSequence() {
    const totalAccounts = 200;

    const { username, password, organization } =
        sampleSchoolAdminAccountsWithTenant['school admin Tenant S1'];

    const randomNumber = randomInteger(0, totalAccounts);
    if (!randomNumber) {
        return { username, password, organization };
    } else {
        const usernameWithRandomNumber = username.replace(
            '@manabie.com',
            `${randomNumber}@manabie.com`
        );

        return {
            username: usernameWithRandomNumber,
            password,
            organization,
        };
    }
}

export function getSchoolAdminAccount({
    schoolName,
    tenantIdentifier,
}: {
    schoolName: SchoolAdminRolesWithTenant;
    tenantIdentifier?: Tenant;
}): AccountSchoolAdmin {
    const { organization, username, password } =
        schoolName === 'school admin Tenant S2'
            ? sampleSchoolAdminAccountsWithTenant[schoolName]
            : getTenantSchoolAdminSequence();

    if (tenantIdentifier) {
        return {
            organization: tenantIdentifiers[tenantIdentifier],
            username,
            password,
        };
    }
    return { organization, username, password };
}

export async function aSchoolAdminOnLoginTenantPageCMS(cms: CMSInterface): Promise<void> {
    await cms.instruction('User sees login tenant form', async function () {
        await cms.page!.waitForSelector(loginCardContent);
        await cms.page!.waitForSelector(loginTenantFormTextFieldOrganizations);
        await cms.page!.waitForSelector(loginTenantFormTextFieldUsername);
        await cms.page!.waitForSelector(loginTenantFormTextFieldPassword);
    });
}

export async function fillTestAccountMultiTenantLoginInCMS(
    cms: CMSInterface,
    account: AccountSchoolAdmin
): Promise<void> {
    const { organization, username, password } = account;
    if (organization) {
        await cms.page!.fill(loginTenantFormTextFieldOrganizations, organization);
    }

    await cms.page!.fill(loginTenantFormTextFieldUsername, username);
    await cms.page!.fill(loginTenantFormTextFieldPassword, password);
}

export async function checkUserAlreadyLogin(
    cms: CMSInterface,
    expectRole: SchoolAdminRolesWithTenant
) {
    const userProfile: CMSProfile = await cms.getProfile();

    await cms.instruction(`User ${expectRole} already login`, async function () {
        let currentEmail = '';
        let expectedUserName = '';

        if (expectRole === 'school admin Tenant S1') {
            currentEmail = userProfile.email.slice(0, 'thu.vo+e2eschool'.length);
            const { username } = getSchoolAdminAccount({
                schoolName: expectRole,
            });

            expectedUserName = username.slice(0, 'thu.vo+e2eschool'.length);

            strictEqual(
                expectedUserName,
                currentEmail,
                `User should have email value is ${expectedUserName}`
            );
        } else {
            currentEmail = userProfile.email;
            const { username } = getSchoolAdminAccount({
                schoolName: expectRole,
            });

            strictEqual(username, currentEmail, `User should have email value is ${username}`);
        }
    });
}

export async function checkCorrectlyMenuTab(cms: CMSInterface) {
    const page = cms.page!;
    const menuTabs: Menu[] = [
        Menu.STUDENTS,
        Menu.COURSES,
        Menu.STAFF,
        Menu.NOTIFICATION,
        Menu.BOOKS,
    ];
    for (const item of menuTabs) {
        await page.waitForSelector(menuItem(item));
    }
}

export async function checkCorrectlyListStudent(
    cms: CMSInterface,
    context: ScenarioContext,
    tenant: string
) {
    const student = await context.get<UserProfileEntity>(tenant);

    await findNewlyCreatedLearnerOnCMSStudentsPage(cms, student);
}

export async function loginAnotherAccountWithOtherTab({
    cms,
    newPage,
    role,
}: {
    cms: CMSInterface;
    newPage: Page;
    role: SchoolAdminRolesWithTenant;
}) {
    await cms.instruction('Click on dropdown', async function () {
        const buttonProfile = await newPage.waitForSelector(profileButtonSelector);
        await buttonProfile.click();
    });

    await cms.instruction('Click on logout button', async function () {
        await newPage.click(buttonLogout);
    });

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (!isEnabledMultiTenantLogin) {
        await cms.instruction('User not login yet, see login form', async function () {
            const directUrlLoginTenantPage = await newPage.waitForSelector(
                loginFormRedirectLoginTenant
            );

            await directUrlLoginTenantPage.click();
        });
    }

    const { organization, username, password } = getSchoolAdminAccount({
        schoolName: role,
    });
    await cms.instruction(
        `Fill username ${username}, password ${password} in BO login page`,
        async function () {
            await newPage.fill(loginTenantFormTextFieldOrganizations, organization);
            await newPage.fill(loginTenantFormTextFieldUsername, username);
            await newPage.fill(loginTenantFormTextFieldPassword, password);

            await newPage.click(submitButton);
        }
    );

    await cms.instruction('Logged in, see home page', async function () {
        await newPage.waitForSelector(profileButtonSelector);
    });
}

export async function verifyAccountDifferent(
    currentAccount: SchoolAdminRolesWithTenant,
    anotherAccount: SchoolAdminRolesWithTenant
) {
    const { organization: currentOrganization, username: currentUsername } = getSchoolAdminAccount({
        schoolName: currentAccount,
    });
    const { organization, username } = getSchoolAdminAccount({
        schoolName: anotherAccount,
    });

    notStrictEqual(currentOrganization, organization, `The organization should be different`);
    notStrictEqual(currentUsername, username, `The username should be different`);
}

interface CMSAccountMultiTenantReturn {
    username: UserProfileEntity['name'];
    password: UserProfileEntity['password'];
    organization: string;
    cms: CMSInterface;
}

export async function getAccountToLoginCMSMultiTenant({
    masterWorld,
    role,
    tenant,
    shouldUseCmsInterfaceAsDefault = false,
}: {
    masterWorld: IMasterWorld;
    role: AccountRoles | SchoolAdminRolesWithTenant;
    tenant?: Tenant;
    shouldUseCmsInterfaceAsDefault?: boolean;
}): Promise<CMSAccountMultiTenantReturn> {
    // Teachers can only login if the school admin is already logged in
    if (role === 'teacher') {
        const account: UserProfileEntity = await createARandomStaffFromGRPC(masterWorld.cms);
        masterWorld.scenario.set(staffProfileAliasWithAccountRoleSuffix(role), account);

        // return random teacher account
        return {
            username: account.email,
            password: account.password,
            organization: 'e2e',
            cms: masterWorld.cms2,
        };
    }

    if (role === 'school admin 2') {
        return {
            ...getTenantSchoolAdminSequence(),
            organization: 'e2e',
            cms: masterWorld.cms2,
        };
    }

    if (role === 'school admin Tenant S2') {
        const { organization, username, password } = getSchoolAdminAccount({
            schoolName: `school admin Tenant S2`,
            tenantIdentifier: tenant,
        });

        return {
            username,
            password,
            organization,
            cms: shouldUseCmsInterfaceAsDefault ? masterWorld.cms : masterWorld.cms2,
        };
    }

    // return school admin account
    const { organization, username, password } = getSchoolAdminAccount({
        schoolName: `school admin Tenant S1`,
        tenantIdentifier: tenant,
    });

    return {
        username,
        password,
        organization,
        cms: masterWorld.cms,
    };
}

export async function aSchoolAdminLoginAsTenantInCMS({
    masterWorld,
    role,
    tenant,
    shouldVerifiedLoggedIn = true,
    withoutTenant = false,
    shouldUseCmsInterfaceAsDefault = false,
}: {
    masterWorld: IMasterWorld;
    role: AccountRoles | SchoolAdminRolesWithTenant;
    tenant?: Tenant;
    shouldVerifiedLoggedIn?: boolean;
    withoutTenant?: boolean;
    shouldUseCmsInterfaceAsDefault?: boolean;
}) {
    const { username, password, organization, cms } = await getAccountToLoginCMSMultiTenant({
        masterWorld,
        role,
        tenant,
        shouldUseCmsInterfaceAsDefault,
    });

    await cms.instruction(
        'User not login yet and go to login tenant page',
        async function (cms: CMSInterface) {
            await aSchoolAdminOnLoginTenantPageCMS(cms);
        }
    );

    await cms.instruction(
        withoutTenant
            ? `Fill username ${username}, password ${password} in BO login page`
            : `Fill username ${username}, password ${password}, and ${organization} organization in BO login page`,

        async function (cms: CMSInterface) {
            await fillTestAccountMultiTenantLoginInCMS(cms, {
                organization: withoutTenant ? '' : organization,
                username,
                password,
            });
        }
    );

    if (shouldVerifiedLoggedIn) {
        await clickLoginButtonAndWaitForEndpointInMultiTenant(cms);
        await cms.waitingForLoadingIcon();
        await cms.instruction('Logged in, see home page', async function (cms: CMSInterface) {
            await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
        });
    }
}

export async function schoolAdminVerifiesStudentsListWithResourcePath(cms: CMSInterface) {
    await cms.schoolAdminIsOnThePage(Menu.STUDENTS, 'Student Management');

    let userList: StudentTypes[];

    await cms.instruction('School admin change the rows per page into 100', async function () {
        const [resultList] = await Promise.all([
            cms.waitForHasuraResponse('User_GetStudentListWithFilter'),
            changeRowsPerPage(cms, 50, false),
        ]);
        userList = resultList.resp?.data?.users;
    });

    await cms.instruction(
        `School admin verifies students list with resource_path`,
        async function () {
            const { schoolId } = await cms.getProfile();

            for (let index = 0; index < userList.length; index++) {
                const user = userList[index];
                weExpect(
                    schoolId.toString(),
                    `organization's resource path should equal to student's resource path: 
                    student's ID: ${user.user_id} 
                    student's resource path: ${user.resource_path} 
                    organization's resource path: ${schoolId}`
                ).toBe(user.resource_path);
            }
        }
    );
}

export async function userVerifiesTextFieldOrgId({
    cms,
    expectValue,
    errorMessage,
}: {
    cms: CMSInterface;
    expectValue: string;
    errorMessage: string;
}) {
    const textFieldOrganizations = cms.page!.locator(loginTenantFormTextFieldOrganizations);

    const valueOfTextField = await textFieldOrganizations.inputValue();

    weExpect(valueOfTextField, errorMessage).toEqual(expectValue);
}

export async function schoolAdminTenantRegisterFirstGrantedLocation(
    masterWorld: IMasterWorld,
    role: SchoolAdminRolesWithTenant,
    shouldUseCmsInterfaceAsDefault = false
) {
    const cms = shouldUseCmsInterfaceAsDefault
        ? masterWorld.cms
        : getSchoolAdminTenantInterfaceFromRole(masterWorld, role);
    const scenarioContext = masterWorld.scenario;

    const firstGrantedLocation = await schoolAdminGetFirstGrantedLocation(cms, scenarioContext);

    scenarioContext.set(aliasFirstGrantedLocationWithAccountRoleSuffix(role), firstGrantedLocation);
}
