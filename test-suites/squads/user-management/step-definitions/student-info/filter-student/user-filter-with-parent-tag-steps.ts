import { clickApplyFilterAndCloseDialogFilter } from '@user-common/utils/click-actions';

import { When, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { schoolAdminSelectParentTags } from 'test-suites/squads/user-management/step-definitions/student-info/filter-student/user-filter-with-parent-tag-definitions';
import {
    schoolAdminSeesFamilyTabIncludesTags,
    schoolAdminGoToStudentDetailByIndex,
} from 'test-suites/squads/user-management/step-definitions/student-info/filter-student/user-filter-with-parent-tag-definitions';
import { ParentTagAction } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

When(
    "school admin filter the parent's student with tag {string}",
    async function (this: IMasterWorld, parentTagAction: ParentTagAction) {
        const cms = this.cms;
        const page = cms.page!;
        const scenarioContext = this.scenario;

        await cms.instruction(`Go to student management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await cms.instruction(`open filter popup`, async function () {
            await page.locator('button', { hasText: 'Filter' }).click();
        });

        await schoolAdminSelectParentTags(cms, scenarioContext, parentTagAction);

        await clickApplyFilterAndCloseDialogFilter(cms);

        await cms.waitForSkeletonLoading();
    }
);

Then(
    "school admin goes to detail sees the parent's student includes tag {string}",
    async function (this: IMasterWorld, parentTagAction: ParentTagAction) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await schoolAdminGoToStudentDetailByIndex(cms, 1);

        await schoolAdminSeesFamilyTabIncludesTags(cms, scenarioContext, parentTagAction);
    }
);
