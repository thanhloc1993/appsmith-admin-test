import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import {
    AccountRoles,
    CMSDriverNames,
    CMSInterface,
    IMasterWorld,
    Tenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { ByValueKey } from 'flutter-driver-x';
import { aliasSchoolAdminDriverNameByTenant } from 'step-definitions/alias-keys/lesson';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtAuthMultiScreenLearnerWeb,
    aLearnerAtHomeScreenLearnerWeb,
    fillEmailAndPassword,
    fillOrganization,
} from 'step-definitions/learner-email-login-definitions';
import { LearnerKeys } from 'step-definitions/learner-keys/learner-key';
import { createSampleStudentWithCourseAndEnrolledStatus } from 'step-definitions/lesson-management-utils';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    clickLoginButtonAndWaitForEndpoint,
} from 'step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    aTeacherAtHomeScreenTeacherWeb,
    fillTestAccountLoginInTeacherWeb,
} from 'step-definitions/teacher-email-login-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
} from 'step-definitions/utils';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';
import { userAuthenticationLearnerRememberedAccount } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import {
    AccountSchoolAdmin,
    aSchoolAdminOnLoginTenantPageCMS,
    fillTestAccountMultiTenantLoginInCMS,
    getTenantSchoolAdminSequence,
    tenantIdentifiers,
} from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

// TODO: User squad will refactor the login steps with tenants
// https://manabie.atlassian.net/browse/LT-17723
export type SchoolAdminCMSDriverNames = Exclude<CMSDriverNames, 'cms_3' | 'cms_4'>;
export type CMSAccountWithTenant = AccountSchoolAdmin & { cms: CMSInterface };

const sampleSchoolAdminAccountsWithTenant = [
    { username: 'phuc.chau+e2ehcmschooladmin@manabie.com', password: 'Manabie123' },
];

function getSchoolAdminCMSInterfaceByTenant(
    masterWorld: IMasterWorld,
    tenant: Tenant
): CMSInterface {
    const aliasCMSDriverName = masterWorld.scenario.get<SchoolAdminCMSDriverNames>(
        aliasSchoolAdminDriverNameByTenant(tenant)
    );

    if (aliasCMSDriverName === 'cms') return masterWorld.cms;
    return masterWorld.cms2;
}

function getSchoolAdminAccountWithTenant(tenant: Tenant): AccountSchoolAdmin {
    switch (tenant) {
        case 'Tenant S1':
            return {
                ...getTenantSchoolAdminSequence(),
                organization: tenantIdentifiers[tenant],
            };

        case 'Tenant S2':
            return {
                ...sampleSchoolAdminAccountsWithTenant[0], // Currently only one account
                organization: tenantIdentifiers[tenant],
            };
    }
}

async function getTeacherAccountWithTenant(
    masterWorld: IMasterWorld,
    role: AccountRoles,
    tenant: Tenant
): Promise<AccountSchoolAdmin> {
    // Must have a school admin with tenant logged into the CMS before
    const cmsByTenant = getSchoolAdminCMSInterfaceByTenant(masterWorld, tenant);

    const teacher: UserProfileEntity = await createARandomStaffFromGRPC(cmsByTenant);
    masterWorld.scenario.set(staffProfileAliasWithAccountRoleSuffix(role), teacher);

    return {
        username: teacher.email,
        password: teacher.password,
        organization: tenantIdentifiers[tenant],
    };
}

async function getLearnerAccountWithTenant(
    masterWorld: IMasterWorld,
    role: AccountRoles,
    tenant: Tenant
): Promise<AccountSchoolAdmin> {
    // Must have a school admin with tenant logged into the CMS before
    const cmsByTenant = getSchoolAdminCMSInterfaceByTenant(masterWorld, tenant);

    const { student } = await createSampleStudentWithCourseAndEnrolledStatus({
        cms: cmsByTenant,
        scenarioContext: masterWorld.scenario,
        studentRole: role,
        tenant,
    });

    return {
        username: student.email,
        password: student.password,
        organization: tenantIdentifiers[tenant],
    };
}

async function getAccountWithTenantToLoginCMS(
    masterWorld: IMasterWorld,
    role: AccountRoles,
    tenant: Tenant
): Promise<CMSAccountWithTenant> {
    const cms = getCMSInterfaceByRole(masterWorld, role);

    switch (role) {
        case 'teacher':
        case 'teacher T1':
        case 'teacher T2': {
            const account = await getTeacherAccountWithTenant(masterWorld, role, tenant);

            return { cms, ...account };
        }

        // School admin roles
        default: {
            masterWorld.scenario.set(aliasSchoolAdminDriverNameByTenant(tenant), cms.driverName);
            const account = getSchoolAdminAccountWithTenant(tenant);

            return { cms, ...account };
        }
    }
}

