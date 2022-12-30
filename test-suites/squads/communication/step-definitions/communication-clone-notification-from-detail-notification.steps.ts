import { arrayHasItem, getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { DataTable, Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
    aliasQuestionnaireTable,
} from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    assertNotificationDetailQuestionnaire,
    assertNotificationFormDataWithoutQuestionnaire,
    createQuestionnaireWithDataTable,
} from './communication-clone-notification-from-detail-notification.definition';
import {
    clickActionButtonByName,
    searchNotificationTitleOnCMS,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import {
    assertNotificationQuestionAndAnswerWithQuestionnaire,
    assertNotificationWithoutQuestionnaire,
    MappedQuestionnaireTable,
} from './communication-common-questionnaire-definitions';
import { getNotificationIdByTitleWithHasura } from './communication-notification-hasura';
import { clickToggleViewButtonInQuestionSectionDetail } from './communication-view-more-and-view-less-questionnaire-detail-definitions';

export type NotificationQuestionnaireType = 'without questionnaire' | 'with questionnaire';

Given(
    '{string} has sent the notification {string}',
    async function (
        role: AccountRoles,
        notificationQuestionnaireType: NotificationQuestionnaireType,
        questionnaireTable: DataTable
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        if (notificationQuestionnaireType === 'with questionnaire') {
            await createQuestionnaireWithDataTable(cms, this.scenario, questionnaireTable);
        }

        await this.cms.instruction(
            `Clicks button Sent ${notificationQuestionnaireType}`,
            async () => {
                await clickActionButtonByName('Send', cms, this.scenario);
            }
        );
    }
);

When(`{string} goes to detail page of this notification`, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    const title = scenario.get(aliasCreatedNotificationName);
    const notificationId = await getNotificationIdByTitleWithHasura(cms, title);

    scenario.set(aliasCreatedNotificationID, notificationId);

    if (!notificationId) throw Error('Cannot find notification id');

    await searchNotificationTitleOnCMS(cms, title, notificationId);

    await cms.attach(`Call Hasura to get NotificationId by title ${title}`);

    await cms.instruction('Select sent notification on table by', async () => {
        await clickCreatedNotificationByIdOnTable(cms, scenario);
        await cms.waitingForLoadingIcon();
        await cms.page?.waitForSelector(CommunicationSelectors.notificationDetailContainer);
    });

    const questionnaireTable: MappedQuestionnaireTable[] = scenario.get(aliasQuestionnaireTable);

    const questionSections = arrayHasItem(questionnaireTable)
        ? questionnaireTable
              .filter((question) => Boolean(question.questionSection))
              .map((question) => question.questionSection)
        : undefined;

    if (arrayHasItem(questionnaireTable) && questionSections) {
        await cms.instruction(`Check questionnaire exist and show correct value`, async () => {
            await clickToggleViewButtonInQuestionSectionDetail(cms, 'View More');

            await assertNotificationDetailQuestionnaire(
                cms,
                scenario,
                questionnaireTable,
                questionSections
            );
        });
    }
});

Then(
    `{string} sees compose notification screen with all data correctly`,
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await assertNotificationFormDataWithoutQuestionnaire(cms, scenario);

        const questionnaireTable: MappedQuestionnaireTable[] =
            scenario.get(aliasQuestionnaireTable);

        const questionSections = arrayHasItem(questionnaireTable)
            ? questionnaireTable
                  .filter((question) => Boolean(question.questionSection))
                  .map((question) => question.questionSection)
            : undefined;

        if (!arrayHasItem(questionnaireTable) || !questionSections) {
            await assertNotificationWithoutQuestionnaire(cms);
        } else {
            await cms.instruction(`Assert Notification With Questionnaire`, async () => {
                await assertNotificationQuestionAndAnswerWithQuestionnaire(cms, scenario);
            });
        }
    }
);
