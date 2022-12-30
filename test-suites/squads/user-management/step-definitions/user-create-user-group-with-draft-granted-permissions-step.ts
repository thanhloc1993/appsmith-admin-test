import {
    buttonByAriaLabel,
    checkBoxWithCheckedState,
    inputByValue,
    locationDialog,
    tableBaseRow,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { locationAlias, roleAlias, treeLocationsAlias } from '@user-common/alias-keys/user';
import {
    addNewGrantedPermissionButton,
    userGroupUpsertTableRole,
    userGroupUpsertTableLocation,
    userGroupUpsertTableLocationChips,
    grantedRoleOption,
} from '@user-common/cms-selectors/user-group';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { TreeLocationProps } from '@supports/types/cms-types';

import {
    assertGrantedPermissionsOnEditPage,
    GrantedPermission,
    lastRowGrantedPermissionTableSelector,
    schoolAdminGoesToCreateUserGroupPage,
} from './user-create-user-group-definitions';
import {
    getRandomParentLocation,
    LocationOption,
    LocationResult,
    schoolAdminChecksLocationPopup,
} from './user-create-user-group-with-draft-granted-permissions-definitions';
import { chooseLocations, clickOnSaveInDialog } from './user-definition-utils';

When(
    'school admin creates a user group with a draft granted permission',
    async function (this: IMasterWorld) {
        const cms = this.cms!;
        const context = this.scenario;
        const page = cms.page!;
        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

        await cms.instruction(
            'School admin clicks add button to create draft granted permission',
            async function () {
                const addButton = await page.locator(addNewGrantedPermissionButton);
                await addButton?.click();
            }
        );
    }
);

When(
    'school admin selects {string} role and {string} location',
    async function (this: IMasterWorld, role: string, options: LocationOption) {
        const cms = this.cms;
        const context = this.scenario;
        const endRowTable = await lastRowGrantedPermissionTableSelector(cms);

        await cms.instruction(`School admin chooses role ${role}`, async function () {
            const roleField = endRowTable?.locator(userGroupUpsertTableRole);
            await roleField?.click();
            await cms.page?.locator(grantedRoleOption(role)).click();
        });

        await cms.instruction(`School admin chooses ${options}`, async function () {
            const treeLocations = context.get<TreeLocationProps>(treeLocationsAlias);
            const parentLocation = await getRandomParentLocation(treeLocations);
            context.set(locationAlias, parentLocation);
            context.set(roleAlias, role);
            const locationField = endRowTable?.locator(userGroupUpsertTableLocation);
            await locationField?.click();
            if (parentLocation) {
                if (options === 'parent') await chooseLocations(cms, [parentLocation]);
                else await chooseLocations(cms, parentLocation.children!);
            }
        });
    }
);

Then(
    'school admin sees {string} are selected on location popup',
    async function (this: IMasterWorld, value: LocationResult) {
        const cms = this.cms;
        const context = this.scenario;
        await cms.instruction(
            `School admin sees ${value} locations checked before saving`,
            async function () {
                await schoolAdminChecksLocationPopup(cms, context, value);
            }
        );
        await cms.instruction(
            'School admin clicks save button on location popup',
            async function () {
                await clickOnSaveInDialog(cms);
            }
        );
    }
);

Then(
    'school admin sees {string} location on granted location field',
    async function (this: IMasterWorld, options: LocationOption) {
        const cms = this.cms;
        const context = this.scenario;
        const role = context.get<string>(roleAlias);
        const parentLocation = context.get<TreeLocationProps>(locationAlias);
        const draftGrantedPermission: GrantedPermission = {
            role,
            locations: options === 'parent' ? [parentLocation] : parentLocation.children || [],
        };
        await cms.instruction(
            `School admin sees ${options} location chip in location field`,
            async function () {
                await assertGrantedPermissionsOnEditPage(cms, [draftGrantedPermission]);
            }
        );
    }
);

When(
    'school admin selects {string} for granted role',
    async function (this: IMasterWorld, role: string) {
        const cms = this.cms;
        const endRowTable = await lastRowGrantedPermissionTableSelector(cms);

        await cms.instruction(`School admin chooses role ${role}`, async function () {
            const roleField = endRowTable?.locator(userGroupUpsertTableRole);
            await roleField?.click();
            await cms.page?.locator(grantedRoleOption(role)).click();
        });
    }
);

Then(
    'school admin sees granted location is auto fill organization',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const context = this.scenario;
        const treeLocations = context.get<TreeLocationProps>(treeLocationsAlias);

        await cms.instruction(
            'School admin sees granted location is auto fill organization',
            async function () {
                const endRowTable = await lastRowGrantedPermissionTableSelector(cms);
                const locationField = endRowTable?.locator(userGroupUpsertTableLocation);
                const locationChip = locationField?.locator(userGroupUpsertTableLocationChips);
                weExpect(await locationChip?.count(), `Should have 1 location chip`).toBe(1);

                const chipTextContent = await locationChip?.textContent();
                weExpect(chipTextContent, 'Location chip should be organization').toBe(
                    treeLocations.name
                );
            }
        );
    }
);

Then('school admin is unable to edit location', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;
    const page = cms.page!;
    const treeLocations = context.get<TreeLocationProps>(treeLocationsAlias);

    const schoolAdminRow = page.locator(tableBaseRow, {
        has: page.locator(inputByValue('School Admin')),
    });
    const locationField = schoolAdminRow?.locator(userGroupUpsertTableLocation);

    await cms.instruction('School admin can not click X button', async function () {
        const clearButton = locationField.locator(buttonByAriaLabel('Clear'));
        await clearButton.waitFor({ state: 'detached' });
    });
    await cms.instruction('School admin opens location popup', async function () {
        await locationField.click();
        await cms.waitingForLoadingIcon();
    });

    const locationPopup = cms.page!.locator(locationDialog);

    await cms.instruction('See all checkbox is checked', async function () {
        const allCheckbox = locationPopup.locator(checkBoxWithCheckedState(false));
        weExpect(await allCheckbox.count(), `All checkbox should be checked}`).toBe(0);
    });

    await cms.instruction('School admin clicks org location', async function () {
        await chooseLocations(cms, [treeLocations]);
    });

    await cms.instruction(`School admin is unable to edit locations`, async function () {
        const allCheckbox = locationPopup.locator(checkBoxWithCheckedState(false));
        weExpect(await allCheckbox.count(), `All checkbox should be checked`).toBe(0);
    });
});
