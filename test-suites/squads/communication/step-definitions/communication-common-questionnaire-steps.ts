import {
    arrayHasItem,
    getCMSInterfaceByRole,
    getRandomNumber,
} from '@legacy-step-definitions/utils';

import { DataTable, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasQuestionnaireTable } from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import { openAndInputNotificationDataToComposeForm } from './communication-common-definitions';
import {
    assertNotificationWithoutQuestionnaire,
    checkDisableDeleteAnswerIconOfQuestionnaire,
    clickAddAnswerButton,
    clickAddQuestionButton,
    clickImportantNotificationToggle,
    deleteQuestionSection,
    fillAnswerContentInQuestionnaire,
    fillQuestionTitleInQuestionnaire,
    MappedQuestionnaireTable,
    mapQuestionnaireTable,
    QuestionnaireFormData,
    QuestionnaireTable,
    selectQuestionTypeInQuestionnaire,
} from './communication-common-questionnaire-definitions';
import { MIN_ANSWER } from './communication-constants';

When(
    '{string} creates Questions and Answers of Questionnaire section',
    async function (role: AccountRoles, questionnaireTable: DataTable) {
        const cms = getCMSInterfaceByRole(this, role);

        const hashedQuestionnaireTable: QuestionnaireTable[] = questionnaireTable.hashes();
        const mappedQuestionnaireTable = mapQuestionnaireTable(hashedQuestionnaireTable);

        this.scenario.set(aliasQuestionnaireTable, mappedQuestionnaireTable);

        for (const [questionnaireIndex, questionnaire] of mappedQuestionnaireTable.entries()) {
            await clickAddQuestionButton(cms);

            const questionSectionElement = await cms.page!.$(
                CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionnaireIndex)
            );
            if (!questionSectionElement)
                throw Error('Cannot find question section in questionnaire');

            let questionContent = '';
            const answerContents = [];

            if (questionnaire.questionTextBox === 'valid') {
                questionContent = `Question ${getRandomNumber()}`;
                await fillQuestionTitleInQuestionnaire(
                    cms,
                    questionSectionElement,
                    questionContent
                );
            }

            await selectQuestionTypeInQuestionnaire(
                cms,
                questionSectionElement,
                questionnaire.questionType
            );

            if (questionnaire.questionType !== 'QUESTION_TYPE_FREE_TEXT') {
                for (
                    let answerIndex = 0;
                    answerIndex < questionnaire.numberOfAnswersEach;
                    answerIndex++
                ) {
                    if (answerIndex >= MIN_ANSWER) {
                        await clickAddAnswerButton(cms, questionSectionElement);
                    }

                    if (questionnaire.answerTextBox === 'valid') {
                        const answerContent = `Answer ${getRandomNumber()}`;
                        answerContents.push(answerContent);

                        await fillAnswerContentInQuestionnaire(
                            cms,
                            questionSectionElement,
                            answerIndex,
                            answerContent
                        );
                    }
                }
            }

            const questionnaireFormData: QuestionnaireFormData = {
                questionContent,
                answerContents,
                questionType: questionnaire.questionType,
            };
            if (questionnaire.questionSection) {
                this.scenario.set(questionnaire.questionSection, questionnaireFormData);
            }
        }
    }
);

When('{string} open compose dialog and input required fields', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction('Open compose dialog and input required fields', async function () {
        await openAndInputNotificationDataToComposeForm(cms, scenario);
    });
});

Then(`{string} delete question`, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    const existedQuestionnaire = await cms.page?.$$(CommunicationSelectors.questionSection);

    if (!arrayHasItem(existedQuestionnaire))
        throw Error('Cannot find question section in questionnaire for delete');

    const questionSectionRemoveIndex = existedQuestionnaire!.length - 1;

    await deleteQuestionSection(cms, questionSectionRemoveIndex);
});

Then(
    `{string} sees questionnaire notification back to default notification`,
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertNotificationWithoutQuestionnaire(cms);
    }
);

When(
    '{string} has set the notification as {string}',
    async function (role: AccountRoles, importantField: string) {
        const cms = getCMSInterfaceByRole(this, role);
        if (importantField === 'important') {
            await cms.instruction(
                `${role} set the notification as ${importantField}}`,
                async function () {
                    await clickImportantNotificationToggle(cms);
                }
            );
        }
    }
);

Then('{string} sees delete answer button disable', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const questionnaireTable: MappedQuestionnaireTable[] =
        this.scenario.get(aliasQuestionnaireTable);

    for (const [questionnaireIndex, questionnaire] of questionnaireTable.entries()) {
        if (questionnaire.numberOfAnswersEach === MIN_ANSWER) {
            const questionSectionElement = await cms.page!.$(
                CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionnaireIndex)
            );

            if (!questionSectionElement) throw Error(`Cannot find question section`);

            await cms.attach(`Check question answers disabled with index ${questionnaireIndex}`);
            await checkDisableDeleteAnswerIconOfQuestionnaire(cms, questionSectionElement, {
                isDisabled: true,
            });
        }
    }
});