export async function userLoginWithTenantToCMS(
    masterWorld: IMasterWorld,
    accountRole: AccountRoles,
    tenant: Tenant
) {
    const { cms, organization, username, password } = await getAccountWithTenantToLoginCMS(
        masterWorld,
        accountRole,
        tenant
    );

    await cms.instruction(
        `${accountRole} not login yet and go to login tenant page`,
        async function (cms: CMSInterface) {
            await aSchoolAdminOnLoginTenantPageCMS(cms);
        }
    );

    await cms.instruction(
        `${accountRole} fill userName: ${username} and password: ${password} to login form`,
        async function () {
            await fillTestAccountMultiTenantLoginInCMS(cms, { organization, username, password });
        }
    );

    await clickLoginButtonAndWaitForEndpoint(cms);

    await cms.instruction(`${accountRole} has successfully logged in`, async function () {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
}

export async function userLoginWithTenantToTeacherApp(
    masterWorld: IMasterWorld,
    accountRole: AccountRoles,
    tenant: Tenant
) {
    const teacher = getTeacherInterfaceFromRole(masterWorld, accountRole);

    const { organization, username, password } = await getTeacherAccountWithTenant(
        masterWorld,
        accountRole,
        tenant
    );

    await teacher.instruction(`${accountRole} not login yet, see login form`, async function () {
        await aTeacherAtHomeScreenTeacherWeb(teacher);
    });

    await teacher.instruction(
        `${accountRole} fill userName: ${username} and password: ${password} to login form`,
        async function () {
            await fillTestAccountLoginInTeacherWeb({ teacher, username, password, organization });
        }
    );

    await teacher.instruction(`${accountRole} logged in, see home page`, async function () {
        await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
    });
}

export async function userLoginWithTenantToTeacherAppWithAvailableAccount(
    masterWorld: IMasterWorld,
    accountRole: AccountRoles,
    tenant: Tenant
) {
    const teacher = getTeacherInterfaceFromRole(masterWorld, accountRole);

    const { name: username, password } = getUserProfileFromContext(
        masterWorld.scenario,
        staffProfileAliasWithAccountRoleSuffix(accountRole)
    );

    await teacher.instruction(`${accountRole} not login yet, see login form`, async function () {
        await aTeacherAtHomeScreenTeacherWeb(teacher);
    });

    await teacher.instruction(
        `${accountRole} fill userName: ${username} and password: ${password} to login form`,
        async function () {
            await fillTestAccountLoginInTeacherWeb({
                teacher,
                username,
                password,
                organization: tenantIdentifiers[tenant],
            });
        }
    );

    await teacher.instruction(`${accountRole} logged in, see home page`, async function () {
        await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
    });
}

export async function userLoginWithTenantToLearnerApp(
    masterWorld: IMasterWorld,
    accountRole: AccountRoles,
    tenant: Tenant
) {
    const learner = getLearnerInterfaceFromRole(masterWorld, accountRole);

    const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
        userAuthenticationLearnerRememberedAccount
    );

    const { organization, username, password } = await getLearnerAccountWithTenant(
        masterWorld,
        accountRole,
        tenant
    );

    if (!isEnabledRemoveRememberedAccount) {
        await learner.instruction(
            `${accountRole} not login yet, show auth multi screen`,
            async function () {
                await aLearnerAtAuthMultiScreenLearnerWeb(learner);
            }
        );
    }

    await learner.instruction(
        'Fill organization in auth search organization page',
        async function () {
            await fillOrganization(learner, organization);
        }
    );

    if (!isEnabledRemoveRememberedAccount) {
        await learner.instruction('Press add a new account button', async function () {
            //tap on add new account button
            const addANewAccountAccountButton = new ByValueKey(LearnerKeys.addANewAccountButton);
            await learner.flutterDriver!.tap(addANewAccountAccountButton);
        });
    }

    await fillEmailAndPassword(learner, username, password);

    await learner.instruction(
        `${accountRole} logged in, see welcome screen and press start button`,
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
        }
    );

    await learner.instruction(`${accountRole} see home page`, async function () {
        return await aLearnerAtHomeScreenLearnerWeb(learner);
    });
}
