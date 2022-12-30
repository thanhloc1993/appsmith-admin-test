import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { aliasRowsPerPage } from './alias-keys/lesson';
import { chooseLessonTabOnLessonList } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { seesItemLengthLessThanOrEqualRowsPerPageOnCMS, seesEqualRowsPerPageOnCMS } from './utils';
import { getCMSInterfaceByRole } from './utils';

When(
    '{string} goes to {string} lessons list page',
    async function (this: IMasterWorld, role: AccountRoles, tabType: 'future' | 'past') {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} goes to ${tabType} page`, async function () {
            await cms.schoolAdminIsOnThePage(Menu.LESSON_MANAGEMENT, 'Lesson Management');

            await chooseLessonTabOnLessonList(cms, tabType);
        });
    }
);

When(
    '{string} goes back to {string} lessons list page',
    async function (this: IMasterWorld, role: AccountRoles, tabType: 'future' | 'past') {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} goes back to ${tabType} page`, async function () {
            await cms.schoolAdminIsOnThePage(Menu.LESSON_MANAGEMENT, 'Lesson Management');

            await chooseLessonTabOnLessonList(cms, tabType);
        });
    }
);

Then(
    '{string} sees default rows per page is {string}',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);

        const numberOfRowsPerPage = +rowsPerPage;

        await cms.instruction(
            `${role} sees default rows per page is ${rowsPerPage}`,
            async function () {
                await cms.waitForSkeletonLoading();

                await seesEqualRowsPerPageOnCMS(cms, numberOfRowsPerPage);
            }
        );
    }
);

Then(
    '{string} sees number of lesson is equal or less than {string} in lesson list',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const numberOfRowsPerPage =
            rowsPerPage === '10' ? rowsPerPage : scenario.get(aliasRowsPerPage);

        await cms.instruction(
            `${role} sees number of lesson is equal or less than ${numberOfRowsPerPage} in lesson list`,
            async function () {
                await seesItemLengthLessThanOrEqualRowsPerPageOnCMS(cms, numberOfRowsPerPage);
            }
        );
    }
);
