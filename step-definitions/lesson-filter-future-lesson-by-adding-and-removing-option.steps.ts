import { When, Given, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getCMSInterfaceByRole } from './utils';
import { waitForTableLessonRenderRows } from 'step-definitions/lesson-management-utils';
import { convertStringTypeToArray } from 'step-definitions/utils';
import {
    assertAnOptionInLessonListAndLessonInfo,
    FilteredFieldTitle,
    selectAndApplyFilterLessonInFilterAdvanced,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

Given(
    '{string} has applied filter with {string},{string},{string},{string},{string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        option1: FilteredFieldTitle,
        option2: FilteredFieldTitle,
        option3: FilteredFieldTitle,
        option4: FilteredFieldTitle,
        option5: FilteredFieldTitle
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const optionsArray: FilteredFieldTitle[] = [option1, option2, option3, option4, option5];

        await cms.instruction(
            `${role} has applied filter with ${option1},${option2},${option3},${option4},${option5}`,
            async function () {
                await selectAndApplyFilterLessonInFilterAdvanced(
                    cms,
                    scenarioContext,
                    optionsArray
                );
            }
        );
    }
);

Given(
    '{string} has applied filter with {string}',
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

When(
    '{string} applies {string} in filter popup',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const remainedOptionsArray: FilteredFieldTitle[] = convertStringTypeToArray(options);

        await cms.instruction(
            `${role} applies ${remainedOptionsArray} in filter popup`,
            async function () {
                await selectAndApplyFilterLessonInFilterAdvanced(
                    cms,
                    scenarioContext,
                    remainedOptionsArray
                );
                await waitForTableLessonRenderRows(cms);
            }
        );
    }
);

Then(
    '{string} sees updated lesson list which matches lesson day of the week and {string}',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const remainedOptionsArray: FilteredFieldTitle[] = convertStringTypeToArray(options);
        remainedOptionsArray.push('Lesson day of the week');

        await cms.instruction(
            `${role} applies ${remainedOptionsArray} in filter popup`,
            async function () {
                await assertAnOptionInLessonListAndLessonInfo({
                    cms,
                    scenarioContext,
                    options: remainedOptionsArray,
                    shouldCheckSearchKeyword: false,
                });
            }
        );
    }
);

Then(
    '{string} sees lesson list which matches {string} without number of array',
    async function (this: IMasterWorld, role: AccountRoles, remainedOption: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const remainedOptionsArray: FilteredFieldTitle[] = convertStringTypeToArray(remainedOption);

        await cms.instruction(
            `${role} sees lesson list which matches ${remainedOption}`,
            async function () {
                await assertAnOptionInLessonListAndLessonInfo({
                    cms,
                    scenarioContext,
                    options: remainedOptionsArray,
                    shouldCheckSearchKeyword: false,
                });
            }
        );
    }
);
