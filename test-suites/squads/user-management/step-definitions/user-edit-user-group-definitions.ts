import {
    checkBoxWithCheckedState,
    inputByValue,
    locationDialog,
    saveButton,
    tableBaseRow,
    tableSkeleton,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    getRandomElementsWithLength,
    retrieveLowestLocations,
} from '@legacy-step-definitions/utils';
import { treeLocationsAlias, userGroupProfileAlias } from '@user-common/alias-keys/user';
import {
    tableWithCheckboxHeader,
    tableWithCheckboxRow,
} from '@user-common/cms-selectors/students-page';
import {
    autoCompleteBaseInput,
    userGroupListName,
    userGroupUpsertDeleteButton,
    userGroupUpsertTableLocation,
    userGroupUpsertTableLocationChips,
} from '@user-common/cms-selectors/user-group';

import { Locator } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions, LocationInfoGRPC, TreeLocationProps } from '@supports/types/cms-types';

import {
    clickMultipleTimes,
    lastRowGrantedPermissionTableSelector,
    UserGroupTypes,
} from './user-create-user-group-definitions';
import { chooseLocations, clickOnSaveInDialog } from './user-definition-utils';

export type ResultsSelectedLocationType = 'organization' | 'empty';
export type Role = 'Teacher' | 'School Admin';
export type LocationAction = 'adds' | 'removes';
export type GrantedPermissionAmount = 'one' | 'all';
export async function schoolAdminGoesToEditPage(cms: CMSInterface, userGroup: UserGroupTypes) {
    await cms.instruction('school admin goes to user group detail page', async function () {
        const userGroupName = await cms.waitForSelectorWithText(userGroupListName, userGroup.name);
        await userGroupName?.click();
        if (userGroup.grantedPermissions.length) {
            const skeleton = cms.page!.locator(tableSkeleton).first();
            await skeleton.waitFor({ state: 'visible' });
            await skeleton.waitFor({ state: 'hidden' });
        }
    });

    await cms.instruction(`school admin goes to on edit user group`, async function () {
        await cms.selectActionButton(ActionOptions.EDIT, { target: 'actionPanelTrigger' });
        await cms.waitingAutocompleteLoading();
    });
}

export async function schoolAdminChecksLocationsForSwitchingGrantedRole(
    cms: CMSInterface,
    context: ScenarioContext,
    result: ResultsSelectedLocationType
) {
    const treeLocations = context.get<TreeLocationProps>(treeLocationsAlias);
    const endRowTable = await lastRowGrantedPermissionTableSelector(cms);
    const locationField = endRowTable?.locator(userGroupUpsertTableLocation);
    const locationChips = locationField?.locator(userGroupUpsertTableLocationChips);
    const locationChipAmount = await locationChips?.count();

    if (result === 'organization') {
        await cms.instruction(
            'School admin sees location field has 1 location chip which is organization',
            async function () {
                weExpect(locationChipAmount, `Location chip amount should be 1`).toBe(1);
                const chipTextContent = await locationChips?.textContent();
                weExpect(chipTextContent, 'Location chip should be organization').toBe(
                    treeLocations.name
                );
            }
        );
    } else {
        await cms.instruction('School admin sees location field is empty', async function () {
            weExpect(locationChipAmount, `Location chip amount should be 0`).toBe(0);
        });
    }

    await cms.instruction(`School admin opens location popup`, async function () {
        await locationField?.click();
        await cms.waitingForLoadingIcon();
    });

    const locationPopup = cms.page!.locator(locationDialog);

    if (result === 'organization') {
        await cms.instruction('School admin sees all checkbox is checked', async function () {
            const allCheckbox = locationPopup.locator(checkBoxWithCheckedState(false));
            weExpect(await allCheckbox.count(), 'All checkbox should be checked').toBe(0);
        });
    } else {
        await cms.instruction('School admin sees all checkbox is unchecked', async function () {
            const allCheckbox = locationPopup.locator(checkBoxWithCheckedState(true));
            weExpect(await allCheckbox.count(), 'All checkbox should be unchecked').toBe(0);
        });
    }

    await cms.instruction('School admin clicks org location', async function () {
        await chooseLocations(cms, [treeLocations]);
    });

    const allCheckbox = locationPopup.locator(checkBoxWithCheckedState(false));
    const message = result === 'organization' ? 'unable' : 'able';

    await cms.instruction(`School admin is ${message} to edit locations`, async function () {
        weExpect(await allCheckbox.count(), `All checkbox should be checked`).toBe(0);
    });
}

