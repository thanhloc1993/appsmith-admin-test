import { getRandomNumber } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { DataTable } from '@cucumber/cucumber';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationName,
    aliasNotificationCreatedCourseName,
    aliasNotificationGradeName,
    aliasQuestionnaireTable,
} from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    checkDetailAnswerExpandStateInQuestionSectionDetail,
    checkAccordionAnswerContent,
} from './communication-collapse-and-expand-question-in-detail-notification-questionnaire-definitions';
import {
    QuestionnaireTable,
    mapQuestionnaireTable,
    clickAddQuestionButton,
    fillQuestionTitleInQuestionnaire,
    selectQuestionTypeInQuestionnaire,
    clickAddAnswerButton,
    fillAnswerContentInQuestionnaire,
    QuestionnaireFormData,
    MappedQuestionnaireTable,
} from './communication-common-questionnaire-definitions';
import { MIN_ANSWER } from './communication-constants';
import { getNotificationIdByTitleWithHasura } from './communication-notification-hasura';
import { getAccordionQuestionContentWithPrefix } from './communication-utils';

export const createQuestionnaireWithDataTable = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    questionnaireTable: DataTable
) => {
    const hashedQuestionnaireTable: QuestionnaireTable[] = questionnaireTable.hashes();
    const mappedQuestionnaireTable = mapQuestionnaireTable(hashedQuestionnaireTable);

    scenario.set(aliasQuestionnaireTable, mappedQuestionnaireTable);

    for (const [questionnaireIndex, questionnaire] of mappedQuestionnaireTable.entries()) {
        await clickAddQuestionButton(cms);

        const questionSectionElement = await cms.page!.$(
            CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionnaireIndex)
        );
        if (!questionSectionElement) throw Error('Cannot find question section in questionnaire');

        let questionContent = '';
        const answerContents = [];

        if (questionnaire.questionTextBox === 'valid') {
            questionContent = `Question ${getRandomNumber()}`;
            await fillQuestionTitleInQuestionnaire(cms, questionSectionElement, questionContent);
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
            scenario.set(questionnaire.questionSection, questionnaireFormData);
        }
    }
};

export const assertNotificationFormDataWithoutQuestionnaire = async (
    cms: CMSInterface,
    scenario: ScenarioContext
) => {
    const { name: createdStudentName } = scenario.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const createdCourseName = scenario.get<string>(aliasNotificationCreatedCourseName);
    const gradeFromStudent: string = scenario.get<string>(aliasNotificationGradeName);

    const title = scenario.get(aliasCreatedNotificationName);
    const content = scenario.get(aliasCreatedNotificationContent);
    const notificationId = await getNotificationIdByTitleWithHasura(cms, title);

    await cms.instruction(
        `Notification Form 
    Notification Clone id: ${notificationId}
    Individual: ${createdStudentName}
    Course: ${createdCourseName}
    Grade: ${gradeFromStudent}
    Title: ${title}
    Content: ${content}`,
        async () => {
            const notificationTitleInputValue = await cms.page?.inputValue(
                CommunicationSelectors.notificationTitleInput
            );
            weExpect(notificationTitleInputValue).toEqual(title);

            await cms.waitForSelectorWithText(
                `${CommunicationSelectors.notificationDetailContent} span[data-text="true"]`,
                content
            );

            await cms.waitForSelectorWithText(
                `${CommunicationSelectors.coursesAutocompleteHF} ${CommunicationSelectors.chipAutocompleteText}`,
                createdCourseName
            );

            await cms.waitForSelectorWithText(
                `${CommunicationSelectors.gradesMasterAutocompleteHF} ${CommunicationSelectors.chipAutocompleteText}`,
                gradeFromStudent
            );

            await cms.waitForSelectorHasText(
                `${CommunicationSelectors.studentsAutocompleteHF} ${CommunicationSelectors.chipAutocompleteText}`,
                createdStudentName
            );
        }
    );
};

export const assertNotificationDetailQuestionnaire = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    questionnaireTable: MappedQuestionnaireTable[],
    questionSections: MappedQuestionnaireTable['questionSection'][]
) => {
    for (const [questionnaireIndex, { questionSection }] of questionnaireTable.entries()) {
        if (questionSection && questionSections.includes(questionSection)) {
            const questionnaireFormData: QuestionnaireFormData = scenario.get(questionSection);

            if (questionnaireFormData.questionType !== 'QUESTION_TYPE_FREE_TEXT') {
                await checkDetailAnswerExpandStateInQuestionSectionDetail(
                    cms,
                    'expand',
                    questionnaireIndex
                );
                await checkAccordionAnswerContent(cms, questionnaireFormData, questionnaireIndex);
            } else {
                await cms.attach(
                    `Question with type Short Answer don't have Accordion data-testid`
                );

                const questionTitle = await cms.page!.$$(
                    CommunicationSelectors.accordionQuestionTitle
                );

                const questionTextContent = await questionTitle[questionnaireIndex].textContent();

                const questionContentWithPrefix = getAccordionQuestionContentWithPrefix(
                    questionnaireFormData.questionContent,
                    questionnaireIndex
                );

                await cms.attach(
                    `Compare accordion question content ${questionTextContent} and ${questionContentWithPrefix}`
                );

                //TODO: @communication Expect question text content with rate of respondents when implement automation test for Consolidated Statistic
                weExpect(questionTextContent).toEqual(questionContentWithPrefix);
            }
        }
    }
};
