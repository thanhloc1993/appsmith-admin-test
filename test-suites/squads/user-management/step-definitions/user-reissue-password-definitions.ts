import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    loginLearnerAccountFailed,
    loginOnLearnerApp,
} from '@legacy-step-definitions/learner-email-login-definitions';
import { pick1stElement } from '@legacy-step-definitions/utils';
import {
    learnerProfileAlias,
    parentProfilesAlias,
    newPasswordAlias,
    learnerProfileAliasWithTenantAccountRoleSuffix,
    parentProfilesAliasWithTenantAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { buttonReIssuePassword } from '@user-common/cms-selectors/student';
import * as CSMStudentPageKeys from '@user-common/cms-selectors/students-page';
import { tabLayoutStudent } from '@user-common/cms-selectors/students-page';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, IMasterWorld, LearnerInterface, Tenant } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { ActionOptions, UserType } from '@supports/types/cms-types';

import { userAuthenticationMultiTenant } from './user-definition-utils';
import { getSchoolAdminAccount } from './user-multi-tenant-authentication-definitions';

export async function userPasswordIsReissued(world: IMasterWorld, userType: UserType) {
    const cms = world.cms;
    const scenario = world.scenario;

    await cms.instruction(
        `School admin sees email and new password of a ${userType} in dialog`,
        async function () {
            await cms.waitForDataTestId(CSMStudentPageKeys.accountEmailTypo);
            await cms.waitForDataTestId(CSMStudentPageKeys.accountPassTypo);
        }
    );

    const newPassword = await cms.getValueOfInput(
        `[data-testid="${CSMStudentPageKeys.accountPassTypo}"] input`
    );
    scenario.context.set(newPasswordAlias, newPassword);
}

export async function reIssuePasswordParent(cms: CMSInterface, userType: UserType) {
    await cms.instruction(`Click option button in a ${userType}`, async function () {
        const parentItem = await cms.page?.waitForSelector(CSMStudentPageKeys.dataTestIdParentItem);
        const options = await parentItem?.waitForSelector(CMSKeys.optionsButton);
        await options?.click();
    });

    await cms.instruction(`School admin re-issues password of a ${userType}`, async function () {
        await cms.page?.click(buttonReIssuePassword);
    });
}

export async function schoolAdminReIssuePassword(cms: CMSInterface, userType: UserType) {
    switch (userType) {
        case UserType.STUDENT:
            await cms.instruction(
                `School admin re-issues password of a ${userType}`,
                async function () {
                    await cms.selectActionButton(ActionOptions.RE_ISSUE_PASSWORD, {
                        target: 'actionPanelTrigger',
                    });
                }
            );
            break;

        case UserType.PARENT:
            await cms.selectTabButtonByText(tabLayoutStudent, 'Family');
            await reIssuePasswordParent(cms, userType);
            break;
    }
}

export async function userLoginLeanerAppWithPasswordType({
    world,
    userType,
    shouldLoginSuccess,
    tenant,
    passwordType,
}: {
    world: IMasterWorld;
    userType: UserType;
    shouldLoginSuccess: boolean;
    tenant?: Tenant;
    passwordType?: 'old password' | 'new password';
}) {
    const learnerAlias = tenant
        ? learnerProfileAliasWithTenantAccountRoleSuffix(`school admin Tenant S1`)
        : learnerProfileAlias;
    const parentAlias = tenant
        ? parentProfilesAliasWithTenantAccountRoleSuffix(`school admin Tenant S1`)
        : parentProfilesAlias;

    const student: CreateStudentResponseEntity['student'] =
        world.scenario.get<UserProfileEntity>(learnerAlias);
    const parents: CreateStudentResponseEntity['parents'] =
        world.scenario.get<UserProfileEntity[]>(parentAlias);
    const parent = pick1stElement(parents);

    let organization = '';
    if (tenant) {
        organization = getSchoolAdminAccount({
            schoolName: `school admin ${tenant}`,
        }).organization;
    }

    let email: string;
    let password: string;
    let user: LearnerInterface;
    let name: string;

    switch (userType) {
        case UserType.STUDENT:
            user = world.learner;
            email = student.email;
            password = student.password;
            name = student.name;
            break;
        case UserType.PARENT:
            user = world.parent;
            email = parent!.email;
            password = parent!.password;
            name = parent!.name;
            break;
    }

    const page = user.page;
    const currentUrl = page?.url();

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (isEnabledMultiTenantLogin && currentUrl?.split('#')[1] !== '/auth_search_organization') {
        await user.instruction('Go back to Auth Search Organization screen', async () => {
            await page?.goBack();
        });
    }

    if (passwordType === 'new password') {
        password = world.scenario.context.get(newPasswordAlias);
    }

    await user.instruction(
        `${userType} logins ${userType} app with email and old password`,
        async function () {
            if (!shouldLoginSuccess) {
                await loginLearnerAccountFailed({
                    learner: user,
                    email,
                    password,
                    organization,
                });
            } else {
                await loginOnLearnerApp({
                    learner: user,
                    email,
                    name,
                    password,
                    organization,
                });
            }
        }
    );
}

export async function schoolAdminClickReIssuePassword(cms: CMSInterface, userType: UserType) {
    switch (userType) {
        case UserType.STUDENT:
            await cms.instruction(
                `School admin declines re-issues password of a ${userType}`,
                async function () {
                    await cms.selectActionButton(ActionOptions.RE_ISSUE_PASSWORD, {
                        target: 'actionPanelTrigger',
                    });
                }
            );
            break;

        case UserType.PARENT:
            await cms.selectTabButtonByText(tabLayoutStudent, 'Family');
            await reIssuePasswordParent(cms, userType);
            break;
    }
}
