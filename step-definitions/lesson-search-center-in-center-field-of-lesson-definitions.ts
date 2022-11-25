import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLocationName } from './alias-keys/lesson';
import * as LessonManagementKeys from './cms-selectors/lesson-management';
import { arrayHasItem, retrieveLowestLocations } from './utils';

export async function getCenterNameFromLocationsListAPI(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const locationsListFromAPI = await retrieveLowestLocations(cms);
    if (!arrayHasItem(locationsListFromAPI)) throw Error('There are no locations from API');

    const centerName = locationsListFromAPI[0].name;
    scenarioContext.set(aliasLocationName, centerName);

    return centerName;
}

export async function focusAnFillKeywordToInputFieldCenterLocations(
    cms: CMSInterface,
    centerName: string
) {
    await cms.page!.focus(LessonManagementKeys.locationsLowestLevelAutocompleteInput);
    await cms.page!.fill(LessonManagementKeys.locationsLowestLevelAutocompleteInput, centerName);
}

export async function selectCenterFromOptionInAutoCompleteBoxByPosition(
    cms: CMSInterface,
    position: number
) {
    await cms.page!.click(LessonManagementKeys.locationsLowestLevelAutocomplete);
    await cms.chooseOptionInAutoCompleteBoxByOrder(position);
}

export async function checkEqualCenterNameInAutoCompleteInput(
    cms: CMSInterface,
    centerName: string
) {
    const centerAutocompleteInputValue = await cms.page!.inputValue(
        LessonManagementKeys.locationsLowestLevelAutocompleteInput
    );
    weExpect(centerAutocompleteInputValue).toEqual(centerName);
}

export async function clearSearchedCenterInCenterField(cms: CMSInterface) {
    const page = cms.page!;
    const [centerAutocompleteInput, centerAutocompleteClearButton] = [
        LessonManagementKeys.locationsLowestLevelAutocompleteInput,
        LessonManagementKeys.locationsLowestLevelAutocompleteClearButton,
    ];

    await page.hover(centerAutocompleteInput);
    await page.click(centerAutocompleteClearButton);
}
