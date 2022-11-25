import { saveButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { UserRole } from '@legacy-step-definitions/types/common';
import {
    selectedRoleListAlias,
    userGroupGrantedRoleList,
    userGroupProfileAlias,
    userGroupsDataAlias,
} from '@user-common/alias-keys/user';
import { userGroupListName } from '@user-common/cms-selectors/user-group';

import { When, Then, DataTable, Given } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import {
    createUserGroupData,
    GrantedRoleTable,
    schoolAdminCreateUserGroup,
    schoolAdminCreateUserGroups,
    schoolAdminGoesToCreateUserGroupPage,
    schoolAdminSeesNewUserGroupOnCMS,
    UpsertUserGroupOptions,
    UserGroupFormType,
    UserGroupTypeAlias,
    UserGroupTypes,
} from './user-create-user-group-definitions';

When(
    'school admin creates a user group {string}',
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
                const userGroupData = await createUserGroupData(cms, context);
                await schoolAdminCreateUserGroup(cms, context, userGroupData);
            }
        );
    }
);

Then(
    'school admin sees newly created user group {string} on CMS',
    async function (this: IMasterWorld, options: UpsertUserGroupOptions) {
        const cms = this.cms!;
        const context = this.scenario;
        await schoolAdminSeesNewUserGroupOnCMS(cms, context, options);
    }
);

When(
    'school admin creates a user group with missing required fields',
    async function (this: IMasterWorld) {
        const cms = this.cms!;
        const context = this.scenario;
        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

        await cms.instruction(`School admin clicks save button`, async function () {
            const saveBtn = cms.page!.locator(saveButton);
            await saveBtn.click();
        });

        context.set(userGroupProfileAlias, {
            name: '',
            grantedPermissions: [],
        });
    }
);

Then(
    'school admin sees the error message {string}',
    async function (this: IMasterWorld, messages: string) {
        const cms = this.cms!;
        const messageList = messages.split('and');
        await cms.instruction(`school admin sees message "${messages}"`, async () => {
            for (const message of messageList) {
                if (message.trim() === 'This field is required')
                    await cms.assertTypographyWithTooltip('p', message.trim());
                else
                    await cms.page!.waitForSelector(`[role='alert']:has-text("${message.trim()}")`);
            }
        });
    }
);

Then('school admin can not create a user group', async function (this: IMasterWorld) {
    const cms = this.cms!;
    const context = this.scenario;
    await cms.instruction(
        `School admin goes back User Group list page using cancel button`,
        async () => {
            await cms.selectAButtonByAriaLabel('Cancel');
            await cms.selectAButtonByAriaLabel('Leave');
        }
    );
    await cms.instruction(
        `School admin checks the staff does not exist in the staff list`,
        async function () {
            const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);
            await cms.page!.waitForSelector(
                `${userGroupListName}:text-is("${userGroupProfile.name}")`,
                {
                    state: 'hidden',
                }
            );
        }
    );
});

When(
    'school admin creates a user group with missing granted permission required fields',
    async function (this: IMasterWorld, data: DataTable) {
        const cms = this.cms!;
        const context = this.scenario;
        const userGroupFormType: UserGroupFormType[] = data.hashes();
        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

        await cms.instruction(
            `School admin creates a user group with missing required fields`,
            async function () {
                const { name, grantedRole, grantedLocations } = userGroupFormType[0];
                const userGroupData = await createUserGroupData(cms, context, {
                    defaultRoles: ['Teacher'],
                });
                Object.assign(userGroupData, {
                    name: name === 'empty' ? '' : userGroupData.name,
                    grantedPermissions: [
                        {
                            role:
                                grantedRole === 'empty'
                                    ? ''
                                    : userGroupData.grantedPermissions[0].role,
                            locations:
                                grantedLocations === 'empty'
                                    ? []
                                    : userGroupData.grantedPermissions[0].locations,
                        },
                    ],
                });
                await schoolAdminCreateUserGroup(cms, context, userGroupData);
            }
        );
    }
);

Given(
    'school admin has created {string} user groups with granted permission',
    { timeout: 5 * 60 * 1000 }, // 5 minutes
    async function (this: IMasterWorld, numberOfUserGroups: string) {
        const numOfUserGroups = Number(numberOfUserGroups);
        const cms = this.cms!;
        const context = this.scenario;

        await cms.instruction(
            `School admin creates ${numberOfUserGroups} user group with granted permission`,
            async function () {
                await schoolAdminCreateUserGroups(cms, context, numOfUserGroups);
            }
        );
    }
);

Given(
    'school admin has created a user group with role',
    async function (this: IMasterWorld, rolesTable: DataTable) {
        const cms = this.cms!;
        const context = this.scenario;

        const grantedRoles: GrantedRoleTable[] = rolesTable.hashes();

        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        const userGroupGrantedRoles: UserGroupTypeAlias[] = [];
        const userGroupsData: UserGroupTypes[] = [];
        for (const grantedRole of grantedRoles) {
            await cms.instruction(
                'School admin goes to the create user group page',
                async function () {
                    await schoolAdminGoesToCreateUserGroupPage(cms, context);
                }
            );

            await cms.instruction(
                `School admin creates one user group with role ${grantedRole.role}`,
                async function createUserGroupWithGrantedRole() {
                    const areBothRoles = grantedRole.role === 'Both roles';

                    const userGroupData = await createUserGroupData(cms, context, {
                        grantedPermissionsAmount: 1,
                        defaultRoles: areBothRoles
                            ? [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]
                            : [grantedRole.role],
                    });
                    userGroupGrantedRoles.push({
                        name: userGroupData.name,
                        grantedRole: grantedRole.role,
                    });
                    userGroupsData.push(userGroupData);

                    await schoolAdminCreateUserGroup(cms, context, userGroupData);
                }
            );
            context.set(selectedRoleListAlias, []);
            context.set(userGroupGrantedRoleList, userGroupGrantedRoles);
        }
        context.set(userGroupsDataAlias, userGroupsData);
    }
);
