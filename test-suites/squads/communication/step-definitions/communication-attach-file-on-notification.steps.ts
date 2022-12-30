import {
    aliasAttachmentDownloadUrl,
    aliasAttachmentFileNames,
} from '@legacy-step-definitions/alias-keys/file';
import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles, CMSInterface, IMasterWorld, LearnerInterface } from '@supports/app-types';

import {
    assertNotificationAttachment,
    assertNotificationSentDetail,
    clickSaveDraftNotification,
    firstIndex,
    learnerAssertAttachment,
    learnerClickOnNotificationItem,
    learnerSeesNotificationDetail,
    learnerSeesPDFAttachmentDetail,
    openAndInputNotificationDataToComposeForm,
    clickCreatedNotificationByIdOnTable,
    uploadNotificationAttachmentOnDialog,
} from './communication-common-definitions';

Given(
    'school admin has saved a draft notification with a PDF file size smaller than 50 MB',
    async function () {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction('Open compose dialog and input required fields', async function () {
            await openAndInputNotificationDataToComposeForm(cms, scenario);
        });

        await cms.instruction('Upload pdf attachment', async function () {
            await uploadNotificationAttachmentOnDialog(cms, scenario);
        });

        await cms.instruction(
            'Assert the attachment is on the draft notification',
            async function () {
                await assertNotificationAttachment(cms, scenario, {
                    shouldAttachmentALink: true,
                });
            }
        );

        await cms.instruction('Click save draft button on the compose dialog', async function () {
            await clickSaveDraftNotification(cms, scenario);
        });
    }
);

Then('school admin sends notification successfully with PDF file', async function () {
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

    await this.cms.instruction(
        'Assert attachment file of the sent notification',
        async function (this: CMSInterface) {
            await assertNotificationAttachment(this, scenario, { shouldAttachmentALink: true });
        }
    );

    await this.cms.instruction(
        'Assert created notification detail',
        async function (this: CMSInterface) {
            await assertNotificationSentDetail(this, scenario);
        }
    );
});

Then(
    '{string} views PDF detail successfully',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const attachmentFileName = this.scenario.get<string>(aliasAttachmentFileNames);
        const attachmentFileUrl = this.scenario.get<string>(aliasAttachmentDownloadUrl);

        await learner.instruction(
            'Select PDF notification',
            async function (this: LearnerInterface) {
                await learnerClickOnNotificationItem(this, true);
            }
        );

        await learner.instruction(
            'See notification detail',
            async function (this: LearnerInterface) {
                await learnerSeesNotificationDetail(this);
            }
        );

        // TODO(@communication): Need to detect when driver open a new tab on browser
        if (learner.flutterDriver?.isApp() ?? false) {
            await learner.instruction(
                `Assert the attachment ${attachmentFileName}`,
                async function (this: LearnerInterface) {
                    await learnerAssertAttachment(this, attachmentFileName, firstIndex);
                }
            );

            await learner.instruction(
                'See PDF attachment detail',
                async function (this: LearnerInterface) {
                    await learnerSeesPDFAttachmentDetail(this, attachmentFileUrl);
                }
            );
        }
    }
);
