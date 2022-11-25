import { When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getCMSInterfaceByRole } from './utils';
import {
    assertDateAndTimeOptionInLessonList,
    FilteredDateOptions,
    FilteredTimeOptions,
} from 'step-definitions/lesson-filter-future-lesson-by-date-and-time-definitions';
import { assertFilterOptionChipOnFilterPopup } from 'step-definitions/lesson-remain-filter-and-search-result-when-turning-back-from-the-lessons-list-page-definitions';
import {
    FilteredFieldTitle,
    selectAndApplyFilterLessonInFilterAdvanced,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

When(
    '{string} applies filter lesson date with {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: FilteredDateOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} applies filter lesson date with ${option}`,
            async function () {
                await selectAndApplyFilterLessonInFilterAdvanced(cms, scenarioContext, [option]);
            }
        );
    }
);

Then(
    '{string} sees a lesson list which lesson date matches {string}',
    async function (role: AccountRoles, option: FilteredDateOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} sees a lesson list which lesson date matches ${option}`,
            async function () {
                await assertDateAndTimeOptionInLessonList({
                    cms,
                    scenarioContext,
                    option,
                });
            }
        );
    }
);

When(
    '{string} applies filter lesson time with {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: FilteredTimeOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} applies filter lesson time with ${option}`,
            async function () {
                await selectAndApplyFilterLessonInFilterAdvanced(cms, scenarioContext, [option]);
            }
        );
    }
);

Then(
    '{string} sees a lesson list which lesson time matches {string}',
    async function (role: AccountRoles, option: FilteredTimeOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} sees a lesson list which lesson time matches ${option}`,
            async function () {
                await assertDateAndTimeOptionInLessonList({
                    cms,
                    scenarioContext,
                    option,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} chip filter in filter popup',
    async function (role: AccountRoles, option: FilteredFieldTitle) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees a lesson list which lesson time matches ${option}`,
            async function () {
                await assertFilterOptionChipOnFilterPopup(cms, option);
            }
        );
    }
);
