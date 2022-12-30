import { tableBaseBody, tableBaseRow } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { QuestionnaireMode } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';

import * as communicationCmsSelectors from './cms-selectors/communication';
import {
    AnswersDataTableRow,
    QuestionnaireAnswerTable,
    QuestionnaireFormData,
} from './communication-common-questionnaire-definitions';
import * as communicationLearnerKeys from './learner-keys/communication-key';
import { ByValueKey, FlutterDriver } from 'flutter-driver-x';
import { SerializableFinder } from 'flutter-driver-x/dist/common/find';
import { QuestionType } from 'manabuf/common/v1/notifications_pb';

export async function learnerFillAllQuestionsWithAnswersData(
    context: ScenarioContext,
    learner: LearnerInterface,
    answersData: AnswersDataTableRow[]
) {
    const driver = learner.flutterDriver!;
    const scrollViewFinder = new ByValueKey(communicationLearnerKeys.notificationDetailScrollView);
    const editModeFinder = new ByValueKey(communicationLearnerKeys.questionnaireEditMode);
    await driver.waitFor(editModeFinder);
    for (let questionIndex = 0; questionIndex < answersData.length; questionIndex++) {
        const item = answersData[questionIndex];
        const questionInfo = context.get<QuestionnaireFormData>(item.questionSection);
        const questionType = QuestionType[questionInfo.questionType];
        const questionFinder = new ByValueKey(
            communicationLearnerKeys.questionnaireQuestionItem(
                QuestionnaireMode.editMode,
                questionIndex,
                questionType
            )
        );
        await driver.waitFor(questionFinder);

        if (
            questionType == QuestionType.QUESTION_TYPE_MULTIPLE_CHOICE ||
            questionType == QuestionType.QUESTION_TYPE_CHECK_BOX
        ) {
            const choices = item.answer.split(', ');
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];

                const choiceIndex = choice.charCodeAt(0) - 65;
                const choiceItemFinder = new ByValueKey(
                    communicationLearnerKeys.questionChoiceItem(questionIndex, choiceIndex)
                );
                await scrollUntilVisible(driver, scrollViewFinder, choiceItemFinder);
                await driver.tap(choiceItemFinder);
            }
        }
        if (questionType == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            const textFieldFinder = new ByValueKey(
                communicationLearnerKeys.questionChoiceItem(questionIndex, 0)
            );
            await scrollUntilVisible(driver, scrollViewFinder, textFieldFinder);
            await driver.tap(textFieldFinder);
            await driver.enterText(item.answer);
        }
    }
}

export async function learnerClearCurrentAnswers(
    context: ScenarioContext,
    learner: LearnerInterface,
    currentAnswers: AnswersDataTableRow[]
) {
    const driver = learner.flutterDriver!;
    const scrollViewFinder = new ByValueKey(communicationLearnerKeys.notificationDetailScrollView);
    const editModeFinder = new ByValueKey(communicationLearnerKeys.questionnaireEditMode);
    await driver.waitFor(editModeFinder);
    for (let questionIndex = 0; questionIndex < currentAnswers.length; questionIndex++) {
        const item = currentAnswers[questionIndex];
        const questionInfo = context.get<QuestionnaireFormData>(item.questionSection);
        const questionType = QuestionType[questionInfo.questionType];

        if (questionType == QuestionType.QUESTION_TYPE_CHECK_BOX) {
            const choices = item.answer.split(', ');
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];
                const choiceIndex = choice.charCodeAt(0) - 65;
                const choiceItemFinder = new ByValueKey(
                    communicationLearnerKeys.questionChoiceItem(questionIndex, choiceIndex)
                );
                await scrollUntilVisible(driver, scrollViewFinder, choiceItemFinder);
                await driver.tap(choiceItemFinder);
            }
        }
        if (questionType == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            const textFieldFinder = new ByValueKey(
                communicationLearnerKeys.questionChoiceItem(questionIndex, 0)
            );
            await scrollUntilVisible(driver, scrollViewFinder, textFieldFinder);
            await driver.tap(textFieldFinder);
            await driver.enterText('');
        }
    }
    await driver.scrollUntilVisible(scrollViewFinder, editModeFinder, 0, 0, 1000, 20000);
}

async function scrollUntilVisible(
    driver: FlutterDriver,
    scrollViewFinder: SerializableFinder,
    itemFinder: SerializableFinder
) {
    await driver.scrollUntilVisible(scrollViewFinder, itemFinder, 0, 0, -200, 20000);
}

export async function checkQuestionnaireResultInTable(
    resultsData: QuestionnaireAnswerTable[],
    cms: CMSInterface,
    context: ScenarioContext
) {
    const rows = await cms.page!.$$(
        `${communicationCmsSelectors.questionnaireResultTable} > ${tableBaseBody} > ${tableBaseRow}`
    );

    for (const [questionIndex, result] of resultsData.entries()) {
        const responderName = await rows[questionIndex].$(
            `${communicationCmsSelectors.responderNameColumn}`
        );
        const text = await responderName?.textContent();

        const userProfile = context.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(result['Responder Name'] as AccountRoles)
        );

        weExpect(text).toEqual(userProfile?.name);

        const selectorQuestionAnswer = await rows[questionIndex].$$(
            `${communicationCmsSelectors.questionAnswerColumn}`
        );

        for (let i = 0; i < selectorQuestionAnswer.length; i++) {
            const answer = await selectorQuestionAnswer[i]?.textContent();
            weExpect(answer).toEqual(result[`Question ${i + 1}`]);
        }
    }
}
