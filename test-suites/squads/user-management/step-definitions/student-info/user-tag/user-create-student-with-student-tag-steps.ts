import { learnerProfileAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { Given, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { TypeOfUserTag } from './type';
import { checkUserTagMaster } from './user-create-student-with-student-tag-definitions';
import { strictEqual } from 'assert';

Given(
    'school admin has imported {string} master data',
    async function (this: IMasterWorld, userTagTypes: TypeOfUserTag) {
        await checkUserTagMaster(this.cms, this.scenario, userTagTypes);
    }
);

Then('school admin sees the student with student tag on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const page = cms.page!;
    const scenarioContext = this.scenario;
    const { studentTags = [] } = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await cms.instruction(`school admin sees the tag match with the UI`, async function () {
        const studentDetailInfo = await page.locator(studentPageSelectors.tabStudentDetailRoot);
        const studentTagItem = await studentDetailInfo.locator(
            studentPageSelectors.generalTagValue
        );
        const studentTagContent = await studentTagItem.innerText();
        const tagLength =
            studentTagContent && studentTagContent !== '--'
                ? studentTagContent?.split(', ').length
                : 0;

        strictEqual(tagLength, studentTags.length, `total tag should match with the UI`);
        for (const tag of studentTags) {
            const isIncludes = studentTagContent.includes(tag.user_tag_name);
            strictEqual(isIncludes, true, `tag should match with the UI`);
        }
    });
});
