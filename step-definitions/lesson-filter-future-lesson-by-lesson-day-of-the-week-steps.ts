import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertChipFilterLesson,
    assertDayOfTheWeekOnList,
    filterLessonDayOfWeek,
} from './lesson-filter-future-lesson-by-lesson-day-of-the-week-definitions';
import { DayOfWeekType } from './lesson-management-utils';
import { getCMSInterfaceByRole } from './utils';
import { FilteredFieldTitle } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

When(
    '{string} filters lesson day of the week with {string}',
    async function (this: IMasterWorld, role: AccountRoles, dayOfWeek: DayOfWeekType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} filters lesson day of the week with ${dayOfWeek}`,
            async function () {
                await filterLessonDayOfWeek(cms, scenarioContext, dayOfWeek);
            }
        );
    }
);

Then(
    '{string} sees a lesson list which has day of the week matches {string}',
    async function (role: AccountRoles, dayOfWeek: DayOfWeekType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees a lesson list which has day of the week matches ${dayOfWeek}`,
            async function () {
                await assertDayOfTheWeekOnList(cms, dayOfWeek);
            }
        );
    }
);

Then(
    '{string} sees {string} chip filter in result page',
    async function (role: AccountRoles, remainedOption: FilteredFieldTitle) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees ${remainedOption} chip filter in result page`,
            async function () {
                await assertChipFilterLesson(cms, remainedOption);
            }
        );
    }
);
