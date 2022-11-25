import {
    buttonByAriaLabel,
    saveButton,
    snackBarContainer,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { getRandomNumber, randomString } from '@legacy-step-definitions/utils';
import { userGroupProfileAlias } from '@user-common/alias-keys/user';
import {
    autoCompleteBaseInput,
    grantedRoleOption,
    userGroupUpsertName,
    userGroupUpsertTableLocation,
    userGroupUpsertTableRole,
} from '@user-common/cms-selectors/user-group';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import {
    addNewGrantedPermission,
    assertGrantedPermissionsOnDetailPage,
    clickMultipleTimes,
    createUserGroupData,
    schoolAdminCreateUserGroup,
    schoolAdminGoesToCreateUserGroupPage,
    schoolAdminSeesNewUserGroupOnCMS,
    UpsertUserGroupOptions,
    lastRowGrantedPermissionTableSelector,
    UserGroupTypes,
    assertGrantedPermissionsOnEditPage,
} from './user-create-user-group-definitions';
import {
    ResultsSelectedLocationType,
    Role,
    schoolAdminChecksLocationsForSwitchingGrantedRole,
    schoolAdminGoesToEditPage,
    schoolAdminEditGrantedLocationForTeacherRole,
    schoolAdminRemovesGrantedPermission,
    LocationAction,
    GrantedPermissionAmount,
} from './user-edit-user-group-definitions';

Given(
    'school admin has created a user group {string}',
    async function (this: IMasterWorld, options: UpsertUserGroupOptions) {
        const cms = this.cms!;
        const context = this.scenario;
        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

        await cms.instruction(
            `School admin creates a user group name ${options}`,
            async function () {
                const userGroupData = await createUserGroupData(cms, context, {
                    grantedPermissionsAmount: options === 'with granted permission' ? 2 : 0,
                    defaultRoles:
                        options === 'with granted permission' ? ['Teacher', 'School Admin'] : [],
                });
                await schoolAdminCreateUserGroup(cms, context, userGroupData);
            }
        );

        await cms.instruction(
            'School admin closes the added user group snackbar',
            async function () {
                const snackbar = cms.page!.locator(snackBarContainer);
                const closeBtn = snackbar.locator(buttonByAriaLabel('Close'));
                await closeBtn.click();
            }
        );
    }
);

When('school admin edits user group name', async function (this: IMasterWorld) {
    const cms = this.cms!;
    const context = this.scenario;
    const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);
    const newName = `e2e-userGroup.${getRandomNumber()}.${randomString(10)}`;

    await schoolAdminGoesToEditPage(cms, userGroupProfile);

    await cms.instruction(`school admin edits user group name to ${newName}`, async function () {
        await cms.page!.fill(userGroupUpsertName, newName);
    });

    await cms.instruction('school admin clicks Save button multiple times', async function () {
        await clickMultipleTimes(cms, saveButton);
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction('School admin closes the edited user group snackbar', async function () {
        const snackbar = cms.page!.locator(snackBarContainer);
        const closeBtn = snackbar.locator(buttonByAriaLabel('Close'));
        await closeBtn.click();
    });

    context.set(userGroupProfileAlias, { ...userGroupProfile, name: newName });
});

Then(
    'school admin sees the edited user group name {string} on CMS',
    async function (this: IMasterWorld, options: UpsertUserGroupOptions) {
        const cms = this.cms!;
        const context = this.scenario;
        await schoolAdminSeesNewUserGroupOnCMS(cms, context, options);
    }
);

When('school admin adds new granted permission to user group', async function (this: IMasterWorld) {
    const cms = this.cms!;
    const context = this.scenario;
    const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);
    const newUserGroupData = await createUserGroupData(cms, context);
    const grantedPermissions = newUserGroupData.grantedPermissions;

    await schoolAdminGoesToEditPage(cms, userGroupProfile);

    await cms.instruction('school admin adds granted permission', async function () {
        for (const grantedPermission of grantedPermissions) {
            const { role, locations } = grantedPermission;
            await addNewGrantedPermission(cms, context, role, locations);
        }
    });

    await cms.instruction('school admin clicks Save button multiple times', async function () {
        await clickMultipleTimes(cms, saveButton);
        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();
    });

    context.set(userGroupProfileAlias, {
        ...userGroupProfile,
        grantedPermissions,
    });
});

Then(
    'school admin sees newly granted permission is added to user group',
    async function (this: IMasterWorld) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);
        await cms.instruction(
            'school admin sees newly granted permissions is added in detail page',
            async function () {
                await assertGrantedPermissionsOnDetailPage(
                    cms,
                    userGroupProfile.grantedPermissions
                );
            }
        );
    }
);

