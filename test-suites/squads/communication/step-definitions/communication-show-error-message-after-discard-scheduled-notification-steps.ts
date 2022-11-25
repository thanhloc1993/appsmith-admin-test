import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';

import { aliasCreatedScheduleNotificationID } from './alias-keys/communication';
import {
    clickSaveScheduleNotificationButtonWithoutWaitForGPRC,
    NotificationActionButton,
} from './communication-common-definitions';
import { editScheduleNotificationFields } from './communication-edit-scheduled-notification.definitions';
import { clickActionButtonByNameWithoutAlias } from './communication-show-error-message-after-discard-scheduled-notification-definitions';

Given(`school admin has edited scheduled notification`, async function () {
    const cms = this.cms;
    const context = this.scenario;

    await cms.instruction(
        `Edit scheduled notification with Title & Content field(s)`,
        async function () {
            await editScheduleNotificationFields('Title', cms, context);
            await editScheduleNotificationFields('Content', cms, context);
        }
    );
});

When(`scheduled notification has been discard`, async function () {
    const cms = this.cms;
    const token = await cms.getToken();
    const context = this.scenario;

    const notificationId: string = context.get(aliasCreatedScheduleNotificationID);

    await cms.attach(`Discard schedule notification with notificationId ${notificationId}`);

    await notificationMgmtNotificationService.discardNotification(token, notificationId);
});

// TODO: @communication remove function after refactor replace BDD pass role
When(
    `school admin clicks {string} in notification dialog`,
    async function (buttonAction: NotificationActionButton) {
        const cms = this.cms;

        await cms.instruction(`Clicks button ${buttonAction}`, async () => {
            await clickActionButtonByNameWithoutAlias(buttonAction, cms).then((resp) => {
                weExpect(resp?.headers()['grpc-status']).toEqual('3'); // having error
            });
        });
    }
);

When(
    `{string} clicks {string} in notification dialog`,
    async function (role: AccountRoles, buttonAction: NotificationActionButton) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`Clicks button ${buttonAction}`, async () => {
            await clickActionButtonByNameWithoutAlias(buttonAction, cms);
        });
    }
);

// TODO: @communication create list button without wait for gRPC
Then(`{string} clicks Save Schedule in notification dialog`, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`Clicks button Save Schedule`, async () => {
        await clickSaveScheduleNotificationButtonWithoutWaitForGPRC(cms);
    });
});
