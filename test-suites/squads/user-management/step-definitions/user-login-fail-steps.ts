import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aLearnerAtAuthMultiScreenLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
    aLearnerAlreadyLoginFailedInLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import {
    aSchoolAdminOnCMSLoginPageAndSeeLoginForm,
    fillTestAccountLoginInCMS,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAtHomeScreenTeacherWeb,
    aTeacherAlreadyLoginFailedInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { When, Then, Given } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import {
    IMasterWorld,
    AccountRoles,
    LearnerInterface,
    TeacherInterface,
    CMSInterface,
} from '@supports/app-types';

import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from './user-definition-utils';
import {
    getUserNameAndPassWordByAccountRoles,
    aSchoolAdminClickOnProfileButton,
    aSchoolAdminClickLogoutButton,
} from './user-login-fail-definitions';
import {
    fillTestAccountMultiTenantLoginInCMS,
    getSchoolAdminAccount,
} from './user-multi-tenant-authentication-definitions';

When(
    'user logins by {string} account on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const { username, password } = await getUserNameAndPassWordByAccountRoles(
            this.scenario,
            role
        );

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );
        const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
            userAuthenticationLearnerRememberedAccount
        );

        if (!isEnabledMultiTenantLogin && !isEnabledRemoveRememberedAccount) {
            await learner.instruction(
                'User not login yet, show auth multi screen',
                async function () {
                    await aLearnerAtAuthMultiScreenLearnerWeb(learner);
                }
            );
        }

        await learner.instruction('Fill username, password in login page', async function () {
            await fillUserNameAndPasswordLearnerWeb({
                learner,
                username,
                password,
                isMultiTenantLogin: isEnabledMultiTenantLogin,
            });
        });
    }
);

When(
    'user logins by {string} account on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = this.teacher;
        const { username, password } = await getUserNameAndPassWordByAccountRoles(
            this.scenario,
            role
        );
        await teacher.instruction('User not login yet, see login form', async function () {
            await aTeacherAtHomeScreenTeacherWeb(teacher);
        });

        await teacher.instruction('Fill username, password in login page', async function () {
            await teacherEnterAccountInformation({
                teacher,
                username,
                password,
            });
        });
    }
);

When(
    'user logins by {string} account on CMS',
    async function (this: IMasterWorld, role: AccountRoles) {
        await this.cms.instruction('User not login yet, see login form', async function (cms) {
            await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms);
        });

        const { username, password } = await getUserNameAndPassWordByAccountRoles(
            this.scenario,
            role
        );

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        if (isEnabledMultiTenantLogin) {
            const { organization } = getSchoolAdminAccount({
                schoolName: 'school admin Tenant S1',
            });
            await this.cms.instruction(
                `Fill username ${username}, password ${password} and organization ${organization} in BO multi-tenant login page`,
                async function (cms) {
                    await fillTestAccountMultiTenantLoginInCMS(cms, {
                        username,
                        password,
                        organization,
                    });
                }
            );
        } else {
            await this.cms.instruction(
                `Fill username ${username}, password ${password} in BO login page`,
                async function (cms) {
                    await fillTestAccountLoginInCMS(cms, username, password);
                }
            );
        }

        await this.cms.page?.click(CMSKeys.submitButton);
    }
);

Then('user logins failed on Learner App', async function (this: IMasterWorld) {
    await this.learner.instruction(
        'Logged in failed, does not see home screen',
        async function (learner: LearnerInterface) {
            await aLearnerAlreadyLoginFailedInLearnerWeb(learner);
        }
    );
});

Then('user logins failed on Teacher App', async function (this: IMasterWorld) {
    await this.teacher.instruction(
        'Logged in failed, does not see home screen',
        async function (teacher: TeacherInterface) {
            await aTeacherAlreadyLoginFailedInTeacherWeb(teacher);
        }
    );
});

Then('user logins failed on CMS', async function (this: IMasterWorld) {
    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (isEnabledMultiTenantLogin) {
        await this.cms.instruction(
            `User sees msg: "Account information is incorrect. Please check again or contact Manabie staff"`,
            async () => {
                await this.cms.assertNotification(
                    'Account information is incorrect. Please check again or contact Manabie staff'
                );
            }
        );
    } else {
        await this.cms.instruction(
            `User sees msg: "You don't have permission. Your current role is not in allowed roles"`,
            async () => {
                await this.cms.assertNotification(
                    "You don't have permission. Your current role is not in allowed roles"
                );
            }
        );
    }
});

Given('school admin has logged out CMS', async function (this: IMasterWorld): Promise<void> {
    await this.cms.instruction('Click on dropdown', async function (cms: CMSInterface) {
        await aSchoolAdminClickOnProfileButton(cms);
    });

    await this.cms.instruction('Click on logout button', async function (cms: CMSInterface) {
        await aSchoolAdminClickLogoutButton(cms);
    });
});