Given(
    'school admin has created a user group with granted role {string}',
    async function (this: IMasterWorld, role: Role) {
        const cms = this.cms!;
        const context = this.scenario;
        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

        await cms.instruction(
            `School admin creates a user group with granted role ${role}`,
            async function () {
                const userGroupData = await createUserGroupData(cms, context, {
                    defaultRoles: [role === 'Teacher' ? 'Teacher' : 'School Admin'],
                });
                await schoolAdminCreateUserGroup(cms, context, userGroupData);
            }
        );
    }
);

When(
    'school admin changes granted role from {string} to {string}',
    async function (this: IMasterWorld, role1: Role, role2: Role) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);

        await schoolAdminGoesToEditPage(cms, userGroupProfile);

        const endRowTable = await lastRowGrantedPermissionTableSelector(cms);
        const roleField = endRowTable?.locator(userGroupUpsertTableRole);
        const locationField = endRowTable?.locator(userGroupUpsertTableLocation);

        await cms.instruction(
            'School admin tries to remove location chips by clearing text in location field',
            async function () {
                await locationField?.locator(autoCompleteBaseInput).focus();
                await cms.page!.keyboard.press('Backspace');
            }
        );

        await cms.instruction('School admins sees location chips still remain ', async function () {
            await assertGrantedPermissionsOnEditPage(cms, userGroupProfile.grantedPermissions);
        });

        await cms.instruction(
            `school admin changes granted role from ${role1} to ${role2}`,
            async function () {
                await roleField?.click();
                await cms.page?.locator(grantedRoleOption(role2)).click();
            }
        );
    }
);

Then(
    'school admin sees granted location of role {string} is {string}',
    async function (this: IMasterWorld, role: Role, result: ResultsSelectedLocationType) {
        const cms = this.cms!;
        const context = this.scenario;

        await cms.instruction(
            `School admin checks granted locations field for role ${role}`,
            async function () {
                await schoolAdminChecksLocationsForSwitchingGrantedRole(cms, context, result);
            }
        );
    }
);

When(
    'school admin {string} some locations for granted location of role {string}',
    async function (this: IMasterWorld, action: LocationAction, role: string) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);

        await schoolAdminGoesToEditPage(cms, userGroupProfile);

        await schoolAdminEditGrantedLocationForTeacherRole(cms, context, { action, role });
    }
);

Then(
    'school admin sees granted location of role {string} is updated',
    async function (this: IMasterWorld, _role: string) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);

        await cms.instruction(
            'school admin sees granted permission is updated in detail page',
            async function () {
                await assertGrantedPermissionsOnDetailPage(
                    cms,
                    userGroupProfile.grantedPermissions
                );
            }
        );
    }
);

When(
    'school admin removes {string} granted permission',
    async function (this: IMasterWorld, option: GrantedPermissionAmount) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);

        await schoolAdminGoesToEditPage(cms, userGroupProfile);

        await cms.instruction(
            `School admin removes ${option} granted permissions`,
            async function () {
                await schoolAdminRemovesGrantedPermission(cms, context, option);
            }
        );
    }
);

Then(
    'school admin sees {string} granted permission is removed on user group',
    async function (this: IMasterWorld, _option: GrantedPermissionAmount) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);

        await cms.instruction(
            'school admin sees granted permission is updated in detail page',
            async function () {
                await assertGrantedPermissionsOnDetailPage(
                    cms,
                    userGroupProfile.grantedPermissions
                );
            }
        );
    }
);

When(
    'school admin edit granted location of role {string}',
    async function (this: IMasterWorld, _role: string) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);

        await schoolAdminGoesToEditPage(cms, userGroupProfile);
    }
);
