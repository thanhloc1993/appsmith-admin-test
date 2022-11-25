import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertVisibleLessonManagementByStudentName,
    searchLessonOfLessonManagement,
} from './lesson-search-future-lesson-definitions';
import { getCMSInterfaceByRole } from './utils';
import { aliasSearchKeyword } from 'step-definitions/alias-keys/lesson';
import {
    prefixStudentName,
    waitForTableLessonRenderRows,
} from 'step-definitions/lesson-management-utils';

Then(
    '{string} sees a list of lesson which student name contains the keyword',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees a list of lesson which student name contains the keyword`,
            async function () {
                await assertVisibleLessonManagementByStudentName(cms, 'e2e');
            }
        );
    }
);

When('{string} searches for the keyword', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    this.scenario.set(aliasSearchKeyword, prefixStudentName);

    await cms.instruction(
        `${role} searches for the keyword: ${prefixStudentName}`,
        async function () {
            await searchLessonOfLessonManagement(cms, prefixStudentName);
            await waitForTableLessonRenderRows(cms);
        }
    );
});
