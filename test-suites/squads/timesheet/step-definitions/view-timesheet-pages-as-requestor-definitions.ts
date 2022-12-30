import {
    clickLoginButtonAndWaitForEndpointInMultiTenant,
    aSchoolAdminAlreadyLoginSuccessInCMS,
    aSchoolAdminOnLoginPageCMS,
    fillTestAccountLoginInCMS,
    clickLoginButtonAndWaitForEndpoint,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    getRandomNumber,
    retrieveLocationIds,
    retrieveLocations,
} from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { usermgmtUserGroupModifierService } from '@supports/services/usermgmt-user-group-service';

import { staffCreateTimesheetBtn } from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-upsert';
import {
    assertElementDoesNotExist,
    assertElementExists,
    assertTableColumnDoesNotExist,
} from 'test-suites/squads/timesheet/common/step-definitions/common-assertion-definitions';
import { MenuLabel, TimesheetStatus, UserInfo } from 'test-suites/squads/timesheet/common/types';
import { getNavigationMenuSelector } from 'test-suites/squads/timesheet/common/utils';
import { createTimesheetsWithStatus } from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';
import { UserGroupInfo } from 'test-suites/squads/user-management/step-definitions/user-create-user-group-definitions';
import {
    aSchoolAdminOnLoginTenantPageCMS,
    fillTestAccountMultiTenantLoginInCMS,
} from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';
import { getTeacherAndSchoolAdminRoleList } from 'test-suites/squads/user-management/step-definitions/user-query-user-roles-hasura';

export async function createUserGroupGRPC(cms: CMSInterface, roles: string[]) {
    const token = await cms.getToken();
    const roleList = await getTeacherAndSchoolAdminRoleList(cms);
    const rolesToInclude = roleList.filter((role) => roles.includes(role.role_name));
    const locations = await retrieveLocations(cms);
    const locationIds = retrieveLocationIds(locations);
    const userGroupName = `e2e-userGroup.${getRandomNumber()}`;

    if (!rolesToInclude.length) {
        throw new Error('Can not retrieve specified roles. createUserGroupGRPC');
    }

    const userGroup = await usermgmtUserGroupModifierService.createUserGroup(token, {
        userGroupName,
        roleWithLocationsList: rolesToInclude.map((role) => ({
            roleId: role.role_id,
            locationIdsList: locationIds.slice(0, 1),
        })),
    });
    const userGroupId = userGroup?.response?.userGroupId;

    if (!userGroupId) {
        throw new Error('Can not create user group by gRPC. createUserGroupGRPC');
    }
    return { userGroupId, userGroupName } as UserGroupInfo;
}
export async function updateUserGroupGRPC(
    cms: CMSInterface,
    userGroup: UserGroupInfo,
    roles: string[]
) {
    const token = await cms.getToken();
    const roleList = await getTeacherAndSchoolAdminRoleList(cms);
    const rolesToInclude = roleList.filter((role) => roles.includes(role.role_name));
    const locations = await retrieveLocations(cms);
    const locationIds = retrieveLocationIds(locations);

    if (!rolesToInclude.length) {
        throw new Error('Can not retrieve specified roles. updateUserGroupGRPC');
    }

    const updatedUserGroup = await usermgmtUserGroupModifierService.updateUserGroup(token, {
        ...userGroup,
        roleWithLocationsList: rolesToInclude.map((role) => ({
            roleId: role.role_id,
            locationIdsList: locationIds.slice(0, 1),
        })),
    });
    const isSuccess = updatedUserGroup?.response?.successful;

    if (!isSuccess) {
        throw new Error('Can not update user group by gRPC. updateUserGroupGRPC');
    }

    return userGroup;
}

export const loginAsTenant = async (cms: CMSInterface, { username, password }: UserInfo) => {
    await cms.instruction(
        'User not login yet and go to login tenant page',
        async function (cms: CMSInterface) {
            await aSchoolAdminOnLoginTenantPageCMS(cms);
        }
    );

    await cms.instruction(
        `Fill username ${username}, password ${password}, and e2e organization in BO login page`,

        async function (cms: CMSInterface) {
            await fillTestAccountMultiTenantLoginInCMS(cms, {
                organization: 'e2e',
                username,
                password,
            });
        }
    );

    await clickLoginButtonAndWaitForEndpointInMultiTenant(cms);

    await cms.instruction('Logged in, see home page', async function (cms: CMSInterface) {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
};

export const loginAsNonTenant = async (cms: CMSInterface, { username, password }: UserInfo) => {
    await cms.instruction('User not login yet, see login form', async function () {
        await aSchoolAdminOnLoginPageCMS(cms);
    });

    await cms.instruction(
        `Fill username ${username}, password ${password} in BO login page`,
        async function () {
            await fillTestAccountLoginInCMS(cms, username, password);
        }
    );
    await clickLoginButtonAndWaitForEndpoint(cms);

    await cms.instruction('Logged in, see home page', async function () {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
};

export const assertNavigationMenuExists = async (cms: CMSInterface, menu: MenuLabel) => {
    await assertElementExists(cms, getNavigationMenuSelector(menu));
};

export const assertNavigationMenuDoesNotExist = async (cms: CMSInterface, menu: MenuLabel) => {
    await assertElementDoesNotExist(cms, getNavigationMenuSelector(menu));
};

export const assertTimesheetManagementCreateButtonExists = async (cms: CMSInterface) => {
    await assertElementExists(cms, staffCreateTimesheetBtn);
};

export const assertTimesheetManagementTableColumnDoesNotExist = async (
    cms: CMSInterface,
    columnLabel: string
) => {
    await assertTableColumnDoesNotExist({
        cms,
        columnLabel,
        tableTestId: 'AdminTimesheetList__table',
    });
};

export const createTimesheetsAsRequestor = async (
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    timesheetStatus: TimesheetStatus,
    numOfTimesheets: number
) => {
    await createTimesheetsWithStatus({
        cms,
        role: 'teacher',
        scenarioContext,
        numOfTimesheets,
        timesheetStatus,
        useRandomLocation: true,
    });
};
