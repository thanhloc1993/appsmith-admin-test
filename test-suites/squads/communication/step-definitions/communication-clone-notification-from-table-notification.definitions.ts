import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { cmsScheduleNotificationData } from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';

export const assertNotificationFormDataWithScheduleDate = async (
    cms: CMSInterface,
    scenario: ScenarioContext
) => {
    const scheduleDate = scenario.get(cmsScheduleNotificationData('Date'));
    const scheduleTime = scenario.get(cmsScheduleNotificationData('Time'));

    await cms.instruction(
        `Notification Form 
    Schedule Date: ${scheduleDate}
    Schedule Time: ${scheduleTime}`,
        async () => {
            const notificationDatePickerInputValue = await cms.page?.inputValue(
                CommunicationSelectors.notificationScheduleDatePicker
            );
            weExpect(notificationDatePickerInputValue).toEqual(scheduleDate);

            const notificationTimePickerInputValue = await cms.page?.inputValue(
                CommunicationSelectors.timePickerInput
            );

            weExpect(notificationTimePickerInputValue).toEqual(scheduleTime);
        }
    );
};
