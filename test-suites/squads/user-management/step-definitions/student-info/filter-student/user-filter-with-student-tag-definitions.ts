import { userTagAliasWithSuffix } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { strictEqual } from 'assert';
import {
    StudentTagAction,
    UserTag,
    UserTagLabel,
} from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

export async function schoolAdminSelectStudentTags(
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
            return await schoolAdminSelectTags(cms, 'Student Tag', [studentTags[0]]);
        case 'single student discount tag':
            return await schoolAdminSelectTags(cms, 'Student Tag', [studentDiscountTags[0]]);
        case 'both student tag and student discount tag':
            return await schoolAdminSelectTags(cms, 'Student Tag', [
                ...studentTags.slice(0, 2),
                ...studentDiscountTags.slice(0, 2),
            ]);
        default:
            return [];
    }
}

export async function schoolAdminSelectTags(
    cms: CMSInterface,
    label: UserTagLabel,
    tags: UserTag[]
) {
    const page = cms.page!;

    for (const tag of tags) {
        await cms.instruction(
            `select ${tag.user_tag_name} - ${tag.user_tag_type}`,
            async function (cms: CMSInterface) {
                await page.fill(
                    `${studentPageSelectors.tagAutoComplete}:has(label:has-text("${label}")) input`,
                    tag.user_tag_name
                );
                await cms.waitingAutocompleteLoading();
                await cms.chooseOptionInAutoCompleteBoxByText(tag.user_tag_name);
            }
        );
    }
    return tags;
}

export async function schoolAdminSeesAllStudentIncludesTags(
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
            return await studentRowIncludesTags(cms, [studentTags[0]]);
        case 'single student discount tag':
            return await studentRowIncludesTags(cms, [studentDiscountTags[0]]);
        case 'both student tag and student discount tag':
            return await studentRowIncludesTags(cms, [
                ...studentTags.slice(0, 2),
                ...studentDiscountTags.slice(0, 2),
            ]);
        default:
            return [];
    }
}

export async function studentRowIncludesTags(cms: CMSInterface, tags: UserTag[]) {
    const page = cms.page!;

    await cms.instruction(`school admin sees the tag match with the UI`, async function () {
        const tableRows = page.locator(studentPageSelectors.tableBaseRow);
        const studentLength = await tableRows?.count();
        const tagStr = tags.map((tag) => tag.user_tag_name).toString();

        const tagHeader = page
            .locator(studentPageSelectors.tableBaseHeader)
            .locator(studentPageSelectors.tableStudentTagCell);

        await tagHeader.scrollIntoViewIfNeeded();

        for (let i = 0; i < studentLength; i++) {
            const studentRow = tableRows.nth(i);
            const tagContent = await studentRow
                .locator(studentPageSelectors.tableStudentTagCell)
                .innerText();

            const isIncludes = tags.some((tag) => tagContent.includes(tag.user_tag_name));

            strictEqual(
                isIncludes,
                true,
                `tag:'${tagStr}' included student row ${i + 1}:'${tagContent}'`
            );
        }
    });
}
