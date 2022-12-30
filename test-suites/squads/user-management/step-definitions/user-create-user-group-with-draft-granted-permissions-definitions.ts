import { locationSelectedField } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { UserRole } from '@legacy-step-definitions/types/common';
import { flatTreeLocationByRecursive } from '@legacy-step-definitions/utils';
import {
    locationAlias,
    selectedRoleListAlias,
    treeLocationsAlias,
    userGroupGrantedRoleList,
    userGroupsDataAlias,
} from '@user-common/alias-keys/user';
import {
    inputSelectLocationChipLimitTags,
    locationItemInTreeLocationsDialog,
} from '@user-common/cms-selectors/students-page';
import {
    userGroupUpsertTableLocation,
    userGroupUpsertTableLocationChips,
} from '@user-common/cms-selectors/user-group';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { TreeLocationProps } from '@supports/types/cms-types';

import {
    createUserGroupData,
    GrantedRoleTable,
    lastRowGrantedPermissionTableSelector,
    schoolAdminCreateUserGroup,
    schoolAdminGoesToCreateUserGroupPage,
    UserGroupTypeAlias,
    UserGroupTypes,
} from './user-create-user-group-definitions';

export type LocationOption = 'parent' | 'all children';
export type LocationCheckBoxMode = 'checked' | 'unchecked' | 'indeterminate';
export type LocationResult = 'parent and all children' | 'all children';

export async function getRandomParentLocation(treeLocation: TreeLocationProps) {
    const locations = treeLocation.children?.filter(
        (location) => location.children!.length && location.children!.length <= 20
    );
    if (!locations?.length) {
        const randomIndex = Math.floor(Math.random() * treeLocation.children!.length);
        return treeLocation.children![randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * locations.length);
        return locations[randomIndex];
    }
}

export async function schoolAdminChecksLocationPopup(
    cms: CMSInterface,
    context: ScenarioContext,
    value: LocationResult
) {
    const treeLocation = context.get<TreeLocationProps>(treeLocationsAlias);
    const parentLocation = context.get<TreeLocationProps>(locationAlias);
    const flatLocations = flatTreeLocationByRecursive(parentLocation);
    const checkedLocations: TreeLocationProps[] = [];
    const indeterminateLocations: TreeLocationProps[] = [];
    let selectedLocation = '';

    if (value === 'all children') {
        flatLocations.shift();
        checkedLocations.concat(flatLocations);
        indeterminateLocations.concat(treeLocation, parentLocation);

        const checkedList = flatLocations.slice(0, 5).map((l) => l.name);
        const plusNumber = flatLocations.length - 5;
        if (plusNumber > 0) checkedList.push(`+${plusNumber}`);
        selectedLocation = checkedList.join(', ');
    } else {
        checkedLocations.concat(flatLocations);
        indeterminateLocations.concat(treeLocation);
        selectedLocation = parentLocation.name;
    }

    await cms.instruction(`See ${value} locations to be checked`, async function () {
        await assertLocationCheckBox(cms, checkedLocations, 'checked');
    });

    await cms.instruction(`See parent locations to be indeterminate`, async function () {
        await assertLocationCheckBox(cms, indeterminateLocations, 'indeterminate');
    });

    const locationType = value === 'all children' ? value : 'parent';

    await cms.instruction(`See ${locationType} is displayed on selected part`, async function () {
        const selectedField = await cms.getTextContentElement(locationSelectedField);
        weExpect(
            selectedField,
            `${locationType} locations should be displayed on selected part`
        ).toContain(selectedLocation);
    });
}

export async function schoolAdminChecksLocationChip(
    cms: CMSInterface,
    parentLocation: TreeLocationProps
) {
    const flatLocations = flatTreeLocationByRecursive(parentLocation);
    const endRowTable = await lastRowGrantedPermissionTableSelector(cms);
    const locationField = endRowTable?.locator(userGroupUpsertTableLocation);

    const limitChip = locationField?.locator(inputSelectLocationChipLimitTags);
    if (limitChip) await limitChip.click();

    const locationChips =
        (await locationField?.locator(userGroupUpsertTableLocationChips).elementHandles()) || [];

    weExpect(
        locationChips,
        `Location chips should have length ${flatLocations.length}`
    ).toHaveLength(flatLocations.length);

    const chipTextContents = await Promise.all(locationChips?.map((chip) => chip.textContent()));
    for (const location of flatLocations) {
        const locationName = location.name;
        const hasLocation = chipTextContents?.findIndex((location) => location === locationName);
        weExpect(
            hasLocation,
            `Location field should have chip ${locationName}`
        ).toBeGreaterThanOrEqual(0);
    }
}

export async function assertLocationCheckBox(
    cms: CMSInterface,
    locations: TreeLocationProps[],
    check: LocationCheckBoxMode
) {
    for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        const locationItem = cms.page!.locator(
            locationItemInTreeLocationsDialog(location.locationId)
        );

        await locationItem.scrollIntoViewIfNeeded();
        const checkbox = locationItem.locator('input');
        const isChecked = await checkbox?.isChecked();
        switch (check) {
            case 'checked':
                weExpect(
                    isChecked,
                    `The location ${location.name} should be checked on the popup`
                ).toBe(true);
                break;
            case 'indeterminate': {
                weExpect(
                    isChecked,
                    `The location ${location.name} should be unchecked on the popup`
                ).toBe(false);
                const isIndeterminate = await checkbox?.getAttribute('data-indeterminate');
                weExpect(
                    isIndeterminate,
                    `The location ${location.name} should be indeterminate on the popup`
                ).toBe('true');
                break;
            }
            default:
                weExpect(
                    isChecked,
                    `The location ${location.name} should be unchecked on the popup`
                ).toBe(false);
        }
    }
}

export async function createUserGroupsWithGrantedRoles(
    cms: CMSInterface,
    context: ScenarioContext,
    grantedRoles: GrantedRoleTable[]
): Promise<{
    userGroupGrantedRoles: UserGroupTypeAlias[];
    userGroupsData: UserGroupTypes[];
}> {
    const userGroupGrantedRoles: UserGroupTypeAlias[] = [];
    const userGroupsData: UserGroupTypes[] = [];

    for (const grantedRole of grantedRoles) {
        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

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

    return { userGroupGrantedRoles: userGroupGrantedRoles, userGroupsData: userGroupsData };
}
