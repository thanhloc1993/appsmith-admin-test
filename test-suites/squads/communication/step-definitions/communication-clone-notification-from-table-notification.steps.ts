import { arrayHasItem, getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, DataTable, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasQuestionnaireTable } from './alias-keys/communication';
import {
    assertNotificationFormDataWithoutQuestionnaire,
    createQuestionnaireWithDataTable,
} from './communication-clone-notification-from-detail-notification.definition';
import { NotificationQuestionnaireType } from './communication-clone-notification-from-detail-notification.steps';
import { assertNotificationFormDataWithScheduleDate } from './communication-clone-notification-from-table-notification.definitions';
import { clickActionButtonByName } from './communication-common-definitions';
import {
    MappedQuestionnaireTable,
    assertNotificationWithoutQuestionnaire,
    assertScheduleDateAndQuestionnaireDate,
    assertNotificationQuestionAndAnswerWithQuestionnaire,
} from './communication-common-questionnaire-definitions';

Given(
    '{string} has created a draft notification {string}',
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
            `Clicks button Save draft ${notificationQuestionnaireType}`,
            async () => {
                await clickActionButtonByName('Save draft', cms, this.scenario);
            }
        );
    }
);

Given(
    '{string} has created a schedule notification {string}',
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
            `Clicks button Save schedule ${notificationQuestionnaireType}`,
            async () => {
                await clickActionButtonByName('Save schedule', cms, this.scenario);
            }
        );
    }
);

Then(
    `{string} sees compose schedule notification screen with all data correctly`,
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await assertNotificationFormDataWithoutQuestionnaire(cms, scenario);
        await assertNotificationFormDataWithScheduleDate(cms, scenario);

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
                await assertScheduleDateAndQuestionnaireDate(cms);

                await assertNotificationQuestionAndAnswerWithQuestionnaire(cms, scenario);
            });
        }
    }
);
