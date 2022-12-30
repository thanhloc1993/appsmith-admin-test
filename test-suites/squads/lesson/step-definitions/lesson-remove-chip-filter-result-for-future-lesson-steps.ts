import { schoolAdminOpenFilterAdvanced } from '@legacy-step-definitions/cms-common-definitions';
import { buttonNextPageTable } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    chipAutocompleteIconDelete,
    chipAutocompleteText,
} from '@legacy-step-definitions/cms-selectors/lesson';
import * as LessonManagementKeys from '@legacy-step-definitions/cms-selectors/lesson-management';
import {
    convertOneOfStringTypeToArray,
    getCMSInterfaceByRole,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertLessonDateTimeAndDayOfTheWeek,
    FilteredFieldTitle,
    removeChipInFilterPopup,
    seeLessonInfoMatchingRemainedOption,
    selectAndApplyFilterLessonInFilterAdvanced,
    OtherFilteredOptions,
    TimeOptions,
    getFilteredOptionsList,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

Given(
    '{string} has filtered with {string}',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const optionsArray = options
            .split(',')
            .map((option) => option.trim()) as FilteredFieldTitle[];

        await cms.instruction(`${role} has applied filter with ${options}`, async function () {
            await selectAndApplyFilterLessonInFilterAdvanced(cms, scenarioContext, optionsArray);
        });
    }
);

Given('{string} has gone to another result page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} has gone to another result page`, async function () {
        const nextButton = await cms.page!.waitForSelector(buttonNextPageTable);
        const isEnabled = await nextButton.isEnabled();
        if (isEnabled) await nextButton.click();
    });
});

When(
    '{string} removes {string} in result page',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} removes ${option} in result page`, async function () {
            await cms.selectElementWithinWrapper(
                LessonManagementKeys.chipAutoCompleteWithOption(option),
                chipAutocompleteIconDelete
            );
        });
    }
);

Then(
    '{string} sees lesson list which matches {string}',
    async function (this: IMasterWorld, role: AccountRoles, remainedOption: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        // convert remained options to array
        const remainedOptionsArray: TimeOptions[] = convertOneOfStringTypeToArray(remainedOption);

        await cms.instruction(
            `${role} sees lesson list which matches ${remainedOption}`,
            async function () {
                await assertLessonDateTimeAndDayOfTheWeek(
                    cms,
                    scenarioContext,
                    remainedOptionsArray
                );
            }
        );
    }
);

Then(
    '{string} sees {string} chip filters in result page',
    async function (this: IMasterWorld, role: AccountRoles, remainedOption: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees ${remainedOption} chip filters in result page`,
            async function () {
                const optionsArray = convertOneOfStringTypeToArray(remainedOption);
                for (const option of optionsArray) {
                    await cms.page!.waitForSelector(
                        `${chipAutocompleteText}:has-text("${option}")`
                    );
                }
            }
        );
    }
);

Then(
    '{string} does not see {string} chip filter in result page',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;
        await cms.instruction(
            `${role} see does not see ${option} chip filter in result page`,
            async function () {
                weExpect(page).not.toContain(`${chipAutocompleteText}:has-text("${option}")`);
            }
        );
    }
);

When(
    '{string} removes {string} in filter popup',
    async function (this: IMasterWorld, role: AccountRoles, option: FilteredFieldTitle) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} removes ${option} in filter popup`, async function () {
            await schoolAdminOpenFilterAdvanced(cms);
            await removeChipInFilterPopup(cms, option);
        });
    }
);

Then(
    '{string} sees lesson info which matches {string}',
    async function (this: IMasterWorld, role: AccountRoles, remainedOption: OtherFilteredOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const remainedOptionsArray: OtherFilteredOptions[] =
            convertOneOfStringTypeToArray(remainedOption);

        const filteredOptionsList = getFilteredOptionsList(scenarioContext);

        await cms.instruction(
            `${role} sees lesson info which matches ${remainedOption}`,
            async function () {
                await seeLessonInfoMatchingRemainedOption(
                    cms,
                    remainedOptionsArray,
                    filteredOptionsList
                );
            }
        );
    }
);
