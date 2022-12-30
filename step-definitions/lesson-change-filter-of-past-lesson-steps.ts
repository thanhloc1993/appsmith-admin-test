import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { updateAndApplyDateTimeFieldsOfLesson } from './lesson-edit-lesson-by-updating-and-adding-definitions';
import {
    assertDateAndTimeOptionInLessonList,
    FilteredDateAndTimeOptions,
} from './lesson-filter-future-lesson-by-date-and-time-definitions';
import { chooseLessonTabOnLessonList } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    '{string} has gone to {string} list page',
    async function (this: IMasterWorld, role: AccountRoles, tabType: 'future' | 'past') {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} has gone to ${tabType} list page`, async function () {
            await cms.schoolAdminIsOnThePage(Menu.LESSON_MANAGEMENT, 'Lesson Management');

            await chooseLessonTabOnLessonList(cms, tabType);
        });
    }
);

When(
    '{string} changes {string} in filter popup',
    async function (this: IMasterWorld, role: AccountRoles, option: FilteredDateAndTimeOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} changes ${option}  in filter popup`, async function () {
            await updateAndApplyDateTimeFieldsOfLesson(cms, option, scenarioContext);
        });
    }
);

Then(
    '{string} sees updated lesson list which matches {string}',
    async function (role: AccountRoles, option: FilteredDateAndTimeOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} sees updated lesson list which matches ${option}`,
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
