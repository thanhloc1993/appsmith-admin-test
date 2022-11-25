import { parentProfilesAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { When, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { ParentTagAction } from './type';
import { schoolAdminCreateStudentAndParentWithTags } from './user-create-parent-with-parent-tag-definitions';
import { strictEqual } from 'assert';
import { ParentInformation } from 'test-suites/squads/user-management/step-definitions/common/types/student';

When(
    'school admin creates a new student with parent and {string}',
    async function (this: IMasterWorld, parentTagAction: ParentTagAction) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        await schoolAdminCreateStudentAndParentWithTags(cms, scenarioContext, parentTagAction);
    }
);

Then('school admin sees the parent with parent tag on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const page = cms.page!;
    const scenarioContext = this.scenario;
    const { parentTags = [], ...parentInfo } =
        scenarioContext.get<ParentInformation>(parentProfilesAlias);

    await cms.instruction(`school admin sees the tag match with the UI`, async function () {
        const parentRow = await page.locator(studentPageSelectors.studentParentList, {
            hasText: parentInfo.email,
        });

        const email = await parentRow
            .locator(studentPageSelectors.parentItemEmailValue)
            .textContent();
        strictEqual(email, parentInfo.email, `Parent email should match with the UI`);

        const parentTagContent = await parentRow
            .locator(studentPageSelectors.parentItemTagValue)
            .innerText();
        const tagLength =
            parentTagContent && parentTagContent !== '--'
                ? parentTagContent?.split(', ').length
                : 0;

        strictEqual(tagLength, parentTags.length, `total tag should match with the UI`);
        for (const tag of parentTags) {
            const isIncludes = parentTagContent.includes(tag.user_tag_name);
            strictEqual(isIncludes, true, `tag should match with the UI`);
        }
    });
});
