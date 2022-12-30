import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    fillTitleAndContentOnDialog,
    openComposeMessageDialog,
    selectRecipientsOnDialog,
    selectUserTypesRadioOnDialog,
    uploadNotificationAttachmentOnDialog,
    UserGroupType,
} from './communication-common-definitions';
import { getRandomNumber } from 'step-definitions/utils';

export async function openAndInputNotificationDataToComposeFormWithAudience(
    cms: CMSInterface,
    audienceType: UserGroupType,
    context: ScenarioContext
) {
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
        'Fills the title and content of the compose dialog',
        async function (this: CMSInterface) {
            await fillTitleAndContentOnDialog(this, context, {
                title: `Title E2E ${getRandomNumber()}`,
                content: `Content ${getRandomNumber()}`,
            });
        }
    );

    await cms.instruction(
        'Upload PDF attachment notification',
        async function (this: CMSInterface) {
            await uploadNotificationAttachmentOnDialog(this, context);
        }
    );
}
