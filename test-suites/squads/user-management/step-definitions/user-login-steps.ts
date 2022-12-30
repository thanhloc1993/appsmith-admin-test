import { profileButtonSelector } from '@legacy-step-definitions/cms-selectors/appbar';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aLearnerAlreadyLoginFailedInLearnerWeb,
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtHomeScreenLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    aSchoolAdminOnCMSLoginPageAndSeeLoginForm,
    fillTestAccountLoginInCMS,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginFailedInTeacherWeb,
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    aTeacherAtHomeScreenTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { UserRole } from '@legacy-step-definitions/types/common';
import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';
import { staffProfileAlias } from '@user-common/alias-keys/user';

import { When, Then } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import {
    IMasterWorld,
    AccountRoles,
    LearnerInterface,
    TeacherInterface,
    CMSInterface,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { LoginStatus } from './common/types/student';
import { userAuthenticationMultiTenant } from './user-definition-utils';
import { getUserNameAndPassWordByAccountRoles } from './user-login-fail-definitions';
import {
    fillTestAccountMultiTenantLoginInCMS,
    getSchoolAdminAccount,
} from './user-multi-tenant-authentication-definitions';

When(
    'user logins by {string} account on Learner App',
    async function (this: IMasterWorld, role: UserRole) {
        const learner = getLearnerInterfaceFromRole(this, 'student');
        const { username, password } = await getUserNameAndPassWordByAccountRoles(
            this.scenario,
            role
        );

        await learner.instruction('Fill username, password in login page', async function () {
            await fillUserNameAndPasswordLearnerWeb({
                learner,
                username,
                password,
                isMultiTenantLogin: true,
            });
        });
    }
);

When(
    'user logins by {string} account on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = this.teacher;
        const { email, password } = this.scenario.get<UserProfileEntity>(staffProfileAlias);

        await teacher.instruction(`User ${role} not login yet, see login form`, async function () {
            await aTeacherAtHomeScreenTeacherWeb(teacher);
        });

        await teacher.instruction('Fill username, password in login page', async function () {
            await teacherEnterAccountInformation({
                teacher,
                username: email,
                password,
            });
        });
    }
);

When('user logins by {string} account on CMS', async function (this: IMasterWorld, role: UserRole) {
    await this.cms.instruction('User not login yet, see login form', async function (cms) {
        await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms);
    });

    const { username, password } = await getUserNameAndPassWordByAccountRoles(this.scenario, role);

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
});

Then(
    'user logins {string} on Learner App',
    async function (this: IMasterWorld, loginStatus: LoginStatus) {
        if (loginStatus === 'failed') {
            await this.learner.instruction(
                'Logged in failed, does not see home screen',
                async function (learner: LearnerInterface) {
                    await aLearnerAlreadyLoginFailedInLearnerWeb(learner);
                }
            );
        } else if (loginStatus === 'success') {
            await this.learner.instruction(
                `User logged in, see welcome screen and press start button`,
                async function (learner: LearnerInterface) {
                    await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
                }
            );

            await this.learner.instruction(
                `User sees home page`,
                async function (learner: LearnerInterface) {
                    return await aLearnerAtHomeScreenLearnerWeb(learner);
                }
            );
        }
    }
);

Then(
    'user logins {string} on Teacher App',
    async function (this: IMasterWorld, loginStatus: LoginStatus) {
        if (loginStatus === 'failed') {
            await this.teacher.instruction(
                'Logged in failed, does not see home screen',
                async function (teacher: TeacherInterface) {
                    await aTeacherAlreadyLoginFailedInTeacherWeb(teacher);
                }
            );
        } else if (loginStatus === 'success') {
            await this.teacher.instruction(
                'User login success, see home screen in Teacher Web',
                async function (teacher: TeacherInterface) {
                    await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
                }
            );
        }
    }
);

Then('user logins {string} on CMS', async function (this: IMasterWorld, loginStatus: LoginStatus) {
    const page = this.cms.page!;
    if (loginStatus === 'failed') {
        await this.cms.instruction(`User can't sees home page`, async () => {
            await page.waitForSelector(profileButtonSelector, {
                state: 'hidden',
            });
        });
    } else if (loginStatus === 'success') {
        await this.cms.instruction(
            'User login success, see home screen in CMS',
            async function (cms: CMSInterface) {
                await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
            }
        );
    }
});
