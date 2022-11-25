import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasSearchKeyword } from './alias-keys/lesson';
import {
    assertVisibleLessonManagementByStudentName,
    searchLessonOfLessonManagement,
    seeEmptyResultLessonManagementList,
    seeKeywordInSearchBar,
} from './lesson-search-future-lesson-definitions';
import { getCMSInterfaceByRole, getUserProfileFromContext } from './utils';
import {
    prefixStudentName,
    waitForTableLessonRenderRows,
} from 'step-definitions/lesson-management-utils';

Given(
    '{string} has searched for the keyword',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        this.scenario.set(aliasSearchKeyword, prefixStudentName);

        await cms.instruction(`${role} has searched for the keyword`, async function () {
            await searchLessonOfLessonManagement(cms, prefixStudentName);
            await waitForTableLessonRenderRows(cms);
        });
    }
);

When('{string} removes the keyword', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} removes the keyword`, async function () {
        await searchLessonOfLessonManagement(cms, '');
        await waitForTableLessonRenderRows(cms);
    });
});

When(
    '{string} searches for the student name',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        const scenarioContext = this.scenario;
        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const { name: studentName } = learnerProfile;
        await cms.instruction(`${role} searches for the keyword`, async function () {
            await searchLessonOfLessonManagement(cms, studentName);
        });
    }
);

When(
    '{string} searches for the non existed keyword',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} searches for the keyword`, async function () {
            await searchLessonOfLessonManagement(cms, 'non existed keyword');
        });
    }
);

Then(
    '{string} sees newly created lesson containing specific student name',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenarioContext = this.scenario;
        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const { name: studentName } = learnerProfile;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees newly created lesson containing specific student name`,
            async function () {
                await assertVisibleLessonManagementByStudentName(cms, studentName);
            }
        );
    }
);

Then('{string} sees no result', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} sees no result`, async function () {
        await seeEmptyResultLessonManagementList(cms);
    });
});

Then(
    '{string} sees no keyword in the search bar',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees no keyword in the search bar`, async function () {
            await seeKeywordInSearchBar(cms, '');
        });
    }
);
