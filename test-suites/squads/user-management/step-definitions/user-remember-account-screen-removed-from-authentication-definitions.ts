import { LearnerKeys } from '@common/learner-key';
import { getProfileAliasToLoginsLearnerApp } from '@legacy-step-definitions/credential-account-definitions';
import {
    aLearnerAtAuthLoginScreenLearnerWeb,
    aLearnerAtAuthSearchOrganizationScreenLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import { learnersProfileAlias, roleAlias } from '@user-common/alias-keys/user';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { AccountRoles, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { openMenuPopupOnWeb, userAuthenticationMultiTenant } from './user-definition-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function goToLoginFromManageAccountScreen(user: LearnerInterface) {
    const driver = user.flutterDriver!;

    await goToManageAccountScreen(user);

    await user.instruction('Add new account', async function () {
        const addNewAccountButtonFinder = new ByValueKey(LearnerKeys.addANewAccountButton);
        await driver.tap(addNewAccountButtonFinder);
    });
}

export async function goToManageAccountScreen(user: LearnerInterface) {
    const driver = user.flutterDriver!;

    await goToSwitchAccountScreen(user);

    await user.instruction('Go to Manage Account Screen', async function () {
        const manageAccountButtonFinder = new ByValueKey(LearnerKeys.manageAccountButton);
        const manageAccountScreenFinder = new ByValueKey(LearnerKeys.manageAccountScreen);
        await driver.tap(manageAccountButtonFinder);
        await driver.waitFor(manageAccountScreenFinder);
    });
}

export async function goToSwitchAccountScreen(user: LearnerInterface) {
    const driver = user.flutterDriver!;

    await openMenuPopupOnWeb(user);

    await user.instruction('Select Switch Account in app drawer', async function () {
        const switchAccountDrawerFinder = new ByValueKey(LearnerKeys.switchAccountButton);
        const switchAccountScreenFinder = new ByValueKey(LearnerKeys.switchAccountScreen);
        await driver.tap(switchAccountDrawerFinder);
        await driver.waitFor(switchAccountScreenFinder);
    });
}

export async function learnerOnMainLoginScreen(user: LearnerInterface) {
    const isEnabledUserMultiTenant = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (!isEnabledUserMultiTenant) {
        await aLearnerAtAuthLoginScreenLearnerWeb(user);
    } else {
        await aLearnerAtAuthSearchOrganizationScreenLearnerWeb(user);
    }
}

export async function learnerOnManageAccountScreen(user: LearnerInterface) {
    const driver = user.flutterDriver!;
    const manageAccountScreenFinder = new ByValueKey(LearnerKeys.manageAccountScreen);
    await driver.waitFor(manageAccountScreenFinder);
}

/// To use this function, the user must be on the Manage Account Screen
export async function removeCachedUserByUserProfile(
    user: LearnerInterface,
    userProfile: UserProfileEntity
) {
    const driver = user.flutterDriver!;

    const name = userProfile.name;

    const optionButtonFinder = new ByValueKey(LearnerKeys.cachedUserOptionButton(name));
    const deleteOptionButtonFinder = new ByValueKey(LearnerKeys.cachedUserDeleteOptionButton(name));

    await driver.runUnsynchronized(async () => {
        await user.instruction(`Select Option on Account Tile User-${name} `, async function () {
            await driver.waitFor(optionButtonFinder, 100000);
            await driver.tap(optionButtonFinder);
        });
        await user.instruction(`Delete User-${name}`, async function () {
            await driver.waitFor(deleteOptionButtonFinder);
            await driver.tap(deleteOptionButtonFinder);
        });
    });
}

export async function addLearnerToLearnerProfiles(_this: IMasterWorld, role: AccountRoles) {
    const userProfile = getProfileAliasToLoginsLearnerApp(_this, role);
    let learners = _this.scenario.get<UserProfileEntity[]>(learnersProfileAlias);

    if (learners == null) {
        learners = [];
    }

    learners.push(userProfile!);
    _this.scenario.set(learnersProfileAlias, learners);
}

async function waitForUserKey(
    _this: IMasterWorld,
    role: AccountRoles,
    keyFunction: (name: string) => string,
    shouldUseWaitForAbsent: boolean
) {
    const user = _this.learner;
    const driver = user.flutterDriver!;
    const userProfile = getProfileAliasToLoginsLearnerApp(_this, role)!;
    const accountTileFinder = new ByValueKey(keyFunction(userProfile.name!));

    if (shouldUseWaitForAbsent) {
        await driver.waitForAbsent(accountTileFinder);
    } else {
        await driver.waitFor(accountTileFinder);
    }
}

export async function userNotInManageAccountScreen(_this: IMasterWorld, role: AccountRoles) {
    await waitForUserKey(_this, role, LearnerKeys.cachedUserOptionButton, true);
}

export async function userNotInSwitchAccountScreen(_this: IMasterWorld, role: AccountRoles) {
    await waitForUserKey(_this, role, LearnerKeys.user, true);
}

export async function userInManageAccountScreen(_this: IMasterWorld, role: AccountRoles) {
    await waitForUserKey(_this, role, LearnerKeys.cachedUserOptionButton, false);
}

export async function userInSwitchAccountScreen(_this: IMasterWorld, role: AccountRoles) {
    await waitForUserKey(_this, role, LearnerKeys.user, false);
}

export function getRole(_this: IMasterWorld, role: AccountRoles): AccountRoles {
    let selectedRole: AccountRoles;

    // Check if the user is a 1 of role
    const regex = new RegExp(/([^[]+(?=]))/g);
    const matched = regex.exec(role);

    // If the user is a one of role, get the previously selected value
    // from the scenario context's roleAlias.
    if (matched) {
        selectedRole = _this.scenario.get(roleAlias);
    } else {
        selectedRole = role;
    }

    return selectedRole;
}

export async function pressBackButtonLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Press back button on Learner App', async function () {
        const backButtonFinder = new ByValueKey(LearnerKeys.back_button);
        await driver.tap(backButtonFinder);
    });
}
