import { CMSInterface } from '@supports/app-types';

import {
    confirmSubmitIndReportButton,
    locationsAutocompleteClearButton,
    locationsLowestLevelAutocompleteInputV3,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonUpsertFields } from 'test-suites/squads/lesson/types/lesson-management';

export async function clearLessonFieldOfGroupLesson(
    cms: CMSInterface,
    lessonField: LessonUpsertFields
) {
    const page = cms.page!;

    switch (lessonField) {
        case 'center': {
            const [centerAutocompleteInput, centerAutocompleteClearButton] = [
                locationsLowestLevelAutocompleteInputV3,
                locationsAutocompleteClearButton,
            ];

            await page.hover(centerAutocompleteInput);
            await page.click(centerAutocompleteClearButton);
            await page.click(confirmSubmitIndReportButton);

            const centerValue = await page.inputValue(centerAutocompleteInput);
            weExpect(centerValue).toEqual('');
            return;
        }

        default:
            // Currently only clear center
            return;
    }
}
