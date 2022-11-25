import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    coursesAutocompleteHF,
    gradesMasterAutocompleteHF,
    studentsAutocompleteHF,
} from './cms-selectors/communication';
import {
    fillEmptyTitleAndContentOnDialog,
    fillTitleAndContentOnDialog,
    selectRecipientsOnDialog,
} from './communication-common-definitions';

export async function inputNotificationRequiredFieldsWithEmpty(
    notificationRequiredFieldArray: string[],
    cms: CMSInterface
) {
    for (const field of notificationRequiredFieldArray) {
        if (['Title', 'Content'].includes(field)) {
            await fillEmptyTitleAndContentOnDialog(cms, { [field.toLowerCase()]: '' });
        }

        if (field === 'Recipient Group') {
            await cms.clearListAutoCompleteInput([
                coursesAutocompleteHF,
                gradesMasterAutocompleteHF,
                studentsAutocompleteHF,
            ]);
        }
    }
}

export async function inputNotificationAllRequiredFieldsWithValue(
    cms: CMSInterface,
    context: ScenarioContext
) {
    await cms.instruction('Fills the title and content of the compose dialog', async function () {
        await fillTitleAndContentOnDialog(cms, context, {
            title: 'Title E2E Notification',
            content: 'Content E2E Notification',
        });
    });

    await cms.instruction('Selects Recipient group on the compose dialog', async function () {
        await selectRecipientsOnDialog(cms, context, {
            course: 'All',
            grade: 'All',
            individual: 'Specific',
        });
    });
}
