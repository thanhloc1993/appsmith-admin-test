import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasSearchKeyword } from './alias-keys/lesson';
import { chipAutocompleteText } from './cms-selectors/lesson';
import { assertFilterOptionChipOnFilterPopup } from './lesson-remain-filter-and-search-result-when-turning-back-from-the-lessons-list-page-definitions';
import { seeKeywordInSearchBar } from './lesson-search-future-lesson-definitions';
import { getCMSInterfaceByRole } from './utils';
import {
    assertAnOptionInLessonListAndLessonInfo,
    FilteredFieldTitle,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

Then(
    '{string} sees an {string} chip filters in result page',
    async function (this: IMasterWorld, role: AccountRoles, chipName: FilteredFieldTitle) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees an ${chipName} chip filters in result page`,
            async function () {
                await cms.page!.waitForSelector(`${chipAutocompleteText}:has-text("${chipName}")`);
            }
        );
    }
);

Then(
    '{string} sees an {string} chip filters in filter popup',
    async function (this: IMasterWorld, role: AccountRoles, option: FilteredFieldTitle) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees an ${option} chip filters in filter popup`,
            async function () {
                await assertFilterOptionChipOnFilterPopup(cms, option);
            }
        );
    }
);

Then(
    '{string} sees the keyword in the search bar',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const theKeyword = scenarioContext.get(aliasSearchKeyword);

        await cms.instruction(`${role} sees the keyword in the search bar`, async function () {
            await seeKeywordInSearchBar(cms, theKeyword);
        });
    }
);

Then(
    '{string} sees lesson list which matches {string} and contains the keyword',
    async function (this: IMasterWorld, role: AccountRoles, option: FilteredFieldTitle) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees lesson list which matches ${option} and contains the keyword`,
            async function () {
                await assertAnOptionInLessonListAndLessonInfo({
                    cms,
                    scenarioContext,
                    options: [option],
                    shouldCheckSearchKeyword: true,
                });
            }
        );
    }
);
