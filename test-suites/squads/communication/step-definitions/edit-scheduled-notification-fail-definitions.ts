import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { studentsAutocompleteHF, timePickerHF } from './cms-selectors/communication';
import {
    fillTitleAndContentOnDialog,
    NotificationFields,
} from './communication-common-definitions';

export async function checkAndClearAutocompleteInput(
    cms: CMSInterface,
    autoCompleteSelectors: string[]
) {
    await cms.clearListAutoCompleteInput(autoCompleteSelectors);
}

export async function editNotificationFieldsBlank(
    cms: CMSInterface,
    scenario: ScenarioContext,
    fieldKey: NotificationFields
) {
    if (['Title', 'Content'].includes(fieldKey)) {
        await fillTitleAndContentOnDialog(cms, scenario, {
            [fieldKey.toLowerCase()]: '',
        });
    }

    if (fieldKey === 'Time') {
        await checkAndClearAutocompleteInput(cms, [timePickerHF]);
    }

    if (fieldKey === 'Recipient Group') {
        await checkAndClearAutocompleteInput(cms, [studentsAutocompleteHF]);
    }
}
