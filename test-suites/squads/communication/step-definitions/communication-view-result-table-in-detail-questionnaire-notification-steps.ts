import { actionPanelTriggerButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { studentsAutocompleteInput } from '@legacy-step-definitions/cms-selectors/lesson-management';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getRandomNumber,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';

import { DataTable, Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import * as communicationAliasKeys from './alias-keys/communication';
import {
    fillTitleAndContentOnDialog,
    openComposeMessageDialog,
    selectIndividualRecipientOnDialog,
    selectUserTypesRadioOnDialog,
} from './communication-common-definitions';
import {
    AnswersDataTableRow,
    clickAllowResubmissionToggle,
    QuestionnaireAnswerTable,
} from './communication-common-questionnaire-definitions';
import {
    learnerAcceptQuestionnaireSubmission,
    learnerClicksOnResubmitQuestionnaireButton,
    learnerClicksOnSubmitQuestionnaireButton,
} from './communication-notification-questionnaire-definitions';
import {
    learnerClearCurrentAnswers,
    learnerFillAllQuestionsWithAnswersData,
    checkQuestionnaireResultInTable,
} from './communication-view-result-table-in-detail-questionnaire-notification-definitions';

Given('{string} open compose dialog', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction('Opens compose dialog', async () => {
        await openComposeMessageDialog(cms);
    });
});

Given(
    '{string} input required fields with individual recipient {string}',
    async function (role: AccountRoles, listStudentRoles: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction('Selects the "All" user type on the compose dialog', async () => {
            await selectUserTypesRadioOnDialog(cms, 'All');
        });

        await cms.instruction('Fills the title and content of the compose dialog', async () => {
            await fillTitleAndContentOnDialog(cms, context, {
                title: `Title E2E ${getRandomNumber()}`,
                content: `Content ${getRandomNumber()}`,
            });
        });

        const studentRoles = splitRolesStringToAccountRoles(listStudentRoles);

        for (const studentRole of studentRoles) {
            await cms.instruction(`Selecting individual with role: "${studentRole}"`, async () => {
                await cms.waitingAutocompleteLoading(studentsAutocompleteInput);
                await selectIndividualRecipientOnDialog(cms, context, studentRole);
            });
        }
    }
);

Given('{string} click Allow Resubmission', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction('Allowed Resubmission', async () => {
        await clickAllowResubmissionToggle(cms);
    });
});

Given(
    '{string} filled out all questions and submitted the questionnaire',
    async function (this: IMasterWorld, role: AccountRoles, answersDataTable: DataTable) {
        const answersData: AnswersDataTableRow[] = answersDataTable.hashes();
        const learner = getLearnerInterfaceFromRole(this, role);
        const context = this.scenario;
        context.set(communicationAliasKeys.aliasQuestionnaireAnswersByRole(role), answersData);
        await learner.instruction(`{string} fill all questions with data`, async function () {
            await learnerFillAllQuestionsWithAnswersData(context, learner, answersData);
        });

        await learner.instruction(`${role} submits questionnaire`, async () => {
            await learnerClicksOnSubmitQuestionnaireButton(learner);
        });

        await learner.instruction(`${role} accepts questionnaire submission`, async () => {
            await learnerAcceptQuestionnaireSubmission(learner);
        });
    }
);

When(
    '{string} resubmit question with new data',
    async function (this: IMasterWorld, role: AccountRoles, answersDataTable: DataTable) {
        const newAnswers: AnswersDataTableRow[] = answersDataTable.hashes();
        const learner = getLearnerInterfaceFromRole(this, role);
        const context = this.scenario;
        const currentAnswers = context.get<AnswersDataTableRow[]>(
            communicationAliasKeys.aliasQuestionnaireAnswersByRole(role)
        );
        await learner.instruction(`Student clicks on resubmit button`, async () => {
            await learnerClicksOnResubmitQuestionnaireButton(learner);
        });

        await learner.instruction(`{string} clear current answers`, async function () {
            await learnerClearCurrentAnswers(context, learner, currentAnswers);
        });

        await learner.instruction(`{string} fill all questions with new data`, async function () {
            await learnerFillAllQuestionsWithAnswersData(context, learner, newAnswers);
        });

        await learner.instruction(`${role} submits questionnaire`, async () => {
            await learnerClicksOnSubmitQuestionnaireButton(learner);
        });

        await learner.instruction(`${role} accepts questionnaire submission`, async () => {
            await learnerAcceptQuestionnaireSubmission(learner);
        });
    }
);

When(
    '{string} open questionnaire result table',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction('Reload CMS to get the updated notification', async function () {
            await cms.page?.reload();
            await cms.waitingForLoadingIcon();
            await cms.waitForSkeletonLoading();
        });

        await cms.instruction('Open action panel recipient', async () => {
            await cms.page!.click(actionPanelTriggerButton);
        });

        await cms.instruction('Select and open questionnaire result table table', async () => {
            await cms.selectAButtonByAriaLabel('View Result');
        });
    }
);

Then(
    '{string} sees result table display',
    async function (this: IMasterWorld, role: AccountRoles, resultsDataTable: DataTable) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const resultsData: QuestionnaireAnswerTable[] = resultsDataTable.hashes();

        await cms.waitForDataTestId('QuestionnaireResultTable__table');

        await cms.instruction('Check data in table questionnaire result', async () => {
            await checkQuestionnaireResultInTable(resultsData, cms, context);
        });
    }
);

Then(
    `{string} search name {string} of Questionnaire Result dialog`,
    async function (roleCMS: AccountRoles, roleStudent: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, roleCMS);

        const learner = getLearnerInterfaceFromRole(this, roleStudent);
        const studentName = (await learner.getProfile()).name;
        await cms.attach(`Student name of role ${roleStudent}: ${studentName}`);

        await cms.searchInFilter(studentName);
    }
);

Then(
    `{string} see correct record in Questionnaire Result table`,
    async function (roleCMS: AccountRoles, resultsDataTable: DataTable) {
        const cms = getCMSInterfaceByRole(this, roleCMS);
        const context = this.scenario;

        const resultsData: QuestionnaireAnswerTable[] = resultsDataTable.hashes();

        await cms.waitForDataTestId('QuestionnaireResultTable__table');

        await cms.instruction('Check data in table questionnaire result', async () => {
            await checkQuestionnaireResultInTable(resultsData, cms, context);
        });
    }
);
