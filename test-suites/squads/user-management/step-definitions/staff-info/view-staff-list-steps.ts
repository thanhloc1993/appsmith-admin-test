import { isInPagePositionOnCMS, seesEqualRowsPerPageOnCMS } from '@legacy-step-definitions/utils';
import { PageActionTypes } from '@user-common/constants/enum';
import { AccessTypes, PageTypes } from '@user-common/types/bdd';

import { Given, When, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { PagePosition } from '@supports/types/cms-types';

import {
    goesToStaffManagementAndSaveDataToContext,
    changeRowsPerPage,
    schoolAdminSeesStaffTableDisplayCorrectly,
    schoolAdminGoesToActionPagesInStaffTable,
} from './view-staff-list-definitions';

Given('staff list has more than 3 pages', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    // TODO: @crissang will update this step later
    // check staff already have enough data, if not will create new data

    await goesToStaffManagementAndSaveDataToContext(cms, scenarioContext);
    // await assertStaffListHasMoreThan3Pages(cms, scenarioContext);
});

Given(
    'school admin is not on the {string} page of staff list',
    async function (this: IMasterWorld, page: PageTypes) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const action = page === 'first' ? PageActionTypes.NEXT : PageActionTypes.PERVIOUS;
        if (page === 'first') {
            await cms.instruction(
                `School admin goes to ${action} page, if current page is in ${page} page`,
                async function () {
                    await schoolAdminGoesToActionPagesInStaffTable(cms, scenarioContext, action);
                }
            );
        }
    }
);

When(
    'school admin goes to staff list page by {string}',
    async function (this: IMasterWorld, option: AccessTypes) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await goesToStaffManagementAndSaveDataToContext(cms, scenarioContext, option);
    }
);

When(
    'school admin changes the rows per page of staff list into {string}',
    async function (this: IMasterWorld, rowsPerPage: string) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const numberOfRowsPerPage = +rowsPerPage;

        await changeRowsPerPage(cms, scenarioContext, numberOfRowsPerPage);
    }
);

When(
    'school admin goes to {string} page of staff list',
    async function (this: IMasterWorld, action: PageActionTypes) {
        const scenarioContext = this.scenario;
        await schoolAdminGoesToActionPagesInStaffTable(this.cms, scenarioContext, action);
    }
);

Then(
    'school admin sees the staff list is displayed correctly',
    async function (this: IMasterWorld) {
        const cms = this.cms;

        await cms.instruction(
            'school admin sees the staff table is displayed correctly',
            async () => {
                await schoolAdminSeesStaffTableDisplayCorrectly(cms, this.scenario);
            }
        );
    }
);

Then('school admin sees the staff list is on the first page', async function (this: IMasterWorld) {
    const cms = this.cms;
    await cms.instruction(`School admin is on the first result page`, async function () {
        await isInPagePositionOnCMS(cms, PagePosition.First);
    });
});

Then(
    'school admin sees the rows per page of the staff list is {string}',
    async function (this: IMasterWorld, rowsPerPage: string) {
        const cms = this.cms;
        const numberOfRowsPerPage = +rowsPerPage;

        await cms.instruction(
            `School admin sees rows per page is ${numberOfRowsPerPage}`,
            async function () {
                await seesEqualRowsPerPageOnCMS(cms, numberOfRowsPerPage);
            }
        );
    }
);
