import { randomString } from '@legacy-step-definitions/utils';
import { staffListAlias, staffProfileAlias } from '@user-common/alias-keys/user';

import { When, Then, Given } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    assertStaffListWithKeyword,
    filterStaffByOption,
    goToNextPageOfStaffList,
    searchStaffOnCMS,
} from './user-search-for-staff-definitions';
import { updateStaffByGRPC } from './user-update-staff-definitions';
import { StaffTypes } from './user-view-staff-list-definitions';

When(
    'school admin searches staff by {string}',
    async function (this: IMasterWorld, option: string) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const staffList = scenarioContext.get<StaffTypes[]>(staffListAlias);
        await cms.instruction(`School admin searches staff by ${option}`, async function () {
            await filterStaffByOption(cms, scenarioContext, staffList, option);
        });
    }
);

Then(
    'the staff list is displayed staff which matches keywords',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const staffList = scenarioContext.get<StaffTypes[]>(staffListAlias);
        await cms.instruction(
            'School admin sees staff list name matches keywords',
            async function () {
                await assertStaffListWithKeyword(cms, staffList);
            }
        );
    }
);

Given('school admin has edited staff name', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;
    const page = cms.page!;

    await cms.instruction('School admin goes to next page', async function () {
        const staffList = scenarioContext.get<StaffTypes[]>(staffListAlias);
        await goToNextPageOfStaffList(cms, scenarioContext, staffList);
    });

    const selectedStaff = scenarioContext.get<StaffTypes>(staffProfileAlias);
    await cms.instruction(`School admin edit staff ${selectedStaff.name}`, async function () {
        const newName = randomString(16);
        await updateStaffByGRPC(cms, { ...selectedStaff, name: newName });
    });

    await page.reload();
    await cms.waitForSkeletonLoading();
});

When('school admin searches for old staff name', async function () {
    const cms = this.cms;
    const scenarioContext = this.scenario;
    const selectedStaff = scenarioContext.get<StaffTypes>(staffProfileAlias);
    const keyword = selectedStaff.name;
    await cms.instruction(`School admin searches for ${keyword}`, async function () {
        await searchStaffOnCMS(cms, keyword);
    });
});

When('school admin searches staff by non-existed keywords', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;
    const staffList = scenarioContext.get<StaffTypes[]>(staffListAlias);

    const randomKeywords = randomString(16);
    const nonExistedKeywords = staffList[0].name + ' ' + randomKeywords;

    await searchStaffOnCMS(cms, nonExistedKeywords);
});
