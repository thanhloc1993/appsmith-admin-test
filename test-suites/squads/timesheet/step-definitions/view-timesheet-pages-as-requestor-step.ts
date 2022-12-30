import { Given, Then, When } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { IMasterWorld } from '@supports/app-types';

import { UserGroup } from 'manabuf/usermgmt/v2/enums_pb';
import { VALID_TIMESHEET_ROLES } from 'test-suites/squads/timesheet/common/const';
import {
    MenuLabel,
    TimesheetRole,
    TimesheetStatus,
    TimesheetUserGroup,
    UserInfo,
} from 'test-suites/squads/timesheet/common/types';
import { getUserInfoAliasByUserGroup } from 'test-suites/squads/timesheet/common/utils';
import {
    assertNavigationMenuDoesNotExist,
    assertNavigationMenuExists,
    assertTimesheetManagementCreateButtonExists,
    assertTimesheetManagementTableColumnDoesNotExist,
    createTimesheetsAsRequestor,
    createUserGroupGRPC,
    loginAsNonTenant,
    loginAsTenant,
    updateUserGroupGRPC,
} from 'test-suites/squads/timesheet/step-definitions/view-timesheet-pages-as-requestor-definitions';
import { createAnUserGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';
import { userAuthenticationMultiTenant } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

When(
    '{string} logs in CMS',
    async function (this: IMasterWorld, userGroupName: TimesheetUserGroup) {
        const cms = this.cms;
        const scenario = this.scenario;

        const userInfo = scenario.get<UserInfo>(getUserInfoAliasByUserGroup(userGroupName));

        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        if (isEnabledMultiTenantLogin) {
            await loginAsTenant(cms, userInfo);
        } else {
            await loginAsNonTenant(cms, userInfo);
        }
    }
);

When(
    '{string} creates a timesheet with {string} status',
    { timeout: 180000 },
    async function (this: IMasterWorld, userGroup: TimesheetUserGroup, status: TimesheetStatus) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(
            `${userGroup} creates a timesheet with ${status} status`,
            async () => {
                await createTimesheetsAsRequestor(cms, scenario, status, 1);
            }
        );
    }
);

Given(
    'school admin has created a user as {string} with the roles of {string}',
    async function (this: IMasterWorld, userGroupName: TimesheetUserGroup, roles: string) {
        const cms = this.cms;
        const scenario = this.scenario;
        const formattedRoles: TimesheetRole[] = roles
            .split(',')
            .map((role) => role.trim() as TimesheetRole)
            .filter((role) => role && VALID_TIMESHEET_ROLES.includes(role));

        console.log('Create user with roles', formattedRoles);

        await cms.instruction(
            `school admin has created a user under user group ${userGroupName} with the roles of ${roles}`,
            async () => {
                // initially create a teacher only user group
                // we don't set this immediately to the actual role since when we set the roles to school admin or hq staff
                // it will trigger an error on the backend side regarding the re-issuance of passwords for the account
                const userGroup = await createUserGroupGRPC(cms, ['Teacher']);

                const { email: username, password } = await createAnUserGRPC(
                    cms,
                    // this could be anything as userGroupId will serve as the basis for the user group
                    UserGroup.USER_GROUP_TEACHER,
                    [userGroup.userGroupId]
                );

                // here we update the user group to the expected roles since we've just finished setting up the account
                await updateUserGroupGRPC(cms, userGroup, formattedRoles);

                scenario.set(getUserInfoAliasByUserGroup(userGroupName), {
                    username,
                    password,
                } as UserInfo);
            }
        );
    }
);

Then(
    '{string} sees menu item {string} on navigation drawer',
    async function (this: IMasterWorld, userGroupName: TimesheetUserGroup, menu: MenuLabel) {
        const cms = this.cms;
        await cms.instruction(
            `${userGroupName} sees menu item ${menu} on navigation drawer`,
            async () => {
                await assertNavigationMenuExists(cms, menu);
            }
        );
    }
);

Then(
    '{string} does not see menu item {string} on navigation drawer',
    async function (this: IMasterWorld, userGroupName: TimesheetUserGroup, menu: MenuLabel) {
        const cms = this.cms;
        await cms.instruction(
            `${userGroupName} does not see menu item ${menu} on navigation drawer`,
            async () => {
                await assertNavigationMenuDoesNotExist(cms, menu);
            }
        );
    }
);

Then(
    '{string} sees create timesheet button on timesheet management page',
    async function (this: IMasterWorld, role: string) {
        const cms = this.cms;
        await cms.instruction(
            `${role} sees create timesheet button on timesheet management page`,
            async () => {
                await assertTimesheetManagementCreateButtonExists(cms);
            }
        );
    }
);

Then(
    '{string} does not see {string} column on timesheet management table',
    async function (this: IMasterWorld, role: string, columnLabel: string) {
        const cms = this.cms;
        await cms.instruction(
            `${role} does not see ${columnLabel} column on timesheet management table`,
            async () => {
                await assertTimesheetManagementTableColumnDoesNotExist(cms, columnLabel);
            }
        );
    }
);
