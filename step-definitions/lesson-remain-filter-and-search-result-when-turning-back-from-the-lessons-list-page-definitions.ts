import { CMSInterface } from '@supports/app-types';

import { schoolAdminOpenFilterAdvanced } from './cms-common-definitions';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { FilteredFieldTitle } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

export async function assertFilterOptionChipOnFilterPopup(
    cms: CMSInterface,
    option: FilteredFieldTitle
) {
    const page = cms.page!;

    await cms.instruction('Open lesson filter advanced', async function () {
        await schoolAdminOpenFilterAdvanced(cms);
    });

    const {
        filterAdvancedLessonDayOfTheWeek,
        coursesAutocompleteHF,
        gradesAutocompleteHF,
        teacherAutocomplete,
        locationsLowestLevelAutocomplete,
        studentsAutocompleteHF,
        chipAutocompleteWithWrapper,
    } = LessonManagementKeys;

    await cms.instruction(`Assert user sees ${option} filter chip`, async function () {
        type FilterConditionWithChip = Exclude<
            FilteredFieldTitle,
            'Lesson Start Date' | 'Lesson End Date' | 'Start Time' | 'End Time'
        >;

        const mapAutocompleteChipSelectors: Record<FilterConditionWithChip, string> = {
            'Lesson day of the week': chipAutocompleteWithWrapper(filterAdvancedLessonDayOfTheWeek),
            'Teacher Name': chipAutocompleteWithWrapper(teacherAutocomplete),
            'Student Name': chipAutocompleteWithWrapper(studentsAutocompleteHF),
            Center: chipAutocompleteWithWrapper(locationsLowestLevelAutocomplete),
            Course: chipAutocompleteWithWrapper(coursesAutocompleteHF),
            Grade: chipAutocompleteWithWrapper(gradesAutocompleteHF),
        };

        switch (option) {
            case 'Lesson day of the week':
            case 'Center':
            case 'Teacher Name':
            case 'Course':
            case 'Grade':
            case 'Student Name':
                await page.waitForSelector(mapAutocompleteChipSelectors[option]);
                break;

            case 'Lesson Start Date':
            case 'Lesson End Date':
            case 'Start Time':
            case 'End Time':
                await cms.log(`${option} has no filter chip`);
                break;
        }
    });

    await cms.instruction('Close lesson filter advanced', async function () {
        await page.keyboard.press('Escape');
    });
}
