import { clickApplyFilterAndCloseDialogFilter } from '@user-common/utils/click-actions';

import { When, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import {
    schoolAdminSelectStudentTags,
    schoolAdminSeesAllStudentIncludesTags,
} from 'test-suites/squads/user-management/step-definitions/student-info/filter-student/user-filter-with-student-tag-definitions';
import { StudentTagAction } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

When(
    'school admin filter the student with tag {string}',
    async function (this: IMasterWorld, studentTagAction: StudentTagAction) {
        const cms = this.cms;
        const page = cms.page!;
        const scenarioContext = this.scenario;

        await cms.instruction(`Go to student management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await cms.instruction(`open filter popup`, async function () {
            await page.locator('button', { hasText: 'Filter' }).click();
        });

        await schoolAdminSelectStudentTags(cms, scenarioContext, studentTagAction);

        await clickApplyFilterAndCloseDialogFilter(cms);

        await Promise.all([
            cms.waitForHasuraResponse('User_GetUsersTagsByIds'),
            cms.waitForSkeletonLoading(),
        ]);
    }
);

Then(
    'school admin sees all student includes tag {string}',
    async function (this: IMasterWorld, studentTagAction: StudentTagAction) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await schoolAdminSeesAllStudentIncludesTags(cms, scenarioContext, studentTagAction);
    }
);
