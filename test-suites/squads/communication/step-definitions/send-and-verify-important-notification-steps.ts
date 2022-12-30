import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { NotificationFilterEnum } from '@supports/enum';

import { learnerClickOnNotificationIcon } from './communication-common-definitions';
import {
    learnerClicksOnImportantTabBar,
    verifyNotificationItemInNotificationList,
} from './send-and-verify-important-notification-definitions';

Then(
    `{string} sees the {string} notification {string} display correctly in notification list`,
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        importantField: string,
        withQuestionnaire: string
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);

        const isImportant = importantField === 'important';
        const isQuestionnaire = withQuestionnaire === 'with questionnaire';

        await learner.instruction(`${role} click on notification icon`, async () => {
            await learnerClickOnNotificationIcon(learner);
        });

        await learner.instruction(
            `${role} verify ${importantField} notification item on ALL tab`,
            async () => {
                await verifyNotificationItemInNotificationList(
                    learner,
                    NotificationFilterEnum.all,
                    isImportant,
                    isQuestionnaire
                );
            }
        );

        await learner.instruction(`${role} clicks on Important tab bar`, async () => {
            await learnerClicksOnImportantTabBar(learner);
        });

        await learner.instruction(
            `${role} verify ${importantField} notification item on IMPORTANT tab`,
            async () => {
                await verifyNotificationItemInNotificationList(
                    learner,
                    NotificationFilterEnum.importantOnly,
                    isImportant,
                    isQuestionnaire
                );
            }
        );
    }
);
