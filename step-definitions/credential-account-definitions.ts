import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { loginTenantFormRedirectLoginNormal } from '@user-common/cms-selectors/students-page';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import {
    AccountRoles,
    CMSInterface,
    LearnerInterface,
    SchoolAdminRolesWithTenant,
    TeacherInterface,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { IMasterWorld } from './../supports/app-types';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtAuthMultiScreenLearnerWeb,
    aLearnerAtHomeScreenLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
} from './learner-email-login-definitions';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    aSchoolAdminOnLoginPageCMS,
    clickLoginButtonAndWaitForEndpoint,
    fillTestAccountLoginInCMS,
} from './school-admin-email-login-definitions';
import { teacherEnterAccountInformation } from './teacher-email-login-definitions';
import {
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
    getUserProfilesFromContext,
    pick1stElement,
} from './utils';
import { createSampleStudentWithCourseAndEnrolledStatus } from 'step-definitions/lesson-management-utils';
import { createStudentWithParent } from 'test-suites/squads/communication/step-definitions/communication-search-chat-group-definitions';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';
import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import {
    getAccountToLoginCMSMultiTenant,
    getTenantSchoolAdminSequence,
} from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

interface CMSAccountReturn {
    username: UserProfileEntity['name'];
    password: UserProfileEntity['password'];
    cms: CMSInterface;
}

export async function getAccountToLoginCMS(
    masterWorld: IMasterWorld,
    role: AccountRoles
): Promise<CMSAccountReturn> {
    // Teachers can only login if the school admin is already logged in
    if (role === 'teacher') {
        const account: UserProfileEntity = await createARandomStaffFromGRPC(masterWorld.cms);
        masterWorld.scenario.set(staffProfileAliasWithAccountRoleSuffix(role), account);

        // return random teacher account
        return {
            username: account.email,
            password: account.password,
            cms: masterWorld.cms2,
        };
    }

    if (role === 'school admin 2') {
        return {
            ...getTenantSchoolAdminSequence(),
            cms: masterWorld.cms2,
        };
    }

    // return school admin account
    return {
        ...getTenantSchoolAdminSequence(),
        cms: masterWorld.cms,
    };
}

export async function getTestAccountLoginInTeacherApp(
    _this: IMasterWorld,
    teacher: TeacherInterface,
    role: AccountRoles
) {
    const cms = _this.cms;
    await cms.attach(`Create a teacher ${role} to prepare for login`);

    const account: UserProfileEntity = await createARandomStaffFromGRPC(cms);
    _this.scenario.set(staffProfileAliasWithAccountRoleSuffix(role), account);

    /// This function already had instruction inside
    await teacherEnterAccountInformation({
        teacher,
        username: account.email,
        password: account.password,
    });
}

export function getProfileAliasToLoginsLearnerApp(_this: IMasterWorld, role: AccountRoles) {
    const isParent = role.includes('parent');

    const getAliasName = isParent
        ? parentProfilesAliasWithAccountRoleSuffix
        : learnerProfileAliasWithAccountRoleSuffix;

    const aliasName = getAliasName(role);

    const user = isParent
        ? pick1stElement(getUserProfilesFromContext(_this.scenario, aliasName))
        : getUserProfileFromContext(_this.scenario, aliasName);

    return user;
}

export async function getTestAccountLoginInLearnerApp(
    _this: IMasterWorld,
    learner: LearnerInterface,
    role: AccountRoles
) {
    // in user squads, they must to create student with different input values like course, parent
    // so they can create by another script before call this func
    let user = getProfileAliasToLoginsLearnerApp(_this, role);
    if (!user) {
        await createStudentWithParent(_this.cms, _this.scenario, role);
    }

    user = getProfileAliasToLoginsLearnerApp(_this, role);

    weExpect(user, `${role} to login`).toBeDefined();

    await fillUserNameAndPasswordLearnerWeb({
        learner,
        username: user!.email,
        password: user!.password,
    });
}

export function getAccountProfileAliasOfStudent(
    _this: IMasterWorld,
    accountRole: AccountRoles,
    studentRole: AccountRoles
) {
    const isParent = accountRole.includes('parent');

    const user = isParent
        ? getParentProfileOfLearner(_this, accountRole, studentRole)
        : getUserProfileFromContext(
              _this.scenario,
              learnerProfileAliasWithAccountRoleSuffix(studentRole)
          );

    return user;
}

