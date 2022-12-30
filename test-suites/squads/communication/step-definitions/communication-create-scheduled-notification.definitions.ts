import { CMSInterface } from '@supports/app-types';

import { timePickerInput } from './cms-selectors/communication';

export async function selectNotificationTimePicker(cms: CMSInterface, timeValue: string) {
    await cms.page!.fill(timePickerInput, timeValue);
    await cms.chooseOptionInAutoCompleteBoxByText(timeValue);
}
