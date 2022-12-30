import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { schoolAdminOpenFilterAdvanced } from './cms-common-definitions';
import { resetFilterAdvancedButton } from './cms-selectors/cms-keys';
import { getRandomItemsFromExampleString } from './lesson-management-utils';
import { aliasLessonFilterCriteria } from 'step-definitions/alias-keys/lesson';
import {
    FilteredFieldTitle,
    selectOptionInLessonFilterAdvanced,
    selectApplyButton,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

export async function selectOptionsArrayInFilterPopup(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    optionsArray: FilteredFieldTitle[]
) {
    for (const option of optionsArray) {
        await selectOptionInLessonFilterAdvanced(cms, scenarioContext, option);
    }
}

export async function filterWithOptionsInFilterPopup(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    option1List: string,
    option2List: string
) {
    const option1Array = getRandomItemsFromExampleString(option1List) as FilteredFieldTitle[];
    const option2Array = getRandomItemsFromExampleString(option2List) as FilteredFieldTitle[];
    const filterCriteria = [...option1Array, ...option2Array];

    await schoolAdminOpenFilterAdvanced(cms);
    await cms.instruction(`user selects: ${filterCriteria.join(',')}`, async function () {
        await selectOptionsArrayInFilterPopup(cms, scenarioContext, filterCriteria);
        scenarioContext.set(aliasLessonFilterCriteria, filterCriteria);
    });

    await selectApplyButton(cms);
    await cms.page!.keyboard.press('Escape');
}

export async function clickResetButtonInFilterPopup(cms: CMSInterface) {
    const page = cms.page!;
    await schoolAdminOpenFilterAdvanced(cms);
    await page.waitForSelector(resetFilterAdvancedButton);
    await page.click(resetFilterAdvancedButton);
    await page.keyboard.press('Escape');
}
