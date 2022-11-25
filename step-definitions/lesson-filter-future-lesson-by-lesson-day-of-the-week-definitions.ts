import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { schoolAdminOpenFilterAdvanced } from './cms-common-definitions';
import { chipAutocompleteText } from './cms-selectors/lesson';
import { DayOfWeekType } from './lesson-management-utils';
import moment from 'moment';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import {
    selectApplyButton,
    selectDayOfTheWeek,
    assertDayOfTheWeek,
    FilteredFieldTitle,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

export async function filterLessonDayOfWeek(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    dayOfWeek: DayOfWeekType
) {
    const numberDayOfWeek = Object.values(DayOfWeekType).indexOf(dayOfWeek) + 1;

    await cms.instruction('Open filter advanced', async function () {
        await schoolAdminOpenFilterAdvanced(cms);
    });

    await cms.instruction(`Selects ${dayOfWeek} in DayOfWeek AutoComplete`, async function () {
        await selectDayOfTheWeek(cms, scenarioContext, numberDayOfWeek);
    });

    await selectApplyButton(cms);
}
export async function getFirstLessonDate(cms: CMSInterface) {
    try {
        return await cms.page!.textContent(LessonManagementKeys.lessonLinkAtFirstRowInList, {
            timeout: 3000,
        });
    } catch (error: unknown) {
        if ((error as Error).name === 'TimeoutError') {
            return ''; // case dont have any lesson in lesson list
        }
        throw error;
    }
}

export async function assertDayOfTheWeekOnList(cms: CMSInterface, dayOfWeek: DayOfWeekType) {
    const lessonDateAtFirstRow = await getFirstLessonDate(cms);
    if (!lessonDateAtFirstRow) return; // pass with empty lesson list

    const formatLessonDateAtFirstRow = lessonDateAtFirstRow.split('/').join('-');
    const lessonDayOfTheWeek = moment(formatLessonDateAtFirstRow).locale('en').format('dddd');
    await assertDayOfTheWeek(cms, lessonDayOfTheWeek, dayOfWeek);
}

export async function assertChipFilterLesson(cms: CMSInterface, option: FilteredFieldTitle) {
    await cms.page!.waitForSelector(`${chipAutocompleteText}:has-text("${option}")`);
}
