import { saveButton, tableBaseRow } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { UserRole } from '@legacy-step-definitions/types/common';
import {
    buildTreeLocations,
    getRandomElementsWithLength,
    getRandomNumber,
    retrieveLocationIds,
    retrieveLocations,
} from '@legacy-step-definitions/utils';
import {
    roleListAlias,
    selectedRoleListAlias,
    treeLocationsAlias,
    userGroupIdsListAlias,
    userGroupProfileAlias,
    userGroupsListAlias,
} from '@user-common/alias-keys/user';
import { inputSelectLocationChipLimitTags } from '@user-common/cms-selectors/students-page';
import {
    addNewGrantedPermissionButton,
    autoCompleteBaseInput,
    grantedRoleOption,
    userGroupDetailName,
    userGroupDetailTable,
    userGroupDetailTableLocations,
    userGroupDetailTableRole,
    userGroupListName,
    userGroupUpsertName,
    userGroupUpsertTable,
    userGroupUpsertTableLocation,
    userGroupUpsertTableLocationChips,
    userGroupUpsertTableRole,
} from '@user-common/cms-selectors/user-group';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';

import { CMSInterface } from '@supports/app-types';
import { Menu } from '@supports/enum';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import { usermgmtUserGroupModifierService } from '@supports/services/usermgmt-user-group-service';
import { LocationInfoGRPC, TreeLocationProps } from '@supports/types/cms-types';

import { chooseLocations, clickOnSaveInDialog } from './user-definition-utils';
import {
    getTeacherAndSchoolAdminRoleList,
    getOneTeacherRoleFromRolesList,
} from './user-query-user-roles-hasura';
import { RetrieveLocationsResponse } from 'manabuf/bob/v1/masterdata_pb';
import { CreateUserGroupResponse } from 'manabuf/usermgmt/v2/user_groups_pb';
import { schoolAdminGetFirstGrantedLocation } from 'test-suites/squads/architecture/step-definitions/architecture-auto-select-first-granted-location-definitions';

export interface RoleTypes {
    role_id: string;
    role_name: string;
}
export interface GrantedPermission {
    role: string;
    locations: LocationInfoGRPC[];
}
export interface UserGroupTypes {
    name: string;
    grantedPermissions: GrantedPermission[];
}
export interface UserGroupFormType {
    name: 'empty' | 'not empty';
    grantedRole: 'empty' | 'not empty';
    grantedLocations: 'empty' | 'not empty';
}

export interface UserGroupTypeAlias {
    name: string;
    grantedRole: UserRole | 'Both roles';
}

export interface GrantedRoleTable {
    role: UserRole | 'Both roles';
    location: 'location A' | 'location B' | 'all';
}

export interface UserGroupInfo {
    userGroupId: string;
    userGroupName: string;
}

export type UpsertUserGroupOptions = 'with granted permission' | 'without granted permission';
export async function createUserGroupData(
    cms: CMSInterface,
    context: ScenarioContext,
    options: {
        grantedPermissionsAmount?: number;
        defaultRoles?: string[];
    } = { grantedPermissionsAmount: 2, defaultRoles: ['Teacher'] }
) {
    const roleListContext = context.get<string[]>(roleListAlias);
    const { grantedPermissionsAmount, defaultRoles } = options;

    let roleList = roleListContext.filter((role) => defaultRoles?.includes(role));

    if (grantedPermissionsAmount) {
        const restRolesLength = grantedPermissionsAmount - roleList.length;
        if (restRolesLength > 0) {
            const restRole = roleListContext.filter((role) => !roleList.includes(role));
            const randomRoles = getRandomElementsWithLength(restRole, restRolesLength);
            roleList = roleList.concat(randomRoles);
        }
    }

    const treeLocations = context.get<TreeLocationProps>(treeLocationsAlias);
    const firstGrantedLocation = await schoolAdminGetFirstGrantedLocation(cms, context);

    const userGroupName = `e2e-userGroup.${getRandomNumber()}`;
    const grantedPermissions: GrantedPermission[] = [];

    if (roleList.length) {
        const rootOrg: LocationInfoGRPC = {
            locationId: treeLocations.locationId,
            name: treeLocations.name,
        };
        roleList.forEach((role) => {
            const grantedPermission: GrantedPermission = {
                role: role,
                locations: role === 'School Admin' ? [rootOrg] : [firstGrantedLocation],
            };
            grantedPermissions.push(grantedPermission);
        });
    }

    const userGroupData: UserGroupTypes = { name: userGroupName, grantedPermissions };
    context.set(userGroupProfileAlias, userGroupData);

    return userGroupData;
}