export async function schoolAdminEditGrantedLocationForTeacherRole(
    cms: CMSInterface,
    context: ScenarioContext,
    data: {
        action: LocationAction;
        role: string;
    }
) {
    const page = cms.page!;
    const { role, action } = data;
    const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);
    let editLocations: LocationInfoGRPC[] = [];
    const newGrantedPermissions = [...userGroupProfile.grantedPermissions];

    if (action === 'adds') {
        const locationList = await retrieveLowestLocations(cms);
        editLocations = locationList.slice(5, 10);
        newGrantedPermissions.forEach((grantedPermission) => {
            if (grantedPermission.role === role)
                grantedPermission.locations = grantedPermission.locations.concat(editLocations);
        });
    } else {
        const teacherRoleLocations = userGroupProfile.grantedPermissions.find(
            (grantedPermission) => grantedPermission.role === role
        )?.locations;
        editLocations = getRandomElementsWithLength(teacherRoleLocations!, 1);
        const newLocations = teacherRoleLocations!.filter(
            (location) => location.locationId !== editLocations[0].locationId
        );
        newGrantedPermissions.forEach((grantedPermission) => {
            if (grantedPermission.role === role) grantedPermission.locations = newLocations;
        });
    }

    context.set(userGroupProfileAlias, {
        ...userGroupProfile,
        grantedPermissions: newGrantedPermissions,
    });

    const teacherRoleRow = page.locator(tableBaseRow, {
        has: page.locator(inputByValue(role)),
    });
    const locationField = teacherRoleRow?.locator(userGroupUpsertTableLocation);

    await cms.instruction('School admin clicks location field', async function () {
        await locationField?.locator(autoCompleteBaseInput)?.click();
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction(`School admin ${action} some locations`, async function () {
        await chooseLocations(cms, editLocations);
        await clickOnSaveInDialog(cms);
    });

    await cms.instruction('Click Save button', async function () {
        await clickMultipleTimes(cms, saveButton, 1);
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction('school admin wait for granted permissions loaded', async function () {
        const skeleton = cms.page!.locator(tableSkeleton).first();
        await skeleton.waitFor({ state: 'visible' });
        await skeleton.waitFor({ state: 'hidden' });
    });
}

export async function schoolAdminRemovesGrantedPermission(
    cms: CMSInterface,
    context: ScenarioContext,
    option: GrantedPermissionAmount
) {
    const page = cms.page!;
    const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);
    let checkBox: Locator | undefined;

    if (option === 'all') {
        checkBox = await page.locator(tableWithCheckboxHeader);
        userGroupProfile.grantedPermissions = [];
    } else {
        const removedGrantedPermission = userGroupProfile.grantedPermissions.shift();
        const tableRow = page.locator(tableBaseRow, {
            has: page.locator(inputByValue(removedGrantedPermission!.role)),
        });
        checkBox = tableRow?.locator(tableWithCheckboxRow);
    }

    await cms.instruction(
        `School admin check ${option} checkbox of granted permissions table`,
        async function () {
            await checkBox?.locator('input').check();
        }
    );

    await cms.instruction('School admin clicks delete button', async function () {
        await page.locator(userGroupUpsertDeleteButton).click();
    });

    await cms.instruction('Click Save button', async function () {
        await clickMultipleTimes(cms, saveButton, 1);
        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();
    });
}
