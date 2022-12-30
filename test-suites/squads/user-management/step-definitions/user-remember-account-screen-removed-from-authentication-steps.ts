import { getProfileAliasToLoginsLearnerApp } from '@legacy-step-definitions/credential-account-definitions';
import { studentLoginsApp } from '@legacy-step-definitions/credential-account-steps';
import { convertOneOfStringTypeToArray, getRandomElement } from '@legacy-step-definitions/utils';
import { learnersProfileAlias, roleAlias } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    addLearnerToLearnerProfiles,
    getRole,
    goToLoginFromManageAccountScreen,
    goToManageAccountScreen,
    learnerOnMainLoginScreen,
    learnerOnManageAccountScreen,
    pressBackButtonLearnerApp,
    removeCachedUserByUserProfile,
    userInManageAccountScreen,
    userInSwitchAccountScreen,
    userNotInManageAccountScreen,
    userNotInSwitchAccountScreen,
} from './user-remember-account-screen-removed-from-authentication-definitions';

When(
    '{string} logins Learner App with one of role',
    async function (this: IMasterWorld, roles: string) {
        const list = convertOneOfStringTypeToArray<AccountRoles>(roles);
        const role = getRandomElement<AccountRoles>(list);
        const user = this.learner;
        this.scenario.set(roleAlias, role);

        await addLearnerToLearnerProfiles(this, role);
        await studentLoginsApp(this, role, user);
    }
);

When(
    'the current user has added {string} from Manage Account screen',
    async function (this: IMasterWorld, role: AccountRoles) {
        const user = this.learner;

        await user.instruction(
            `The current user adds ${role} from Manage Account Screen`,
            async function () {
                await goToLoginFromManageAccountScreen(user);
            }
        );
        await addLearnerToLearnerProfiles(this, role);
        await studentLoginsApp(this, role, user);
    }
);

When('{string} logs out of Learner App', async function (this: IMasterWorld, role1: AccountRoles) {
    const user = this.learner;
    await user.instruction(`${role1} logs out of Learner App`, async function () {
        await user.logout();
    });
});

Then(
    '{string} redirects to authentication login screen',
    async function (this: IMasterWorld, role1: AccountRoles) {
        const user = this.learner;

        await user.instruction(`${role1} is on authentication login screen`, async function () {
            await learnerOnMainLoginScreen(user);
        });
    }
);

When('the current user deletes all accounts', async function (this: IMasterWorld) {
    const user = this.learner;

    const profiles = this.scenario.get<UserProfileEntity[]>(learnersProfileAlias);
    await goToManageAccountScreen(user);

    // The logged in user would be the one last
    for (let i = 0; i < profiles.length; i++) {
        await removeCachedUserByUserProfile(user, profiles[i]);
    }
});

When('{string} deletes themselves', async function (this: IMasterWorld, role: AccountRoles) {
    const user = this.learner;
    const profile = getProfileAliasToLoginsLearnerApp(this, role);

    await user.instruction(`${role} deletes themselves`, async function () {
        await goToManageAccountScreen(user);
        await removeCachedUserByUserProfile(user, profile!);
    });
});

When(
    'the current user deleted account of {string}',
    async function (this: IMasterWorld, role: AccountRoles) {
        const user = this.learner;
        const roleToDelete: AccountRoles = getRole(this, role);
        const profile = getProfileAliasToLoginsLearnerApp(this, roleToDelete);

        await user.instruction(
            `the current user deletes the account of ${roleToDelete}`,
            async function () {
                await goToManageAccountScreen(user);
                await removeCachedUserByUserProfile(user, profile!);
            }
        );
    }
);

When(
    'the current user logs in as {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        await studentLoginsApp(this, role, this.learner);
    }
);

When('the current user goes to Manage Account Screen', async function (this: IMasterWorld) {
    await goToManageAccountScreen(this.learner);
});

Then(
    '{string} is on Manage Account Screen',
    async function (this: IMasterWorld, role: AccountRoles) {
        const user = this.learner;

        await user.instruction(`${role} is on the Manage Account Screen`, async function () {
            await learnerOnManageAccountScreen(user);
        });
    }
);

Then(
    'the current user does not see the account of {string} on Manage Account Screen and Switch Account Screen',
    async function (this: IMasterWorld, role: AccountRoles) {
        const self = this;
        const user = self.learner;
        const deletedRole: AccountRoles = getRole(self, role);

        await user.instruction(`${deletedRole} is not seen on Manage Screen`, async function () {
            await userNotInManageAccountScreen(self, deletedRole);
        });

        await pressBackButtonLearnerApp(user);

        await user.instruction(`${deletedRole} is not seen on Switch Screen`, async function () {
            await userNotInSwitchAccountScreen(self, deletedRole);
        });
    }
);

Then(
    '{string} sees their account and the account of {string} on the Switch Account and Manage Account screen',
    async function (this: IMasterWorld, role1: AccountRoles, role2: AccountRoles) {
        const self = this;
        const user = self.learner;
        const roles = [role1, role2];

        await goToManageAccountScreen(user);

        for (const role of roles) {
            await user.instruction(`${role} is seen on Manage Screen`, async function () {
                await userInManageAccountScreen(self, role);
            });
        }

        await pressBackButtonLearnerApp(user);

        for (const role of roles) {
            await user.instruction(`${role} is seen on Switch Screen`, async function () {
                await userInSwitchAccountScreen(self, role);
            });
        }
    }
);