export async function schoolAdminGoesToCreateUserGroupPage(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const isAllowShowAllRole = await isEnabledFeatureFlag('USER_GROUP_SHOW_ALL_ROLE');
    const [roleListResult, treeLocationsResult] = await Promise.all([
        cms.waitForHasuraResponse(isAllowShowAllRole ? 'User_RoleListV2' : 'User_RoleListV3'),
        cms.waitForGRPCResponse('bob.v1.MasterDataReaderService/RetrieveLocations'),
        cms.selectAButtonByAriaLabel('Create'),
    ]);

    await cms.attach('See upsert user group dialog');

    const roleList: RoleTypes[] = roleListResult.resp?.data.role;
    const roleListName = roleList.map((role) => role.role_name);

    context.set(roleListAlias, roleListName);

    const decoder = createGrpcMessageDecoder(RetrieveLocationsResponse);
    const encodedResponseText = await treeLocationsResult?.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);
    const locationsList = decodedResponse?.toObject().locationsList;
    const treeLocations = buildTreeLocations(locationsList!);

    context.set(treeLocationsAlias, treeLocations);
}

export async function schoolAdminCreateUserGroup(
    cms: CMSInterface,
    context: ScenarioContext,
    userGroup: UserGroupTypes
) {
    const page = cms.page!;
    const { name, grantedPermissions } = userGroup;

    await cms.instruction(`Fill ${name} to user group name field`, async function () {
        await page.fill(userGroupUpsertName, name);
    });

    for (const grantedPermission of grantedPermissions) {
        const { role, locations } = grantedPermission;
        await addNewGrantedPermission(cms, context, role, locations);
    }

    await cms.instruction('Click Save button multiple times', async function (this: CMSInterface) {
        await clickMultipleTimes(cms, saveButton);
        await cms.waitingForLoadingIcon();
    });
}

export async function schoolAdminCreateUserGroups(
    cms: CMSInterface,
    context: ScenarioContext,
    numberOfUserGroups = 1,
    defaultRoles: string[] = ['Teacher']
) {
    const userGroupIdsList: string[] = [];
    const userGroupsList: UserGroupTypes[] = [];
    for (let i = 0; i < numberOfUserGroups; i++) {
        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

        const userGroup: UserGroupTypes = await createUserGroupData(cms, context, {
            grantedPermissionsAmount: 1,
            defaultRoles: defaultRoles,
        });

        const [createUserGroupGRPCResp] = await Promise.all([
            cms.waitForGRPCResponse('usermgmt.v2.UserGroupMgmtService/CreateUserGroup'),
            schoolAdminCreateUserGroup(cms, context, userGroup),
        ]);

        const decoder = createGrpcMessageDecoder(CreateUserGroupResponse);
        const encodedResponseText = await createUserGroupGRPCResp?.text();
        const userGroupDecodedResp = decoder.decodeMessage(encodedResponseText);
        const userGroupId = userGroupDecodedResp?.getUserGroupId();

        context.set(selectedRoleListAlias, []);
        userGroupsList.unshift(userGroup);
        if (userGroupId) {
            userGroupIdsList.unshift(userGroupId);
        }
    }

    context.set(userGroupsListAlias, userGroupsList);
    context.set(userGroupIdsListAlias, userGroupIdsList);
}

