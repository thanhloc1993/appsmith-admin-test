import { userTagAliasWithSuffix } from '@user-common/alias-keys/user';
import { parentProfilesAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ParentTagAction, UserTag } from './type';
import { ParentInformation } from 'test-suites/squads/user-management/step-definitions/common/types/student';
import { schoolAdminAddTags } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/user-create-student-with-student-tag-definitions';
import {
    schoolAdminRemoveTags,
    removeAllChipByIconClear,
} from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/user-edit-student-with-student-tag-definitions';
import {
    clickOnSaveButtonInParentElement,
    clickOnEditParentByEmail,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function schoolAdminEditStudentAndParentWithTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    parentTagAction: ParentTagAction
) {
    const page = cms.page!;

    const parentInfo = scenarioContext.get<ParentInformation>(parentProfilesAlias);

    await clickOnEditParentByEmail(cms, parentInfo.email);

    await schoolAdminEditParentTags(cms, scenarioContext, parentTagAction);

    await cms.instruction(`Click on save button`, async function () {
        const addParentDialog = await page.$(studentPageSelectors.dialogWithHeaderFooterWrapper);

        await clickOnSaveButtonInParentElement(cms, addParentDialog);
        await cms.waitingForLoadingIcon();
    });

    await Promise.all([
        cms.waitForHasuraResponse('User_GetUsersTagsByIds'),
        cms.waitForSkeletonLoading(),
    ]);
}

export async function schoolAdminEditParentTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    parentTagAction: ParentTagAction
) {
    const parentTags = scenarioContext.get<UserTag[]>(userTagAliasWithSuffix('parent tag'));
    const parentDiscountTags = scenarioContext.get<UserTag[]>(
        userTagAliasWithSuffix('parent discount tag')
    );
    const { parentTags: tags = [], ...parentData } =
        scenarioContext.get<ParentInformation>(parentProfilesAlias);

    let selectedTags: UserTag[] = [];
    switch (parentTagAction) {
        case 'adding single parent tag': {
            await schoolAdminAddTags(cms, [parentTags[2]]);
            selectedTags = [...tags, parentTags[2]];
            break;
        }
        case 'adding single parent discount tag': {
            await schoolAdminAddTags(cms, [parentDiscountTags[2]]);
            selectedTags = [...tags, parentDiscountTags[2]];
            break;
        }
        case 'adding both parent tag and parent discount tag': {
            const selectTags = [...parentTags.slice(2, 4), ...parentDiscountTags.slice(2, 4)];
            await schoolAdminAddTags(cms, selectTags);
            selectedTags = [...tags, ...selectTags];
            break;
        }
        case 'removing single parent tag': {
            await schoolAdminRemoveTags(cms, [parentTags[0]]);
            selectedTags = tags.filter((tag) => tag.user_tag_id !== parentTags[0].user_tag_id);
            break;
        }
        case 'removing single parent discount tag': {
            await schoolAdminRemoveTags(cms, [parentDiscountTags[0]]);
            selectedTags = tags.filter(
                (tag) => tag.user_tag_id !== parentDiscountTags[0].user_tag_id
            );
            break;
        }
        case 'removing both parent tag and parent discount tag': {
            const selectTags = [parentTags[0], parentDiscountTags[0]];
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

    scenarioContext.set(parentProfilesAlias, {
        ...parentData,
        parentTags: selectedTags,
    });
}
