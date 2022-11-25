import { StudentInformation } from '@legacy-step-definitions/types/content';
import { userTagAliasWithSuffix } from '@user-common/alias-keys/user';
import { learnerProfileAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { StudentTagAction, UserTag } from './type';
import {
    schoolAdminAddTags,
    confirmAddRemoveDiscountTagDialog,
} from './user-create-student-with-student-tag-definitions';

export async function schoolAdminEditStudentWithTag(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    studentTagAction: StudentTagAction
) {
    const studentTags = scenarioContext.get<UserTag[]>(userTagAliasWithSuffix('student tag'));
    const studentDiscountTags = scenarioContext.get<UserTag[]>(
        userTagAliasWithSuffix('student discount tag')
    );
    const { studentTags: tags = [], ...studentData } =
        scenarioContext.get<StudentInformation>(learnerProfileAlias);

    let selectedTags: UserTag[] = [];
    switch (studentTagAction) {
        case 'adding single student tag': {
            await schoolAdminAddTags(cms, [studentTags[2]]);
            selectedTags = [...tags, studentTags[2]];
            break;
        }
        case 'adding single student discount tag': {
            await schoolAdminAddTags(cms, [studentDiscountTags[2]]);
            selectedTags = [...tags, studentDiscountTags[2]];
            break;
        }
        case 'adding both student tag and student discount tag': {
            const selectTags = [...studentTags.slice(2, 4), ...studentDiscountTags.slice(2, 4)];
            await schoolAdminAddTags(cms, selectTags);
            selectedTags = [...tags, ...selectTags];
            break;
        }
        case 'removing single student tag': {
            await schoolAdminRemoveTags(cms, [studentTags[0]]);
            selectedTags = tags.filter((tag) => tag.user_tag_id !== studentTags[0].user_tag_id);
            break;
        }
        case 'removing single student discount tag': {
            await schoolAdminRemoveTags(cms, [studentDiscountTags[0]]);
            selectedTags = tags.filter(
                (tag) => tag.user_tag_id !== studentDiscountTags[0].user_tag_id
            );
            break;
        }
        case 'removing both student tag and student discount tag': {
            const selectTags = [studentTags[0], studentDiscountTags[0]];
            await schoolAdminRemoveTags(cms, selectTags);
            selectedTags = tags.filter(
                (tag) => !selectTags.map((item) => item.user_tag_id).includes(tag.user_tag_id)
            );
            break;
        }
        case 'removing all tag': {
            await removeAllChipByIconClear(cms);
            break;
        }
    }
    scenarioContext.set(learnerProfileAlias, {
        ...studentData,
        studentTags: selectedTags,
    });
}

export async function schoolAdminRemoveTags(cms: CMSInterface, tags: UserTag[]) {
    for (const tag of tags) {
        await cms.instruction(
            `remove ${tag.user_tag_name} - ${tag.user_tag_type}`,
            async function (cms: CMSInterface) {
                await removeChipByName(cms, tag.user_tag_name);

                if (
                    tag.user_tag_type === 'USER_TAG_TYPE_STUDENT_DISCOUNT' ||
                    tag.user_tag_type === 'USER_TAG_TYPE_PARENT_DISCOUNT'
                ) {
                    await confirmAddRemoveDiscountTagDialog(cms, false);
                }
            }
        );
    }
    return tags;
}

export async function removeChipByName(cms: CMSInterface, chipName: string) {
    const page = cms.page!;

    const autoComplete = await page.locator(studentPageSelectors.tagAutoComplete);
    await autoComplete.click();

    const chipBox = await page.locator(
        studentPageSelectors.ChipAutoCompleteItem(studentPageSelectors.tagAutoComplete, chipName)
    );

    const deleteChipIcon = await chipBox.locator(studentPageSelectors.chipAutocompleteIconDelete);
    await deleteChipIcon.click();
}

export async function removeAllChipByIconClear(cms: CMSInterface, isConfirm = true) {
    const page = cms.page!;

    const autoComplete = await page.locator(studentPageSelectors.tagAutoComplete);
    await autoComplete.click();

    const clearChipIcon = await autoComplete.locator(
        studentPageSelectors.chipAutocompleteIconClear
    );
    await clearChipIcon.click();

    isConfirm && (await confirmAddRemoveDiscountTagDialog(cms, false));
}
