import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, CMSInterface, IMasterWorld, LearnerInterface } from '@supports/app-types';

import {
    assertNotificationSentDetail,
    clickSaveDraftNotification,
    clickSendNotification,
    clickUpsertAndSendNotification,
    learnerClickOnNotificationIcon,
    openAndInputNotificationDataToComposeForm,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import { learnerSeesNotificationReadStatus } from './communication-resend-notification-definitions';

When(
    'school admin sends notification with required fields to student and parent',
    async function () {
        const scenario = this.scenario;

        await this.cms.instruction(
            'Open compose dialog and input required fields',
            async function (this: CMSInterface) {
                await openAndInputNotificationDataToComposeForm(this, scenario);
            }
        );

        await this.cms.instruction(
            'Click send button on the compose dialog',
            async function (this: CMSInterface) {
                await clickUpsertAndSendNotification(this, scenario);
            }
        );
    }
);

Then('school admin sends notification successfully', async function () {
    const scenario = this.scenario;

    await this.cms.instruction(
        'Assert created successfully message',
        async function (this: CMSInterface) {
            await this.assertNotification('You have sent the notification successfully!');
        }
    );

    await this.cms.instruction(
        'Select created notification on table',
        async function (this: CMSInterface) {
            await clickCreatedNotificationByIdOnTable(this, scenario);
        }
    );

    await this.cms.instruction('Assert created notification', async function (this: CMSInterface) {
        await assertNotificationSentDetail(this, scenario);
    });
});

Then(
    '{string} receives the notification in their device',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            'Learner click on notification button',
            async function (this: LearnerInterface) {
                await learnerClickOnNotificationIcon(this);
            }
        );

        await learner.instruction(
            'Learner receive a new notification',
            async function (this: LearnerInterface) {
                await learnerSeesNotificationReadStatus(this, true);
            }
        );
    }
);

Given('school admin has saved a draft notification with required fields', async function () {
    const scenario = this.scenario;

    await this.cms.instruction(
        'Open compose dialog and input required fields',
        async function (this: CMSInterface) {
            await openAndInputNotificationDataToComposeForm(this, scenario);
        }
    );

    await this.cms.instruction(
        'Click save draft button on the compose dialog',
        async function (this: CMSInterface) {
            await clickSaveDraftNotification(this, scenario);
        }
    );
});

When(
    'school admin sends that draft notification for student and parent',
    { timeout: 90000 },
    async function () {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction('Select created draft notification on table', async function () {
            await clickCreatedNotificationByIdOnTable(cms, scenario);
        });

        await cms.instruction('Click send button on the compose dialog', async function () {
            await clickSendNotification(cms);
        });
    }
);
