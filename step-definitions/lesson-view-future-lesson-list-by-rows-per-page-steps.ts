import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { PagePosition } from '@supports/types/cms-types';

import { aliasRowsPerPage } from './alias-keys/lesson';
import { chooseLessonTabOnLessonList } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { changeRowsPerPage, isInPagePositionOnCMS, seesEqualRowsPerPageOnCMS } from './utils';
import { convertOneOfStringTypeToArray, getCMSInterfaceByRole, randomInteger } from './utils';
import { buttonPreviousPageTable } from 'step-definitions/cms-selectors/cms-keys';
import {
    userNavigateTable,
    waitForTableLessonRenderRows,
} from 'step-definitions/lesson-management-utils';

Given(
    '{string} has gone to {string} lessons list page',
    async function (this: IMasterWorld, role: AccountRoles, tabType: 'future' | 'past') {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has gone to ${tabType} page`, async function () {
            await cms.schoolAdminIsOnThePage(Menu.LESSON_MANAGEMENT, 'Lesson Management');

            await chooseLessonTabOnLessonList(cms, tabType);
        });
    }
);

Given(
    '{string} has chosen {string} rows per page in the first result page',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);

        const numberOfRowsPerPage = +rowsPerPage;

        await cms.instruction(
            `${role} has chosen ${numberOfRowsPerPage} rows per page in the first result page`,
            async function () {
                await cms.waitForSkeletonLoading();

                await changeRowsPerPage(cms, numberOfRowsPerPage);
            }
        );
    }
);

Given(
    '{string} has seen {string} lessons in lesson list',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);

        const numberOfRowsPerPage = +rowsPerPage;

        await cms.instruction(
            `${role} has seen ${rowsPerPage} lessons in lesson list`,
            async function () {
                await seesEqualRowsPerPageOnCMS(cms, numberOfRowsPerPage);
            }
        );
    }
);

Given(
    '{string} has gone to the next lesson results page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has gone to the next lesson results page`,
            async function () {
                await waitForTableLessonRenderRows(cms);
                await userNavigateTable(cms, 'NEXT PAGE');
            }
        );
    }
);

When(
    '{string} chooses {string} rows per page',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const randIndex = randomInteger(0, 2);
        const types = convertOneOfStringTypeToArray(rowsPerPage);
        const numberOfRowsPerPage = +types[randIndex];

        scenario.set(aliasRowsPerPage, numberOfRowsPerPage);

        await cms.instruction(
            `${role} chooses ${numberOfRowsPerPage} rows per page`,
            async function () {
                await changeRowsPerPage(cms, numberOfRowsPerPage);
            }
        );
    }
);

When(
    '{string} chooses again {string} rows per page',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);

        const numberOfRowsPerPage = +rowsPerPage;

        await cms.instruction(
            `${role} chooses ${numberOfRowsPerPage} rows per page`,
            async function () {
                await changeRowsPerPage(cms, numberOfRowsPerPage);
            }
        );
    }
);

Then(
    '{string} is redirected to the first result page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is redirected to the first result page`, async function () {
            await waitForTableLessonRenderRows(cms);
            await isInPagePositionOnCMS(cms, PagePosition.First);
        });
    }
);

Then(
    '{string} sees lessons per page is {string}',
    async function (this: IMasterWorld, role: AccountRoles, _rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const latestRowsPerPage = scenario.get(aliasRowsPerPage);

        await cms.instruction(
            `${role} sees lessons per page is ${latestRowsPerPage}`,
            async function () {
                await seesEqualRowsPerPageOnCMS(cms, +latestRowsPerPage);
            }
        );
    }
);

Then(
    '{string} still sees lessons per page is {string}',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);

        const numberOfRowsPerPage = +rowsPerPage;

        await cms.instruction(
            `${role} still sees lessons per page is ${numberOfRowsPerPage}`,
            async function () {
                await seesEqualRowsPerPageOnCMS(cms, numberOfRowsPerPage);
            }
        );
    }
);

Then(
    '{string} is still in the current result page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is still in the current result page`, async function () {
            await isInPagePositionOnCMS(cms, PagePosition.Other);
        });
    }
);

Then(
    '{string} is still in the second lesson results page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} is still in the second lesson results page`,
            async function () {
                const buttonPreviousPaging = await cms.page!.waitForSelector(
                    buttonPreviousPageTable
                );
                const isDisabledButtonPreviousPaging = await buttonPreviousPaging?.isDisabled();
                weExpect(isDisabledButtonPreviousPaging).toEqual(false);
            }
        );
    }
);
