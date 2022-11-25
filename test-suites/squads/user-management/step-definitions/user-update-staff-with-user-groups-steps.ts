import { delay, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import {
    currentUserGroupsAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { userGroupMemberValue } from '@user-common/cms-selectors/staff';

import { Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';

import {
    goToEditStaffPage,
    goToStaffPageAndChangeRowsPerPage,
} from './user-update-staff-definitions';
import {
    assertNewUserGroupsOnStaffList,
    assertUserGroupOnStaffList,
    editStaffAddsUserGroups,
    editStaffRemovesUserGroups,
} from './user-update-staff-with-user-groups-definitions';

When(
    'school admin removes {int} user group by using X button on {string}',
    async function (this: IMasterWorld, numberOfUserGroups: number, option: string) {
        const scenario = this.scenario;
        const cms = this.cms;
        const page = cms.page!;

        await cms.instruction('school admin goes to edit staff page', async function () {
            await goToEditStaffPage(cms, scenario);
        });

        await cms.instruction(
            `school admin removes ${numberOfUserGroups} user group by using X button on ${option}`,
            async function () {
                const userGroupsListField = page.getByLabel('User Group');
                await userGroupsListField.click();
                await editStaffRemovesUserGroups(cms, scenario, numberOfUserGroups, option);
            }
        );
    }
);

Then(
    'school admin {string} remaining user group displays on Staff Details',
    async function (this: IMasterWorld, schoolAdminExpect: string) {
        const context = this.scenario;
        const cms = this.cms;

        await delay(3000); // User group update is a bit late
        await cms.instruction(
            `school admin ${schoolAdminExpect} remaining user group displays on Staff Details`,
            async function () {
                const userGroupsOnStaffDetail = await cms.page
                    ?.locator(userGroupMemberValue)
                    .getByText(
                        schoolAdminExpect === 'sees' ? context.get(currentUserGroupsAlias) : '--'
                    );

                weExpect(userGroupsOnStaffDetail).toBeTruthy();
            }
        );
    }
);

Then(
    'school admin {string} remaining user group displays on Staff Management',
    async function (this: IMasterWorld, observe: string) {
        const scenario = this.scenario;
        const cms = this.cms;

        await cms.instruction(
            'School admin goes to staff page and changes rows per page',
            async function () {
                await goToStaffPageAndChangeRowsPerPage(cms, '50');
            }
        );

        await cms.instruction(
            `school admin ${observe} remaining user group`,
            async function (this: CMSInterface) {
                const staff = getUserProfileFromContext(
                    scenario,
                    staffProfileAliasWithAccountRoleSuffix('teacher')
                );

                await assertUserGroupOnStaffList(this, scenario, observe, staff);
            }
        );
    }
);

When(
    'school admin adds {int} user groups',
    async function (this: IMasterWorld, numberOfUserGroups: number) {
        const scenario = this.scenario;
        const cms = this.cms;
        const page = cms.page!;

        await cms.instruction('school admin goes to edit staff page', async function () {
            await goToEditStaffPage(cms, scenario);
        });

        await cms.instruction(
            `school admin adds ${numberOfUserGroups} user groups`,
            async function () {
                const userGroupsListField = page.getByLabel('User Group');
                await userGroupsListField.click();
                await editStaffAddsUserGroups(cms, scenario, numberOfUserGroups);
            }
        );
    }
);

Then(
    'school admin sees newly added user groups displays along with existing ones on Staff Details',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const context = this.scenario;

        await delay(3000);
        await cms.instruction('School admin see newly added user groups', async function () {
            const userGroupsOnStaffDetail = await cms.page
                ?.locator(userGroupMemberValue)
                .textContent();
            const userGroupNames = context.get(currentUserGroupsAlias);

            weExpect(userGroupsOnStaffDetail?.length).toBe(userGroupNames.length);
        });
    }
);

Then(
    'school admin sees newly added user groups displays along with existing ones on Staff Management',
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const cms = this.cms;

        await cms.instruction(
            'School admin goes to staff page and changes rows per page',
            async function () {
                await goToStaffPageAndChangeRowsPerPage(cms, '50');
            }
        );

        await cms.instruction(
            `school admin sees newly added user groups`,
            async function (this: CMSInterface) {
                const staff = getUserProfileFromContext(
                    scenario,
                    staffProfileAliasWithAccountRoleSuffix('teacher')
                );

                await assertNewUserGroupsOnStaffList(this, scenario, staff);
            }
        );
    }
);
