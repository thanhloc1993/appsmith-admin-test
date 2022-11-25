import { CMSInterface } from '@supports/app-types';

import {
    saveDraftNotificationButton,
    saveScheduleNotificationButton,
    sendNotificationButton,
} from './cms-selectors/communication';
import {
    NotificationActionButton,
    clickDiscardNotificationButton,
    clickDiscardConfirmNotificationButton,
} from './communication-common-definitions';
import {
    UPSERT_NOTIFICATION_ENDPOINT,
    SEND_NOTIFICATION_ENDPOINT,
    DISCARD_NOTIFICATION_ENDPOINT,
} from './endpoints/notificationmgmt-notification';

export async function clickActionButtonByNameWithoutAlias(
    buttonName: NotificationActionButton,
    cms: CMSInterface
) {
    switch (buttonName) {
        case 'Save draft': {
            const [, response] = await Promise.all([
                cms.selectElementByDataTestId(saveDraftNotificationButton),
                cms.waitForGRPCResponse(UPSERT_NOTIFICATION_ENDPOINT),
            ]);

            return response;
        }
        case 'Send': {
            const [, response] = await Promise.all([
                cms.selectElementByDataTestId(sendNotificationButton),
                cms.waitForGRPCResponse(SEND_NOTIFICATION_ENDPOINT),
            ]);
            return response;
        }
        case 'Discard and confirm': {
            const [, , response] = await Promise.all([
                clickDiscardNotificationButton(cms),
                clickDiscardConfirmNotificationButton(cms),
                cms.waitForGRPCResponse(DISCARD_NOTIFICATION_ENDPOINT),
            ]);

            return response;
        }

        case 'Save schedule': {
            const [, response] = await Promise.all([
                cms.selectElementByDataTestId(saveScheduleNotificationButton),
                cms.waitForGRPCResponse(UPSERT_NOTIFICATION_ENDPOINT),
            ]);
            return response;
        }
        default:
            break;
    }
}
