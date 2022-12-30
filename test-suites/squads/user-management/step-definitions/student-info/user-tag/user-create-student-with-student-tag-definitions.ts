import { randomInteger } from '@legacy-step-definitions/utils';
import { userTagAliasWithSuffix } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { KeyUserTagType } from '@user-common/types/student';
import { schoolAdminSeesMultipleSnackbar } from '@user-common/utils/check-messages';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    createMasterCSVFile,
    schoolAdminImportsTheMasterFile,
} from '../../master-management/user-import-master-data-definitions';
import { waitForFirstLoading } from '../../user-common-definitions';
import { TypeOfUserTag, UserTag } from './type';
import { UserTagType } from 'node_modules/manabuf/usermgmt/v2/enums_pb';
import { arrayHasItem, splitAndCombinationIntoArray } from 'step-definitions/utils';
import { getUserTagListByType } from 'test-suites/squads/user-management/step-definitions/master-management/user-import-master-data-utils';
import { StudentTagAction } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

export async function checkUserTagMaster(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    userTagTypes: TypeOfUserTag
) {
    const arrayUserTagType = splitAndCombinationIntoArray(userTagTypes) as TypeOfUserTag[];

    for (const userTagType of arrayUserTagType) {
        switch (userTagType) {
            case 'student tag':
                await getTagListByType(cms, scenarioContext, userTagType, 'USER_TAG_TYPE_STUDENT');
                break;
            case 'parent tag':
                await getTagListByType(cms, scenarioContext, userTagType, 'USER_TAG_TYPE_PARENT');
                break;
            case 'student discount tag':
                await getTagListByType(
                    cms,
                    scenarioContext,
                    userTagType,
                    'USER_TAG_TYPE_STUDENT_DISCOUNT'
                );
                break;
            case 'parent discount tag':
                await getTagListByType(
                    cms,
                    scenarioContext,
                    userTagType,
                    'USER_TAG_TYPE_PARENT_DISCOUNT'
                );
                break;
            default:
                break;
        }
    }
}

export async function getTagListByType(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    typeOfUserTag: TypeOfUserTag,
    userTagType: KeyUserTagType,
    limit = 5
) {
    await cms.attach(`Get ${userTagType}`);
    const tagList = await getUserTagListByType(cms, limit, [userTagType]);
    if (!arrayHasItem(tagList) || tagList.length < 5) {
        await cms.attach(`Don't have any ${userTagType}`);

        await importUserTags(cms, scenarioContext, userTagType);

        await cms.attach(`Get ${userTagType} master again`);
        const _tagList = await getUserTagListByType(cms, limit, [userTagType]);
        scenarioContext.set(userTagAliasWithSuffix(typeOfUserTag), _tagList);
        return _tagList;
    }
    scenarioContext.set(userTagAliasWithSuffix(typeOfUserTag), tagList);
    return tagList;
}

export async function importUserTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    userTagType: KeyUserTagType
) {
    await cms.selectMenuItemInSidebarByAriaLabel('Master Management');
    await cms.instruction(
        `Initial Master Management data is created`,
        async function (cms: CMSInterface) {
            await waitForFirstLoading('Master Management', cms, scenarioContext.context);
        }
    );

    await cms.attach(`Importing ${userTagType} master-data...`);
    await createMasterCSVFile(cms, 'User Tag', {
        userTagReferences: { userTagType: UserTagType[userTagType], tagLength: 5 },
    });

    await schoolAdminImportsTheMasterFile(cms, 'User Tag');

    await schoolAdminSeesMultipleSnackbar(
        cms,
        'successful',
        'The records are imported successfully!'
    );
}

export async function schoolAdminAddStudentTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    studentTagAction: StudentTagAction
) {
    const studentTags = scenarioContext.get<UserTag[]>(userTagAliasWithSuffix('student tag'));
    const studentDiscountTags = scenarioContext.get<UserTag[]>(
        userTagAliasWithSuffix('student discount tag')
    );

    switch (studentTagAction) {
        case 'single student tag':
            return await schoolAdminAddTags(cms, [studentTags[0]]);
        case 'single student discount tag':
            return await schoolAdminAddTags(cms, [studentDiscountTags[0]]);
        case 'both student tag and student discount tag':
            return await schoolAdminAddTags(cms, [
                ...studentTags.slice(0, 2),
                ...studentDiscountTags.slice(0, 2),
            ]);
        default:
            return [];
    }
}

