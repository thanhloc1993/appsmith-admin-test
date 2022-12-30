import { ElementHandle } from 'playwright';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface } from '@supports/app-types';

import { profileButtonSelector } from './cms-selectors/appbar';
import {
    loginCardContent,
    loginFormTextFieldPassword,
    loginFormTextFieldUsername,
    multiTenantLoginButton,
} from './cms-selectors/cms-keys';
import {
    userAuthenticationApplyNewGetBasicProfileAPI,
    userAuthenticationMultiTenant,
    userStaffManagementBackOfficeValidationLoginForNewUserGroup,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { aSchoolAdminOnLoginTenantPageCMS } from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

/**
 *
 * @param cmsWorld `CMSInterface`
 * @param state 'visible' | 'attached' | 'hidden' | undefined
 * @returns Promise<ElementHandle<SVGElement | HTMLElement> | null>
 */
async function findProfileButton(
    world: CMSInterface,
    state?: 'visible' | 'attached' | 'hidden'
): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    return await world.page!.waitForSelector(profileButtonSelector, {
        state,
    });
}
export async function clickLoginButtonAndWaitForEndpoint(cms: CMSInterface) {
    const isApplyNewGetBasicProfileAPI = await featureFlagsHelper.isEnabled(
        userAuthenticationApplyNewGetBasicProfileAPI
    );
    const isEnabledValidationLoginForNewUserGroup = await featureFlagsHelper.isEnabled(
        userStaffManagementBackOfficeValidationLoginForNewUserGroup
    );

    return await Promise.all([
        interceptExchangeTokenResponse(cms),
        interceptValidateUserGroupResponse(cms, isEnabledValidationLoginForNewUserGroup),
        interceptGetBasicProfileResponse(cms, isApplyNewGetBasicProfileAPI), //recently we almost fail at this step
        cms.page?.click('button[type="submit"]'),
    ]);
}

export async function clickLoginButtonAndWaitForEndpointInMultiTenant(cms: CMSInterface) {
    const isApplyNewGetBasicProfileAPI = await featureFlagsHelper.isEnabled(
        userAuthenticationApplyNewGetBasicProfileAPI
    );
    const isEnabledValidationLoginForNewUserGroup = await featureFlagsHelper.isEnabled(
        userStaffManagementBackOfficeValidationLoginForNewUserGroup
    );

    return await Promise.all([
        cms.waitForHasuraResponse('Users_OrganizationsManyReference'),
        interceptExchangeTokenResponse(cms),
        interceptValidateUserGroupResponse(cms, isEnabledValidationLoginForNewUserGroup),
        interceptGetBasicProfileResponse(cms, isApplyNewGetBasicProfileAPI), //recently we almost fail at this step
        cms.selectElementByDataTestId(multiTenantLoginButton),
    ]);
}

export function interceptExchangeTokenResponse(cms: CMSInterface) {
    return cms.waitForGRPCResponse('bob.v1.UserModifierService/ExchangeToken');
}

export function interceptGetBasicProfileResponse(cms: CMSInterface, isNewEndPoint?: boolean) {
    const endpoint = isNewEndPoint
        ? 'usermgmt.v2.UserReaderService/GetBasicProfile'
        : 'manabie.yasuo.UserService/GetBasicProfile';
    return cms.waitForGRPCResponse(endpoint);
}

export function interceptValidateUserGroupResponse(
    cms: CMSInterface,
    isValidateUserGroup?: boolean
) {
    if (!isValidateUserGroup) return Promise.resolve();

    return cms.waitForGRPCResponse('usermgmt.v2.UserGroupMgmtService/ValidateUserLogin');
}

export async function fillTestAccountLoginInCMS(
    cms: CMSInterface,
    username: string,
    password: string
): Promise<void> {
    await cms.page?.fill(loginFormTextFieldUsername, username);
    await cms.page?.fill(loginFormTextFieldPassword, password);
}

export async function aSchoolAdminOnLoginPageCMS(cms: CMSInterface): Promise<void> {
    await cms.page!.waitForSelector(loginCardContent);

    await findProfileButton(cms, 'hidden');
}

export async function aSchoolAdminAlreadyLoginSuccessInCMS(cms: CMSInterface): Promise<void> {
    await findProfileButton(cms, 'attached');

    // add token into interceptor
    await addTokenToGraphqlInterceptorWhenLoginsCMS(cms);
}

// add token into interceptor
export async function addTokenToGraphqlInterceptorWhenLoginsCMS(cms: CMSInterface): Promise<void> {
    const token = await cms.getToken();
    await cms.graphqlClient?.appendAuthHeader(token);
}

export async function aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms: CMSInterface): Promise<void> {
    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );
    if (isEnabledMultiTenantLogin) {
        await aSchoolAdminOnLoginTenantPageCMS(cms);
    } else {
        await aSchoolAdminOnLoginPageCMS(cms);
    }
}
