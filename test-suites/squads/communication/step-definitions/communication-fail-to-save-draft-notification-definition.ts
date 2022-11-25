import { isCombinationWithAnd } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import { notificationTitleInput, notificationDetailContent } from './cms-selectors/communication';
import {
    fillEmptyTitleAndContentOnDialog,
    NotificationFields,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';

export async function editNotificationFieldsWithEmpty(
    fieldKey: NotificationFields,
    cms: CMSInterface
): Promise<void> {
    if (isCombinationWithAnd(fieldKey)) {
        await fillEmptyTitleAndContentOnDialog(cms, {
            title: '',
            content: '',
        });
    } else {
        await fillEmptyTitleAndContentOnDialog(cms, {
            [fieldKey.toLowerCase()]: '',
        });
    }
}

export async function assertDraftNotificationNotSaved(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    const notificationId: string = context.get<string>(aliasCreatedNotificationID);
    const notificationName: string = context.get<string>(aliasCreatedNotificationName);
    const notificationContent: string = context.get<string>(aliasCreatedNotificationContent);

    await cms.instruction(
        `Select edited draft notification:
        - Id: "${notificationId}"`,

        async () => {
            await clickCreatedNotificationByIdOnTable(cms, context);
        }
    );

    const notificationTitleInputValue = await cms.page?.inputValue(notificationTitleInput);
    weExpect(notificationTitleInputValue).toEqual(notificationName);

    await cms.waitForSelectorWithText(
        `${notificationDetailContent} span[data-text="true"]`,
        notificationContent
    );
}
