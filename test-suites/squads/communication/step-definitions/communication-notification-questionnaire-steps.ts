import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { DataTable, Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    createNotificationWithQuestionnaireData,
    learnerAcceptQuestionnaireSubmission,
    learnerAcceptTheDiscardChanges,
    learnerChangeAnswerOfQuestions,
    learnerClicksOnBackButtonOfNotificationDetailScreen,
    learnerClicksOnResubmitQuestionnaireButton,
    learnerClicksOnSubmitQuestionnaireButton,
    learnerFillAllQuestionsWithValidData,
    learnerReturnToPreviousScreen,
    learnerRemoveAnswersOfQuestions,
    learnerSeesQuestionnaireViewModeDisplayCorrectData,
    learnerSeesQuestionnaireViewModeDisplayNewData,
    learnerSeesQuestionnaireViewModeDisplayOldData,
    learnerSeesValidationErrorsOfEachQuestion,
    learnerSeeViewModeAndResubmitButton,
    QuestionnaireDataTableRow,
    sendCreatedQuestionnaireNotificationByGrpc,
} from './communication-notification-questionnaire-definitions';

Given(
    '{string} has created questionnaire notification',
    async function (this: IMasterWorld, role: AccountRoles, questionnaireDataTable: DataTable) {
        const questionnaireData: QuestionnaireDataTableRow[] = questionnaireDataTable.hashes();
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(`Create a notification with questionnaire`, async function () {
            await createNotificationWithQuestionnaireData(context, questionnaireData, true);
        });
    }
);

Given(
    '{string} has created questionnaire notification with {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        resubmitStatus: string,
        questionnaireDataTable: DataTable
    ) {
        const questionnaireData: QuestionnaireDataTableRow[] = questionnaireDataTable.hashes();
        let resubmitAllowed = false;
        if (resubmitStatus == 'resubmit allowed') {
            resubmitAllowed = true;
        }
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(
            `Create a notification with questionnaire with ${resubmitStatus}`,
            async function () {
                await createNotificationWithQuestionnaireData(
                    context,
                    questionnaireData,
                    resubmitAllowed
                );
            }
        );
    }
);

When(
    '{string} fill all questionnaire questions with valid data',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} fill all questions with valid data`, async () => {
            await learnerFillAllQuestionsWithValidData(this.scenario, learner);
        });
    }
);

When('{string} submits the questionnaire', async function (this: IMasterWorld, role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} submits questionnaire`, async () => {
        await learnerClicksOnSubmitQuestionnaireButton(learner);
    });
});

When(
    '{string} accepts the questionnaire submission',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} accepts questionnaire submission`, async () => {
            await learnerAcceptQuestionnaireSubmission(learner);
        });
    }
);

Then(
    '{string} sees the questionnaire has submitted successfully',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} sees view mode and resubmit button`, async () => {
            await learnerSeeViewModeAndResubmitButton(learner);
        });
    }
);

Then(
    '{string} sees questionnaire view mode display with correct data',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees questionnaire view mode display correct data`,
            async () => {
                await learnerSeesQuestionnaireViewModeDisplayCorrectData(this.scenario, learner);
            }
        );
    }
);

Then(
    '{string} sees questionnaire view mode display with new data',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees questionnaire view mode display new data`,
            async () => {
                await learnerSeesQuestionnaireViewModeDisplayNewData(this.scenario, learner);
            }
        );
    }
);

Given(
    `{string} sent the notification to {string}`,
    async function (
        this: IMasterWorld,
        adminRole: AccountRoles,
        studentRole: AccountRoles
    ): Promise<void> {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        )!;

        await cms.instruction(`Admin send notification to student`, async () => {
            const context = this.scenario;
            await sendCreatedQuestionnaireNotificationByGrpc(cms, context, [learnerProfile.id]);
        });
    }
);

Then(
    '{string} sees the errors of each question',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees the validation error of each question`,
            async () => {
                await learnerSeesValidationErrorsOfEachQuestion(this.scenario, learner);
            }
        );
    }
);

Given(
    '{string} has submitted questionnaire with valid data',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `Student has submitted questionnaire with valid data`,
            async () => {
                await learnerFillAllQuestionsWithValidData(this.scenario, learner);
                await learnerClicksOnSubmitQuestionnaireButton(learner);
                await learnerAcceptQuestionnaireSubmission(learner);
            }
        );
    }
);

Given(
    '{string} clicked on resubmit button',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`Student clicks on resubmit button`, async () => {
            await learnerClicksOnResubmitQuestionnaireButton(learner);
        });
    }
);

When(
    '{string} changes answer of the questions',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} changes answer of the questions`, async () => {
            await learnerChangeAnswerOfQuestions(this.scenario, learner);
        });
    }
);

When('{string} clicks on back button', async function (this: IMasterWorld, role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} clicks on back button of notification detail screen`,
        async () => {
            await learnerClicksOnBackButtonOfNotificationDetailScreen(learner);
        }
    );
});

When(
    '{string} accepts the discard changes',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} accepts the discard changes`, async () => {
            await learnerAcceptTheDiscardChanges(learner);
        });
    }
);

Then(
    '{string} sees questionnaire view mode display with old data',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees questionnaire view mode display with old data`,
            async () => {
                await learnerSeesQuestionnaireViewModeDisplayOldData(this.scenario, learner);
            }
        );
    }
);

Then('{string} sees the previous screen', async function (this: IMasterWorld, role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} return to previous screen`, async () => {
        await learnerReturnToPreviousScreen(learner);
    });
});
When(
    '{string} remove answers of the questions',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} remove answers of the questions`, async () => {
            await learnerRemoveAnswersOfQuestions(this.scenario, learner);
        });
    }
);
