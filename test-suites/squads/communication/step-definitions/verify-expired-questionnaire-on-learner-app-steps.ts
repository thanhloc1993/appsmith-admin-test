import {
    delay,
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
} from '@legacy-step-definitions/utils';

import { DataTable, Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasWaitTimeForQuestionnaire } from './alias-keys/communication';
import {
    createNotificationWithQuestionnaireData,
    QuestionnaireDataTableRow,
} from './communication-notification-questionnaire-definitions';
import { learnerSeesNotificationDisplayWithExpiredQuestionnaire } from './verify-expired-questionnaire-on-learner-app-definitions';

Given(
    '{string} has created the questionnaire notification which expire in a minute',
    async function (this: IMasterWorld, role: AccountRoles, questionnaireDataTable: DataTable) {
        const questionnaireData: QuestionnaireDataTableRow[] = questionnaireDataTable.hashes();
        const context = this.scenario;
        const expireIn = 60;
        const waitTime = expireIn * 1000;
        context.set(aliasWaitTimeForQuestionnaire, waitTime);
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `Create a questionnaire notification which expire in a minute`,
            async function () {
                const currentDate = new Date();
                const expirationDate = new Date(
                    new Date(currentDate).setSeconds(currentDate.getSeconds() + expireIn)
                );
                await createNotificationWithQuestionnaireData(
                    context,
                    questionnaireData,
                    true,
                    expirationDate
                );
            }
        );
    }
);

When(
    '{string} waits for questionnaire to be expired',
    { timeout: 1200000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const context = this.scenario;
        await learner.instruction(`${role} waits for questionnaire to be expired`, async () => {
            const waitTime = context.get<number>(aliasWaitTimeForQuestionnaire);
            await delay(waitTime);
        });
    }
);

Then(
    '{string} sees notification display with expired questionnaire',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees notification display with expired questionnaire`,
            async () => {
                await learnerSeesNotificationDisplayWithExpiredQuestionnaire(learner);
            }
        );
    }
);
