import { currentUserGroupsAlias } from '@user-common/alias-keys/user';
import {
    userGroupChipDeleteIcon,
    userGroupChip,
    userGroupFieldClearIcon,
    autocompleteBaseOption,
    userGroupsAutocompleteLoading,
} from '@user-common/cms-selectors/staff';

import { CMSInterface } from '@supports/app-types';
import { emptyValue } from '@supports/constants';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

export async function editStaffRemovesUserGroups(
    cms: CMSInterface,
    context: ScenarioContext,
    numberOfUserGroupsToRemove: number,
    option: string
) {
    await cms.instruction(
        `School admin removes ${numberOfUserGroupsToRemove} user group by using X button on ${option}`,
        async function () {
            const cmsPage = cms.page!;

            await cms.waitingAutocompleteLoading(userGroupsAutocompleteLoading);
            const userGroupsListField = cmsPage.getByLabel('User Group');
            await userGroupsListField.waitFor();

            const userGroupOptions = cmsPage?.locator(autocompleteBaseOption);
            const userGroupChips = cmsPage?.locator(userGroupChip);

            const numOfUserGroupOptionsBefore = (await userGroupOptions?.count()) ?? 0;
            const numOfUserGroupChipsBefore = (await userGroupChips?.count()) ?? 0;

            const deleteIcon =
                option === 'chip'
                    ? cmsPage?.locator(`${userGroupChipDeleteIcon} >> nth=0`)
                    : cmsPage?.locator(userGroupFieldClearIcon);

            await deleteIcon?.click();

            await cms.instruction(
                'school admin sees that user group removed from user group field',
                async function assertUserGroupsRemoved() {
                    const numOfUserGroupChipsAfter = (await userGroupChips?.count()) ?? 0;

                    const remainUserGroups = numOfUserGroupChipsBefore - numberOfUserGroupsToRemove;

                    weExpect(numOfUserGroupChipsAfter).toBe(remainUserGroups);
                }
            );

            await cms.instruction(
                'school admin sees that removed user groups shown in user group dropdown list again',
                async function assertUserGroupsOnStaffList() {
                    const numOfUserGroupOptionsAfter = (await userGroupOptions?.count()) ?? 0;

                    const expectedUserGroupOptions =
                        numOfUserGroupOptionsBefore + numberOfUserGroupsToRemove;

                    weExpect(numOfUserGroupOptionsAfter).toBe(expectedUserGroupOptions);
                }
            );

            await saveCurrentUserGroups(cms, context);
        }
    );

    await cms.instruction('Click Save button', async function (this: CMSInterface) {
        await this.selectAButtonByAriaLabel('Save');
    });
}

export async function saveCurrentUserGroups(cms: CMSInterface, context: ScenarioContext) {
    const userGroupChips = await cms.getTextContentMultipleElements(userGroupChip);
    const userGroupNames = userGroupChips.join(', ');
    context.set(currentUserGroupsAlias, userGroupNames);
}

export async function assertUserGroupOnStaffList(
    cms: CMSInterface,
    context: ScenarioContext,
    expect: string,
    staff: UserProfileEntity
) {
    const cmsPage = cms?.page;
    const staffRow = cmsPage?.locator('tr', {
        hasText: staff.name,
    });

    const userGroupNamesUI = await staffRow?.locator('td >> nth=-1').textContent();
    const userGroupNames = expect === 'sees' ? context.get(currentUserGroupsAlias) : emptyValue;

    weExpect(userGroupNamesUI).toBe(userGroupNames);
}

export async function editStaffAddsUserGroups(
    cms: CMSInterface,
    context: ScenarioContext,
    numberOfUserGroupsToAdd = 0
) {
    await cms.instruction(
        `School admin adds ${numberOfUserGroupsToAdd} user groups`,
        async function () {
            const cmsPage = cms.page!;

            await cms.waitingAutocompleteLoading(userGroupsAutocompleteLoading);
            const userGroupsListField = cmsPage.getByLabel('User Group');
            await userGroupsListField.waitFor();

            const userGroupOptions = cmsPage?.locator(autocompleteBaseOption);
            const userGroupChips = cmsPage?.locator(userGroupChip);

            const numOfUserGroupOptionsBefore = (await userGroupOptions?.count()) ?? 0;
            const numOfUserGroupChipsBefore = (await userGroupChips?.count()) ?? 0;

            for (let i = 0; i < numberOfUserGroupsToAdd; i++) {
                await cms.chooseOptionInAutoCompleteBoxByOrder(1);
            }

            await cms.instruction(
                'school admin sees that user group added to user group field',
                async function assertUserGroupsAdded() {
                    const numOfUserGroupChipsAfter = (await userGroupChips?.count()) ?? 0;

                    const currentUserGroups = numOfUserGroupChipsBefore + numberOfUserGroupsToAdd;

                    weExpect(numOfUserGroupChipsAfter).toBe(currentUserGroups);
                }
            );

            await cms.instruction(
                'school admin sees that added user groups removed from user group dropdown list',
                async function assertUserGroupsOnStaffList() {
                    const numOfUserGroupOptionsAfter = (await userGroupOptions?.count()) ?? 0;

                    const remainUserGroupOptions =
                        numOfUserGroupOptionsBefore - numberOfUserGroupsToAdd;

                    weExpect(numOfUserGroupOptionsAfter).toBe(remainUserGroupOptions);
                }
            );

            await saveCurrentUserGroups(cms, context);
        }
    );

    await cms.instruction('Click Save button', async function (this: CMSInterface) {
        await this.selectAButtonByAriaLabel('Save');
    });
}

export async function assertNewUserGroupsOnStaffList(
    cms: CMSInterface,
    context: ScenarioContext,
    staff: UserProfileEntity
) {
    const cmsPage = cms?.page;
    const staffRow = cmsPage?.locator('tr', {
        hasText: staff.name,
    });

    const userGroupNamesUI = await staffRow?.locator('td >> nth=-1').textContent();
    const userGroupNames = context.get(currentUserGroupsAlias);

    weExpect(userGroupNamesUI?.length).toBe(userGroupNames.length);
}
