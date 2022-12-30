import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLessonFilterCriteria, aliasRowsPerPage } from 'step-definitions/alias-keys/lesson';
import { schoolAdminClearAllChipsFilterAdvanced } from 'step-definitions/cms-common-definitions';
import {
    chipAutoCompleteWithOption,
    lessonFormFilterAdvancedTextFieldInput,
} from 'step-definitions/cms-selectors/lesson-management';
import { assertNoLessonFilterChips } from 'step-definitions/lesson-combine-of-search-and-filter-lesson.definitions';
import {
    changeRowsPerPageForVirtualizedTable,
    clearInput,
    waitForTableLessonRenderRows,
} from 'step-definitions/lesson-management-utils';
import { assertFilterOptionChipOnFilterPopup } from 'step-definitions/lesson-remain-filter-and-search-result-when-turning-back-from-the-lessons-list-page-definitions';
import { getCMSInterfaceByRole } from 'step-definitions/utils';
import {
    assertAnOptionInLessonListAndLessonInfo,
    FilteredFieldTitle,
    goToDetailOf1stLessonOnLessonList,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

Given(
    '{string} has chosen {string} lessons per page in the first result page',
    async function (this: IMasterWorld, role: AccountRoles, numberOfRowPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} choose ${numberOfRowPerPage} lessons per page in the first result page`,
            async function () {
                await changeRowsPerPageForVirtualizedTable(cms, scenario, numberOfRowPerPage);
            }
        );
    }
);

Given(
    '{string} has chosen {string} lessons per page',
    async function (this: IMasterWorld, role: AccountRoles, numberOfRowPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} choose ${numberOfRowPerPage} lessons per page`,
            async function () {
                await changeRowsPerPageForVirtualizedTable(cms, scenario, numberOfRowPerPage);
            }
        );
    }
);

When(
    '{string} chooses {string} lessons per page',
    async function (this: IMasterWorld, role: AccountRoles, numberOfRowPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} choose ${numberOfRowPerPage} lessons per page`,
            async function () {
                await waitForTableLessonRenderRows(cms);
                await changeRowsPerPageForVirtualizedTable(cms, scenario, numberOfRowPerPage);
            }
        );
    }
);

When(
    '{string} chooses again {string} lessons per page',
    async function (this: IMasterWorld, role: AccountRoles, numberOfRowPerPage: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const latestRowsPerPage = scenario.get(aliasRowsPerPage);

        await cms.instruction(
            `${role} choose ${numberOfRowPerPage} lessons per page`,
            async function () {
                await changeRowsPerPageForVirtualizedTable(cms, scenario, latestRowsPerPage);
            }
        );
    }
);

Then(
    '{string} sees lessons list which matches {string} and {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        _criteria1st: string,
        _criteria2nd: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const lessonFilterCriteria =
            this.scenario.get<FilteredFieldTitle[]>(aliasLessonFilterCriteria);

        await cms.instruction(
            `${role} sees ${lessonFilterCriteria.join(', ')} chip filters in result page`,
            async function () {
                await assertAnOptionInLessonListAndLessonInfo({
                    cms,
                    scenarioContext,
                    options: lessonFilterCriteria,
                    shouldCheckSearchKeyword: false,
                });
            }
        );
    }
);

Then(
    '{string} sees lessons list which matches {string} and {string} and contains the keyword',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        _criteria1st: string,
        _criteria2nd: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const lessonFilterCriteria =
            this.scenario.get<FilteredFieldTitle[]>(aliasLessonFilterCriteria);

        await cms.instruction(
            `${role} sees ${lessonFilterCriteria.join(', ')} chip filters in result page`,
            async function () {
                await assertAnOptionInLessonListAndLessonInfo({
                    cms,
                    scenarioContext,
                    options: lessonFilterCriteria,
                    shouldCheckSearchKeyword: true,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} and {string} chip filters in result page',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        _criteria1st: string,
        _criteria2nd: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        const lessonFilterCriteria =
            this.scenario.get<FilteredFieldTitle[]>(aliasLessonFilterCriteria);

        await cms.instruction(
            `${role} sees ${lessonFilterCriteria.join(', ')} chip filters in result page`,
            async function () {
                for (const criteria of lessonFilterCriteria) {
                    await cms.page!.waitForSelector(chipAutoCompleteWithOption(criteria));
                }
            }
        );
    }
);

Then(
    '{string} sees {string} and {string} chip filters in filter popup',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        _criteria1st: string,
        _criteria2nd: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        const lessonFilterCriteria =
            this.scenario.get<FilteredFieldTitle[]>(aliasLessonFilterCriteria);

        await cms.instruction(
            `${role} sees ${lessonFilterCriteria.join(', ')} chip filters in filter popup`,
            async function () {
                for (const criteria of lessonFilterCriteria) {
                    await assertFilterOptionChipOnFilterPopup(cms, criteria);
                }
            }
        );
    }
);

When(
    '{string} clears all chip filters in result page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} clears all chip filters in result page`, async function () {
            await schoolAdminClearAllChipsFilterAdvanced(cms);
        });
    }
);

Then(
    '{string} sees a lessons list which have students with name contains the keyword',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees a lessons list which have students with name contains the keyword`,
            async function () {
                await goToDetailOf1stLessonOnLessonList(cms, scenario, true);
            }
        );
    }
);

Then(
    '{string} does not see chip filters in result page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees a lessons list which have students with name contains the keyword`,
            async function () {
                await assertNoLessonFilterChips(cms, 'result page');
            }
        );
    }
);

Then(
    '{string} does not see chip filters in filter popup',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees a lessons list which have students with name contains the keyword`,
            async function () {
                await assertNoLessonFilterChips(cms, 'filter popup');
            }
        );
    }
);

When(
    '{string} clears keyword in result page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} clears keyword in result page`, async function () {
            await clearInput(cms, lessonFormFilterAdvancedTextFieldInput);
        });
    }
);

Then(
    '{string} does not sees the keyword in the search bar',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const keyword = await cms.page!.textContent(lessonFormFilterAdvancedTextFieldInput);

        await cms.instruction(
            `${role} does not sees the keyword in the search bar`,
            async function () {
                weExpect(keyword, `Expect ${keyword} is empty string`).toEqual('');
            }
        );
    }
);
