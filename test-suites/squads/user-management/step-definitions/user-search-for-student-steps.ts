import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    getTotalRecordsOfDataTable,
    randomString,
    isInPagePositionOnCMS,
    seesEqualRowsPerPageOnCMS,
    changeRowsPerPage,
} from '@legacy-step-definitions/utils';
import { splitAndCombinationIntoArray } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, totalStudentsAlias } from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { MappedLearnerProfile, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { PagePosition } from '@supports/types/cms-types';

import {
    searchStudentOnCMS,
    clearSearchStudentOnCMS,
    seeEmptyResultListOnCMS,
    findNewlyCreatedStudent,
} from './user-definition-utils';
import {
    assertStudentWithCourseGrade,
    filterStudentByCourseGrade,
} from './user-search-for-student-definitions';
import { strictEqual } from 'assert';

export type KeywordAllow = Pick<
    UserProfileEntity,
    | 'name'
    | 'firstName'
    | 'lastName'
    | 'firstNamePhonetic'
    | 'lastNamePhonetic'
    | 'fullNamePhonetic'
>;

Given(
    'school admin changes the rows per page into {string}',
    async function (this: IMasterWorld, rowsPerPage: string) {
        const cms = this.cms;
        const numberOfRowsPerPage = +rowsPerPage;

        await cms.instruction(
            `School admin change the rows per page into ${numberOfRowsPerPage}`,
            async function () {
                await changeRowsPerPage(cms, numberOfRowsPerPage);
            }
        );
    }
);

When('school admin searches for keywords', async function (this: IMasterWorld) {
    const cms = this.cms;
    const profile = this.scenario.get<MappedLearnerProfile>(learnerProfileAlias);
    await searchStudentOnCMS(cms, profile.name);
});

When(
    'school admin searches for {string} keywords',
    async function (this: IMasterWorld, keywordType: string) {
        const cms = this.cms;
        const profile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

        const keywords = splitAndCombinationIntoArray(keywordType);
        const _keywords = keywords.map((word) => {
            const field = word as keyof KeywordAllow;
            return profile[field];
        });
        const searchKey = _keywords.join(' ');

        await cms.instruction(`School admin search: '${searchKey}'`, async function () {
            if (searchKey) await searchStudentOnCMS(cms, searchKey);
            await cms.page?.waitForTimeout(1000); //wait to screenshot
        });
    }
);

When(
    'school admin filters student by {string}',
    async function (this: IMasterWorld, option: string) {
        const cms = this.cms;
        const page = cms.page!;
        const profile = this.scenario.get<MappedLearnerProfile>(learnerProfileAlias);

        await cms.instruction('School admin clicks filter button', async function () {
            await page.click(CMSKeys.openFilterAdvancedPopupButton);
            await cms.waitingAutocompleteLoading();
        });
        await cms.instruction(`School admin filters by ${option}`, async function () {
            await filterStudentByCourseGrade(cms, option, profile);
        });
    }
);

Then(
    'the student list is displayed student which matches keywords and {string}',
    async function (this: IMasterWorld, option: string) {
        const cms = this.cms;
        const learnerProfile = this.scenario.get<MappedLearnerProfile>(learnerProfileAlias);
        await cms.instruction(
            `Find student ${learnerProfile.name} on student list`,
            async function () {
                await assertStudentWithCourseGrade(cms, learnerProfile, option);
            }
        );
    }
);
When('school admin removes the keywords', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    // make sure data of prev step has been response
    await Promise.all([
        cms.waitForHasuraResponse('User_GetStudentListWithFilter'),
        cms.waitForHasuraResponse('User_CountStudentListWithFilter'),
        cms.waitForSkeletonLoading(),
    ]);

    await clearSearchStudentOnCMS(cms);
    const result = await cms.waitForHasuraResponse('User_CountStudentListWithFilter');

    const totalStudents = result.resp?.data?.users_aggregate?.aggregate?.count || 0;
    scenarioContext.set(totalStudentsAlias, totalStudents);
});

When('school admin searches for non-existed keywords', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
    const randomKeywords = randomString(16);

    const nonExistedKeywords = learnerProfile.name + ' ' + randomKeywords;

    await searchStudentOnCMS(cms, nonExistedKeywords);
});

Then(
    'the student list is displayed student which matches keywords',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        await cms.instruction(
            `Find student ${learnerProfile.name} on student list`,
            async function () {
                await findNewlyCreatedStudent(cms, learnerProfile);
            }
        );
    }
);

Then('no result page is displayed', async function (this: IMasterWorld) {
    const cms = this.cms;

    await seeEmptyResultListOnCMS(cms);
});

Then('the student list is displayed full records', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const totalStudents = scenarioContext.get(totalStudentsAlias);

    await cms.waitForSkeletonLoading();

    await cms.instruction('Expect the student length should be matched with UI', async () => {
        const totalRecords = await getTotalRecordsOfDataTable(cms);

        strictEqual(
            totalRecords,
            totalStudents.toString(),
            'Total students should match with the UI'
        );
    });
});

Then(
    'school admin is on the first page of student list with {string} rows per page',
    async function (this: IMasterWorld, rowsPerPage: string) {
        const cms = this.cms;

        await cms.waitForSkeletonLoading();

        await cms.instruction(`School admin is on the first result page`, async function () {
            await isInPagePositionOnCMS(cms, PagePosition.First);
        });

        await cms.instruction(
            `School admin sees rows per page is ${rowsPerPage}`,
            async function () {
                await seesEqualRowsPerPageOnCMS(cms, +rowsPerPage);
            }
        );
    }
);