export async function addNewGrantedPermission(
    cms: CMSInterface,
    context: ScenarioContext,
    role: string,
    locations: LocationInfoGRPC[]
) {
    const page = cms.page!;
    await cms.instruction('Click add button', async function () {
        const addButton = page.locator(addNewGrantedPermissionButton);
        await addButton?.click();
    });

    const endRowTable = await lastRowGrantedPermissionTableSelector(cms);

    const roleField = endRowTable?.locator(userGroupUpsertTableRole);
    const locationField = endRowTable?.locator(userGroupUpsertTableLocation);
    const selectedRoleList = context.get<string[]>(selectedRoleListAlias) || [];

    if (role) {
        await cms.instruction(`Choose ${role} role`, async function () {
            await roleField?.click();
            await assertSelectedRoleList(cms, selectedRoleList);
            await page.locator(grantedRoleOption(role)).click();
            context.set(selectedRoleListAlias, [...selectedRoleList, role]);
        });
    }

    if (role !== 'School Admin' && locations.length) {
        await cms.instruction(`Choose random locations`, async function () {
            await locationField?.click();
            await chooseLocations(cms, locations);
            await clickOnSaveInDialog(cms);
        });
    }
}
export async function lastRowGrantedPermissionTableSelector(cms: CMSInterface) {
    const grantedPermissionTable = cms.page?.locator(userGroupUpsertTable);
    const allRows = grantedPermissionTable?.locator(tableBaseRow);
    if (allRows) {
        return allRows.last();
    }
    return null;
}

