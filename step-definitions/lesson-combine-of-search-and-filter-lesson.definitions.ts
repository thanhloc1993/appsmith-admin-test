import { CMSInterface } from '@supports/app-types';

import { schoolAdminOpenFilterAdvanced } from 'step-definitions/cms-common-definitions';
import { filterAdvancedWrapper } from 'step-definitions/cms-selectors/cms-keys';
import { chipAutocomplete } from 'step-definitions/cms-selectors/lesson';
import { formFilterAdvancedLessonManagement } from 'step-definitions/cms-selectors/lesson-management';

export async function getLessonFilterChips(
    cms: CMSInterface,
    wrapper: 'result page' | 'filter popup'
) {
    const page = cms.page!;

    const queryWrapper =
        wrapper === 'filter popup' ? filterAdvancedWrapper : formFilterAdvancedLessonManagement;

    const wrapperElement = await page.waitForSelector(queryWrapper);
    return await wrapperElement.$$(chipAutocomplete);
}

export async function assertNoLessonFilterChips(
    cms: CMSInterface,
    wrapper: 'result page' | 'filter popup'
) {
    await schoolAdminOpenFilterAdvanced(cms);

    const chips = await getLessonFilterChips(cms, wrapper);
    weExpect(chips, 'Expect found no autocomplete chip').toHaveLength(0);

    await cms.page!.keyboard.press('Escape');
}
