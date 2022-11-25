import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { When, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { saveDraftNotificationButton } from './cms-selectors/communication';
import {
    clickCloseDialog,
    clickDisposeConfirmNotificationButton,
    NotificationFields,
    schoolAdminSeesErrorMessage,
} from './communication-common-definitions';
import {
    editNotificationFieldsWithEmpty,
    assertDraftNotificationNotSaved,
} from './communication-fail-to-save-draft-notification-definition';

When(
    `school admin sets {string} of draft notification blank`,
    async function (fieldKey: NotificationFields) {
        const cms = this.cms;

        await cms.instruction(
            `Edit draft notification with ${fieldKey} field(s) is empty`,
            async function () {
                await editNotificationFieldsWithEmpty(fieldKey, cms);
            }
        );
    }
);

When(`school admin clicks Close button`, async function () {
    await this.cms.instruction(`Clicks Close button`, async () => {
        await clickCloseDialog(this.cms);
    });
});

When(`{string} clicks Save draft button`, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`Clicks Save draft button`, async () => {
        await cms.selectElementByDataTestId(saveDraftNotificationButton);
    });
});

When(`school admin sees error message for {string}`, async function (fieldKey: NotificationFields) {
    await this.cms.instruction(
        `School admin sees error message of field(s) ${fieldKey} on CMS`,
        async () => {
            await schoolAdminSeesErrorMessage(this.cms, fieldKey);
        }
    );
});

When(`school admin closes compose notification full-screen dialog`, async function () {
    await this.cms.instruction(`Closes compose Notification dialog`, async () => {
        await clickCloseDialog(this.cms);
    });

    await this.cms.instruction(`Dispose Notification dialog`, async () => {
        await clickDisposeConfirmNotificationButton(this.cms);
    });
});

Then(`school admin sees draft notification with new data is not saved`, async function () {
    const cms = this.cms;
    const content = this.scenario;

    await cms.instruction(`Assert notification not saved`, async function () {
        await assertDraftNotificationNotSaved(cms, content);
    });
});