export async function schoolAdminSeesNewUserGroupOnCMS(
    cms: CMSInterface,
    context: ScenarioContext,
    options: UpsertUserGroupOptions
) {
    const userGroupProfile = await context.get<UserGroupTypes>(userGroupProfileAlias);
    const { name, grantedPermissions } = userGroupProfile;

    await cms.instruction('Go to user group page', async function () {
        await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        await cms!.waitForSkeletonLoading();
    });

    await cms.instruction(
        `See the user group name (${name}) on user group list`,
        async function (this: CMSInterface) {
            await cms.waitForSelectorWithText(userGroupListName, name);
        }
    );

    await cms.instruction(`Click newly created user group name (${name})`, async function () {
        const createdStaffName = await cms.waitForSelectorWithText(userGroupListName, name);
        await createdStaffName?.click();
        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction(
        `See the user group name ${options} on user group detail`,
        async function () {
            const detailName = await cms.getTextContentElement(userGroupDetailName);
            weExpect(detailName, `User group name should match ${name}`).toBe(name);
            if (options === 'with granted permission') {
                await assertGrantedPermissionsOnDetailPage(cms, grantedPermissions);
            }
        }
    );
}

export async function assertGrantedPermissionsOnDetailPage(
    cms: CMSInterface,
    grantedPermissions: GrantedPermission[]
) {
    if (!grantedPermissions.length) return;
    const page = cms.page!;
    const grantedPermissionTable = page.locator(userGroupDetailTable);

    const allRows = grantedPermissionTable.locator(tableBaseRow);

    const rowLength = await allRows.count();
    weExpect(rowLength, 'Should have the same length of granted permissions').toBe(
        grantedPermissions.length
    );

    for (let i = 0; i < rowLength; i++) {
        const roleField = allRows.nth(i).locator(userGroupDetailTableRole);
        const roleFieldTextContent = await roleField.textContent();
        const { role, locations } = grantedPermissions.find(
            (grantedPermission) => grantedPermission.role === roleFieldTextContent
        )!;

        weExpect(role, `Role field in row ${i + 1} should be ${role}`).toBe(roleFieldTextContent);

        const locationField = allRows.nth(i).locator(userGroupDetailTableLocations);

        const locationFieldTextContent = await locationField.textContent();
        const locationElements = locationFieldTextContent?.split(', ');

        weExpect(
            locationElements,
            `Location field in row ${i + 1} should have length ${locations.length}`
        ).toHaveLength(locations.length);

        for (const location of locations) {
            const locationName = location.name;
            const hasLocation = locationElements?.findIndex(
                (location) => location === locationName
            );
            weExpect(
                hasLocation,
                `Location field in row ${i + 1} should have ${locationName}`
            ).toBeGreaterThanOrEqual(0);
        }
    }
}

export async function assertGrantedPermissionsOnEditPage(
    cms: CMSInterface,
    grantedPermissions: GrantedPermission[]
) {
    if (!grantedPermissions.length) return;
    const page = cms.page!;
    const grantedPermissionTable = page.locator(userGroupUpsertTable);
    const allRows = grantedPermissionTable.locator(tableBaseRow);
    const rowLength = await allRows.count();
    weExpect(rowLength, 'Should have the same length of granted permissions').toBe(
        grantedPermissions.length
    );

    for (let i = 0; i < rowLength; i++) {
        const roleField = allRows.nth(i).locator(userGroupUpsertTableRole);
        const roleValue = await roleField.locator(autoCompleteBaseInput).inputValue();
        const { role, locations } = grantedPermissions.find(
            (grantedPermission) => grantedPermission.role === roleValue
        )!;

        weExpect(role, `Role field in row ${i + 1} should be ${role}`).toBe(roleValue);

        const locationField = allRows.nth(i).locator(userGroupUpsertTableLocation);

        const limitChip = locationField?.locator(inputSelectLocationChipLimitTags);
        if ((await limitChip.count()) !== 0) await limitChip.click();

        const locationChips =
            (await locationField?.locator(userGroupUpsertTableLocationChips).elementHandles()) ||
            [];

        weExpect(
            locationChips,
            `Location field in row ${i + 1} should have length ${locations.length}`
        ).toHaveLength(locations.length);

        const chipTextContents = await Promise.all(locationChips.map((chip) => chip.textContent()));
        for (const location of locations) {
            const locationName = location.name;
            const hasLocation = chipTextContents?.findIndex(
                (location) => location === locationName
            );
            weExpect(
                hasLocation,
                `Location field in row ${i + 1} should have ${locationName}`
            ).toBeGreaterThanOrEqual(0);
        }
    }
}

export async function assertSelectedRoleList(cms: CMSInterface, roleList: string[]) {
    for (const role of roleList) {
        await cms.instruction(`Role "${role}" should be disabled`, async function () {
            const roleOption = cms.page?.locator(grantedRoleOption(role));
            const isDisabled = await roleOption?.isDisabled();
            weExpect(isDisabled, `Role "${role}" should be disabled`).toBe(true);
        });
    }
}

export async function clickMultipleTimes(cms: CMSInterface, selector: string, times = 5) {
    const element = cms.page!.locator(selector);
    await element.click({ clickCount: times, force: true });
}

export async function createAnUserGroupGRPC(cms: CMSInterface, isSetRoles = true) {
    const token = await cms.getToken();
    const roles = await getTeacherAndSchoolAdminRoleList(cms);
    const locations = await retrieveLocations(cms);
    const teacherRole = getOneTeacherRoleFromRolesList(roles);
    const locationIds = retrieveLocationIds(locations);
    const userGroupName = `e2e-userGroup.${getRandomNumber()}`;

    if (!teacherRole) {
        throw new Error('Can not retrieve teacher role. createAnUserGroupGRPC');
    }

    const userGroup = await usermgmtUserGroupModifierService.createUserGroup(token, {
        userGroupName,
        roleWithLocationsList: isSetRoles
            ? [
                  {
                      roleId: teacherRole.role_id,
                      locationIdsList: locationIds.slice(0, 1),
                  },
              ]
            : [],
    });
    const userGroupId = userGroup?.response?.userGroupId;

    if (!userGroupId) {
        throw new Error('Can not create user group by gRPC. createAnUserGroupGRPC');
    }
    return { userGroupId, userGroupName } as UserGroupInfo;
}
