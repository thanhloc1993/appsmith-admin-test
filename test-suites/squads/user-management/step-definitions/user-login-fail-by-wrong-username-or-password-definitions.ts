import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aLearnerAtAuthMultiScreenLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import {
    aSchoolAdminOnCMSLoginPageAndSeeLoginForm,
    fillTestAccountLoginInCMS,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAtHomeScreenTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { getRandomNumber } from '@legacy-step-definitions/utils';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { LearnerInterface, TeacherInterface, CMSInterface } from '@supports/app-types';

import {
    getRandomOneOfArray,
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from './user-definition-utils';
import { UserAccount } from './user-login-fail-definitions';
import {
    fillTestAccountMultiTenantLoginInCMS,
    getSchoolAdminAccount,
} from './user-multi-tenant-authentication-definitions';

export async function loginCMSByUserNameAndPassWord(
    cms: CMSInterface,
    username: string,
    password: string
) {
    await cms.instruction('User not login yet, see login form', async function () {
        await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms);
    });

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (isEnabledMultiTenantLogin) {
        const { organization } = getSchoolAdminAccount({
            schoolName: 'school admin Tenant S1',
        });
        await cms.instruction(
            `Fill username ${username}, password ${password} and organization ${organization} in BO multi-tenant login page`,
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
            `Fill username ${username}, password ${password} in BO login page`,
            async function () {
                await fillTestAccountLoginInCMS(cms, username, password);
            }
        );
    }

    const isDisabledButton = await cms.page?.isDisabled(CMSKeys.submitButton);
    if (!isDisabledButton) {
        await cms.page?.click(CMSKeys.submitButton);
    }
}

export async function loginTeacherAppByUserNameAndPassWord(
    teacher: TeacherInterface,
    username: string,
    password: string
) {
    await teacher.instruction('User not login yet, see login form', async function () {
        await aTeacherAtHomeScreenTeacherWeb(teacher);
    });

    await teacher.instruction(
        `Fill username ${username}, password ${password} in login page`,
        async function () {
            await teacherEnterAccountInformation({
                teacher,
                username,
                password,
            });
        }
    );
}

export async function loginLearnerAppAppByUserNameAndPassWord(
    learner: LearnerInterface,
    username: string,
    password: string
) {
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

    await learner.instruction(
        `Fill username ${username}, password ${password} in login page`,
        async function () {
            await fillUserNameAndPasswordLearnerWeb({
                learner,
                username,
                password,
                isMultiTenantLogin: isEnabledMultiTenantLogin,
            });
        }
    );
}

export function getUserNameAndPassWordByInputType(inputType: string): UserAccount {
    const randomNumber = getRandomNumber();
    const _inputType = getRandomOneOfArray(inputType);

    if (_inputType === 'non-existed') {
        return { username: `hoangtu.le+account${randomNumber}@manabie.com`, password: 'password' };
    }

    if (_inputType === 'invalid') {
        return { username: 'invalid@gmail.com', password: 'password' };
    }

    return { username: '', password: '' };
}
