import {
    learnerProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, When } from '@cucumber/cucumber';

import { FeatureFlagsConstants } from '@drivers/feature-flags/constants';
import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { IMasterWorld, AccountRoles, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    getTestAccountLoginInLearnerApp,
    getTestAccountOfStudentLoginInLearnerApp,
    getTestAccountLoginInTeacherApp,
    studentWithEnrolledStatusAndCourseLoginLearnerApp,
    aSchoolAdminLoginAsNormalInCMS,
} from './credential-account-definitions';
import {
    aLearnerAtAuthMultiScreenLearnerWeb,
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtHomeScreenLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
} from './learner-email-login-definitions';
import {
    aTeacherAtHomeScreenTeacherWeb,
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    teacherEnterAccountInformation,
} from './teacher-email-login-definitions';
import {
    getTeacherInterfaceFromRole,
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
    getUserProfileFromContext,
} from './utils';
import { schoolAdminRegisterFirstGrantedLocation } from 'test-suites/squads/architecture/step-definitions/architecture-auto-select-first-granted-location-definitions';
import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { aSchoolAdminLoginAsTenantInCMS } from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

Given(
    '{string} logins CMS',
    { timeout: 300000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const allowListRole: AccountRoles[] = [
            'school admin',
            'school admin 1',
            'school admin 2',
            'teacher',
        ];
        if (!allowListRole.includes(role)) {
            throw new Error('we do not allow create other role');
        }

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        if (isEnabledMultiTenantLogin) {
            /// This function already had instruction inside
            await aSchoolAdminLoginAsTenantInCMS({ masterWorld: this, role });
        } else {
            /// This function already had instruction inside
            await aSchoolAdminLoginAsNormalInCMS(this, role);
        }

        await schoolAdminRegisterFirstGrantedLocation(this, role);
    }
);

Given('{string} logins Unleash Admin', async function (this: IMasterWorld, role: AccountRoles) {
    if (role !== 'unleash admin') throw new Error('we do not allow create other role');

    await this.unleashAdmin.instruction(
        'Login with unleash admin account',
        async function (unleash) {
            await unleash.page?.waitForSelector('text=Login to continue the great work');
            await unleash.page?.click('input[name="username"]');
            await unleash.page?.fill(
                'input[name="username"]',
                FeatureFlagsConstants.unleashUsername() || ''
            );
            await unleash.page?.click('input[name="password"]');
            await unleash.page?.fill(
                'input[name="password"]',
                FeatureFlagsConstants.unleashPassword() || ''
            );
            await unleash.page?.locator('[data-test="LOGIN_BUTTON"]').click();
        }
    );
});

Given('{string} logins Teacher App', { timeout: 100000 }, async function (role: AccountRoles) {
    await teacherLoginsApp(this, role);
});

Given(
    '{string} login Teacher App',
    { timeout: 200000 },
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);

        for (const teacherRole of teacherRoles) {
            await teacherLoginsApp(this, teacherRole);
        }
    }
);

async function teacherLoginsApp(_this: IMasterWorld, role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(_this, role);

    await teacher.instruction('User not login yet, see login form', async function () {
        await aTeacherAtHomeScreenTeacherWeb(teacher);
    });

    await teacher.instruction('Fill username, password in login page', async function () {
        await getTestAccountLoginInTeacherApp(_this, teacher, role);
    });

    await teacher.instruction('Logged in, see home page', async function () {
        await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
    });
}

Given('{string} logins Learner App', { timeout: 100000 }, async function (role: AccountRoles) {
    await studentLoginsApp(this, role);
});

Given(
    '{string} login Learner App',
    { timeout: 200000 },
    async function (this: IMasterWorld, roles: string) {
        const studentRoles = splitRolesStringToAccountRoles(roles);

        for (const studentRole of studentRoles) {
            await studentLoginsApp(this, studentRole);
        }
    }
);

export type StudentNeverLoggedInAction = 'logins' | 'does not login';

When(
    'newly created student {string} on Learner App',
    { timeout: 200000 },
    async function (this: IMasterWorld, studentNeverLoggedInAction: StudentNeverLoggedInAction) {
        const learner = this.learner;
        const scenario = this.scenario;
        const learnerProfile = scenario.get<UserProfileEntity>(learnerProfileAlias);

        const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
            userAuthenticationLearnerRememberedAccount
        );
        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        if (!isEnabledMultiTenantLogin && !isEnabledRemoveRememberedAccount) {
            await learner.instruction(
                'User not login yet, show auth multi screen',
                async function () {
                    await aLearnerAtAuthMultiScreenLearnerWeb(learner);
                }
            );
        }

        if (studentNeverLoggedInAction === 'logins') {
            await learner.instruction('Fill username, password in login page', async function () {
                await fillUserNameAndPasswordLearnerWeb({
                    learner,
                    username: learnerProfile.email,
                    password: learnerProfile.password,
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
    }
);

Given(
    '{string} of {string} logins Learner App',
    { timeout: 100000 },
    async function (role: AccountRoles, learnerRole: AccountRoles) {
        if (role.includes('parent')) {
            await parentOfStudentLoginsApp(this, role, learnerRole);
        } else {
            await studentLoginsApp(this, role);
        }
    }
);

export async function studentLoginsApp(
    _this: IMasterWorld,
    role: AccountRoles,
    defaultLearner?: LearnerInterface
) {
    const learner = defaultLearner ?? getLearnerInterfaceFromRole(_this, role);
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
        await getTestAccountLoginInLearnerApp(_this, learner, role);
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

async function parentOfStudentLoginsApp(
    _this: IMasterWorld,
    role: AccountRoles,
    learnerRole: AccountRoles
) {
    const learner = getLearnerInterfaceFromRole(_this, role);

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
        await getTestAccountOfStudentLoginInLearnerApp(_this, learner, role, learnerRole);
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

Given(
    '{string} has logged Teacher App with available account',
    async function (this: IMasterWorld, role: AccountRoles) {
        const context = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);
        const { name, password } = getUserProfileFromContext(
            context,
            staffProfileAliasWithAccountRoleSuffix(role)
        );

        await teacher.instruction('User not login yet, see login form', async function () {
            await aTeacherAtHomeScreenTeacherWeb(teacher);
        });

        /// This function already had instruction inside
        await teacherEnterAccountInformation({
            teacher,
            username: name,
            password,
        });

        await teacher.instruction('Logged in, see home page', async function () {
            await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
        });
    }
);

Given(
    '{string} with course and enrolled status has logged Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        await studentWithEnrolledStatusAndCourseLoginLearnerApp(this, role);
    }
);

Given(
    '{string} with course and enrolled status have logged Learner App',
    async function (this: IMasterWorld, roles: string) {
        const learnerRoles = splitRolesStringToAccountRoles(roles);

        for (const role of learnerRoles) {
            await studentWithEnrolledStatusAndCourseLoginLearnerApp(this, role);
        }
    }
);

When(
    '{string} logins again on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const context = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);
        const { name, password } = getUserProfileFromContext(
            context,
            staffProfileAliasWithAccountRoleSuffix(role)
        );

        await teacher.instruction('User not login yet, see login form', async function () {
            await aTeacherAtHomeScreenTeacherWeb(teacher);
        });

        /// This function already had instruction inside
        await teacherEnterAccountInformation({
            teacher,
            username: name,
            password,
        });

        await teacher.instruction('Logged in, see home page', async function () {
            await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
        });
    }
);