function getParentProfileOfLearner(
    _this: IMasterWorld,
    parentRole: AccountRoles,
    studentRole: AccountRoles
) {
    const aliasKey = parentProfilesAliasWithAccountRoleSuffix(studentRole);
    const profiles = getUserProfilesFromContext(_this.scenario, aliasKey);
    // This case for multi parent of student S1 login learner app
    if (
        parentRole === 'parent P2' &&
        (studentRole === 'student S1' || studentRole === 'student') &&
        Array.isArray(profiles) &&
        profiles.length >= 2
    ) {
        return profiles[1];
    }

    return pick1stElement(profiles);
}

export async function getTestAccountOfStudentLoginInLearnerApp(
    _this: IMasterWorld,
    learner: LearnerInterface,
    accountRole: AccountRoles,
    studentRole: AccountRoles
) {
    // in user squads, they must to create student with different input values like course, parent
    // so they can create by another script before call this func
    let user = getAccountProfileAliasOfStudent(_this, accountRole, studentRole);
    if (!user) {
        await createStudentWithParent(_this.cms, _this.scenario, accountRole);
    }

    user = getAccountProfileAliasOfStudent(_this, accountRole, studentRole);

    weExpect(user, `${accountRole} to login`).toBeDefined();

    await fillUserNameAndPasswordLearnerWeb({
        learner,
        username: user!.name,
        password: user!.password,
    });
}

export async function studentWithEnrolledStatusAndCourseLoginLearnerApp(
    masterWorld: IMasterWorld,
    role: AccountRoles
) {
    const { cms, scenario } = masterWorld;
    const learner = getLearnerInterfaceFromRole(masterWorld, role);

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
        userAuthenticationLearnerRememberedAccount
    );

    if (!isEnabledMultiTenantLogin && !isEnabledRemoveRememberedAccount) {
        await learner.instruction('User not login yet, show auth multi screen', async function () {
            await aLearnerAtAuthMultiScreenLearnerWeb(learner);
        });
    }

    await learner.instruction('Fill username, password in login page', async function () {
        const { student } = await createSampleStudentWithCourseAndEnrolledStatus({
            cms,
            scenarioContext: scenario,
            studentRole: role,
        });

        await fillUserNameAndPasswordLearnerWeb({
            learner,
            username: student.name,
            password: student.password,
            isMultiTenantLogin: isEnabledMultiTenantLogin,
        });
    });

    await learner.instruction(
        'Logged in, see welcome screen and press start button',
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
        }
    );

    await learner.instruction('See home page', async function () {
        return await aLearnerAtHomeScreenLearnerWeb(learner);
    });
}

export async function aSchoolAdminLoginAsNormalInCMS(
    masterWorld: IMasterWorld,
    role: AccountRoles | SchoolAdminRolesWithTenant
) {
    let username = '',
        password = '';
    let cms: CMSInterface;

    if (role == 'school admin Tenant S1' || role == 'school admin Tenant S2') {
        const response = await getAccountToLoginCMSMultiTenant({
            masterWorld,
            role,
            tenant: role == 'school admin Tenant S1' ? 'Tenant S1' : 'Tenant S2',
        });
        username = response.username;
        password = response.password;
        cms = response.cms;
    } else {
        const response = await getAccountToLoginCMS(masterWorld, role);
        username = response.username;
        password = response.password;
        cms = response.cms;
    }

    await cms.instruction('User not login yet, see login form', async function () {
        await aSchoolAdminOnLoginPageCMS(cms);
    });

    await cms.instruction(
        `Fill username ${username}, password ${password} in BO login page`,
        async function () {
            await fillTestAccountLoginInCMS(cms, username, password);
        }
    );
    await clickLoginButtonAndWaitForEndpoint(cms);
    await cms.waitingForLoadingIcon();

    await cms.instruction('Logged in, see home page', async function () {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
}

export async function aSchoolAdminGoToLoginNormalPageCMS(cms: CMSInterface): Promise<void> {
    await cms.instruction('User goes to login page', async function () {
        const directUrlLoginNormalPage = await cms.page!.waitForSelector(
            loginTenantFormRedirectLoginNormal
        );

        await directUrlLoginNormalPage.click();
    });
}
