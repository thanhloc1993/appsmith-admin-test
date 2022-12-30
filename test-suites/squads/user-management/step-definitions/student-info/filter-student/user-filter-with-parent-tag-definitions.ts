import { userTagAliasWithSuffix } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { StudentDetailTab } from '@supports/types/cms-types';

import { strictEqual } from 'assert';
import { schoolAdminSelectTags } from 'test-suites/squads/user-management/step-definitions/student-info/filter-student/user-filter-with-student-tag-definitions';
import {
    ParentTagAction,
    UserTag,
} from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';
import { schoolAdminChooseTabInStudentDetail } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function schoolAdminSelectParentTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    parentTagAction: ParentTagAction
) {
    const parentTags = scenarioContext.get<UserTag[]>(userTagAliasWithSuffix('parent tag'));
    const parentDiscountTags = scenarioContext.get<UserTag[]>(
        userTagAliasWithSuffix('parent discount tag')
    );

    switch (parentTagAction) {
        case 'single parent tag':
            return await schoolAdminSelectTags(cms, 'Parent Tag', [parentTags[0]]);
        case 'single parent discount tag':
            return await schoolAdminSelectTags(cms, 'Parent Tag', [parentDiscountTags[0]]);
        case 'both parent tag and parent discount tag':
            return await schoolAdminSelectTags(cms, 'Parent Tag', [
                ...parentTags.slice(0, 2),
                ...parentDiscountTags.slice(0, 2),
            ]);
        default:
            return [];
    }
}

export async function schoolAdminSeesFamilyTabIncludesTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    parentTagAction: ParentTagAction
) {
    await cms.instruction(`Go to Family Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
    });

    await Promise.all([
        cms.waitForHasuraResponse('User_GetUsersTagsByIds'),
        cms.waitForSkeletonLoading(),
    ]);

    const parentTags = scenarioContext.get<UserTag[]>(userTagAliasWithSuffix('parent tag'));
    const parentDiscountTags = scenarioContext.get<UserTag[]>(
        userTagAliasWithSuffix('parent discount tag')
    );

    switch (parentTagAction) {
        case 'single parent tag':
            return await assertParentIncludesParentTag(cms, [parentTags[0]]);
        case 'single parent discount tag':
            return await assertParentIncludesParentTag(cms, [parentDiscountTags[0]]);
        case 'both parent tag and parent discount tag':
            return await assertParentIncludesParentTag(cms, [
                ...parentTags.slice(0, 2),
                ...parentDiscountTags.slice(0, 2),
            ]);
        default:
            return [];
    }
}

export async function assertParentIncludesParentTag(cms: CMSInterface, tags: UserTag[]) {
    const page = cms.page!;

    await cms.instruction(`school admin sees the tag match with the UI`, async function () {
        const parentTagFields = page.locator(studentPageSelectors.parentItemTagValue);
        const tagFieldLength = await parentTagFields?.count();

        const isIncludedParentTag = Array.from(Array(tagFieldLength)).some(async (_, i) => {
            const tagContent = (await parentTagFields.nth(i).textContent()) || '';

            return tags.some((tag) => tagContent.includes(tag.user_tag_name));
        });

        const tagStr = tags.map((tag) => tag.user_tag_name).toString();
        strictEqual(isIncludedParentTag, true, `tag is:'${tagStr}'`);
    });
}

export async function schoolAdminGoToStudentDetailByIndex(cms: CMSInterface, indexStudent: number) {
    const page = cms.page!;

    await cms.instruction(
        `school admin go to student detail row:(${indexStudent})`,
        async function () {
            const tableRows = page.locator(studentPageSelectors.tableBaseRow);
            const studentRow = tableRows.nth(indexStudent);
            const NameColumn = await studentRow.locator(studentPageSelectors.tableStudentNameCell);
            await NameColumn.click();
        }
    );
}
