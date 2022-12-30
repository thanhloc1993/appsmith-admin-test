import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasNotificationScheduleAt,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    fillTitleAndContentOnDialog,
    getNotificationScheduleAtAndWaitTime,
    openComposeMessageDialog,
    selectNotificationTypesRadioOnDialog,
    selectRecipientsOnDialog,
    selectUserTypesRadioOnDialog,
    uploadNotificationAttachmentOnDialog,
    UserGroupType,
} from './communication-common-definitions';
import { selectNotificationTimePicker } from './communication-create-scheduled-notification.definitions';
import { getRandomNumber } from 'step-definitions/utils';

export async function openAndInputScheduledNotificationDataToComposeFormWithAudience(
    cms: CMSInterface,
    audienceType: UserGroupType,
    context: ScenarioContext
) {
    const scheduledAt = await getNotificationScheduleAtAndWaitTime(cms, context);
    context.context.set(aliasNotificationScheduleAt, scheduledAt);
    const selectedTime = formatDate(scheduledAt, 'HH:mm');

    await cms.instruction('Opens compose dialog', async function (this: CMSInterface) {
        await openComposeMessageDialog(this);
    });

    await cms.instruction(
        'Selects courses, grades and individual recipients on the compose dialog',
        async function (this: CMSInterface) {
            await selectRecipientsOnDialog(this, context, {
                course: 'Specific',
                grade: 'Specific',
                individual: 'Specific',
            });
        }
    );

    await cms.instruction(
        'Selects the user type on the compose dialog',
        async function (this: CMSInterface) {
            await selectUserTypesRadioOnDialog(this, audienceType);
        }
    );

    await cms.instruction(
        'Selects Schedule notification type on the full-screen dialog',
        async function () {
            await selectNotificationTypesRadioOnDialog(cms, 'Schedule');
        }
    );

    await cms.instruction(`Select ${selectedTime} on the time picker dropdown`, async function () {
        await selectNotificationTimePicker(cms, selectedTime);
    });

    await cms.instruction(
        'Fills the title and content of the compose dialog',
        async function (this: CMSInterface) {
            const titleSchedule = `Title E2E ${getRandomNumber()}`;
            const contentSchedule = `Content ${getRandomNumber()}`;

            await fillTitleAndContentOnDialog(this, context, {
                title: titleSchedule,
                content: contentSchedule,
            });

            context.set(aliasCreatedNotificationName, titleSchedule);
        }
    );

    await cms.instruction(
        'Upload PDF attachment notification',
        async function (this: CMSInterface) {
            await uploadNotificationAttachmentOnDialog(this, context);
        }
    );
}