export async function schoolAdminAddTags(cms: CMSInterface, tags: UserTag[]) {
    const page = cms.page!;

    for (const tag of tags) {
        await cms.instruction(
            `select ${tag.user_tag_name} - ${tag.user_tag_type}`,
            async function (cms: CMSInterface) {
                await page.fill(`${studentPageSelectors.tagAutoComplete} input`, tag.user_tag_name);
                await cms.waitingAutocompleteLoading();
                await cms.chooseOptionInAutoCompleteBoxByText(tag.user_tag_name);
                if (
                    tag.user_tag_type === 'USER_TAG_TYPE_STUDENT_DISCOUNT' ||
                    tag.user_tag_type === 'USER_TAG_TYPE_PARENT_DISCOUNT'
                ) {
                    await confirmAddRemoveDiscountTagDialog(cms);
                }
            }
        );
    }
    return tags;
}

export async function confirmAddRemoveDiscountTagDialog(cms: CMSInterface, isAdding = true) {
    const page = cms.page!;
    await cms.instruction(`confirm dialog`, async function () {
        const wrapper = await page.locator(studentPageSelectors.dialogWithHeaderFooterWrapper);

        await cms.waitForDataTestId(studentPageSelectors.dialogWithHeaderFooterTitle);
        await cms.assertTheDialogTitleByDataTestId(
            studentPageSelectors.dialogWithHeaderFooterTitle,
            isAdding ? 'Add Discount Tag' : 'Remove Discount Tag'
        );

        const saveButton = await wrapper.locator(
            `${studentPageSelectors.footerDialogConfirmButtonSave}[aria-label="Confirm"]`
        );
        await saveButton.click();
    });
}

export function getUserTagsData(scenarioContext: ScenarioContext, length: number) {
    const studentTags = scenarioContext
        .get<UserTag[]>(userTagAliasWithSuffix('student tag'))
        ?.slice(0, length);
    const studentDiscountTags = scenarioContext
        .get<UserTag[]>(userTagAliasWithSuffix('student discount tag'))
        ?.slice(0, length);
    const parentTags = scenarioContext
        .get<UserTag[]>(userTagAliasWithSuffix('parent tag'))
        ?.slice(0, length);
    const parentDiscountTags = scenarioContext
        .get<UserTag[]>(userTagAliasWithSuffix('parent discount tag'))
        ?.slice(0, length);

    return {
        studentTags,
        studentDiscountTags,
        parentTags,
        parentDiscountTags,
    };
}

export async function getStudentTagForImport(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    isValid: boolean,
    length = 2
) {
    if (isValid) {
        await checkUserTagMaster(cms, scenarioContext, 'student tag & student discount tag');
        const { studentTags, studentDiscountTags } = getUserTagsData(scenarioContext, length);
        const studentTag = `${studentTags
            ?.map((tag) => tag.user_tag_partner_id)
            .join(';')};${studentDiscountTags?.map((tag) => tag.user_tag_partner_id).join(';')}`;
        return studentTag;
    } else {
        await checkUserTagMaster(cms, scenarioContext, 'parent tag & parent discount tag');
        const { parentTags, parentDiscountTags } = getUserTagsData(scenarioContext, 2);
        const invalidStudentTag = [
            `${parentTags?.map((tag) => tag.user_tag_partner_id).join(';')}`,
            `${parentDiscountTags?.map((tag) => tag.user_tag_partner_id).join(';')}`,
            'invalid',
        ][randomInteger(0, 2)];
        return invalidStudentTag;
    }
}

export async function getParentTagForImport(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    isValid: boolean,
    length = 2
) {
    if (isValid) {
        await checkUserTagMaster(cms, scenarioContext, 'parent tag & parent discount tag');
        const { parentTags, parentDiscountTags } = getUserTagsData(scenarioContext, length);
        const parentTag = `${parentTags
            ?.map((tag) => tag.user_tag_partner_id)
            .join(';')};${parentDiscountTags?.map((tag) => tag.user_tag_partner_id).join(';')}`;
        return parentTag;
    } else {
        await checkUserTagMaster(cms, scenarioContext, 'student tag & student discount tag');
        const { studentTags, studentDiscountTags } = getUserTagsData(scenarioContext, 2);
        const invalidParentTag = [
            `${studentTags?.map((tag) => tag.user_tag_partner_id).join(';')}`,
            `${studentDiscountTags?.map((tag) => tag.user_tag_partner_id).join(';')}`,
            'invalid',
        ][randomInteger(0, 2)];
        return invalidParentTag;
    }
}
