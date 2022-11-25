import { Then, When } from '@cucumber/cucumber';

import { aliasNotificationRequiredFieldArray } from './alias-keys/communication';
import { sendNotificationButton } from './cms-selectors/communication';
import {
    NotificationFields,
    schoolAdminSeesErrorMessage,
} from './communication-common-definitions';
import {
    inputNotificationAllRequiredFieldsWithValue,
    inputNotificationRequiredFieldsWithEmpty,
} from './communication-fail-to-send-notification-definitions';

When(
    'school admin leaves {string} of notification blank',
    async function (requiredFieldKey: string) {
        const cms = this.cms;
        const scenario = this.scenario;

        const notificationRequiredFieldArray: string[] = requiredFieldKey.split(', ');

        scenario.set(aliasNotificationRequiredFieldArray, notificationRequiredFieldArray);

        await cms.instruction(
            `School admin input values for all required fields`,
            async function () {
                await inputNotificationAllRequiredFieldsWithValue(cms, scenario);
            }
        );

        await cms.instruction(
            `School admin input blank ${notificationRequiredFieldArray} for required field(s)`,
            async function () {
                await inputNotificationRequiredFieldsWithEmpty(notificationRequiredFieldArray, cms);
            }
        );
    }
);

When('school admin sends notification', async function () {
    const cms = this.cms;

    await cms.instruction('School admin click Send button', async function () {
        await cms.selectElementByDataTestId(sendNotificationButton);
    });
});

Then('school admin sees error message display on CMS', async function () {
    const cms = this.cms;

    const notificationRequiredFieldArray: NotificationFields[] = this.scenario.get(
        aliasNotificationRequiredFieldArray
    );

    await cms.instruction(
        'School admin sees error message of blank required field(s) display on CMS',
        async function () {
            for (const field of notificationRequiredFieldArray) {
                await schoolAdminSeesErrorMessage(cms, field);
            }
        }
    );
});
