import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { QuestionnaireMode } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';
import { UpsertNotificationProps } from '@supports/services/notificationmgmt-notification/request-types';

import {
    aliasCreatedNotificationData,
    aliasCreatedQuestionnaire,
} from './alias-keys/communication';
import {
    createANotificationGrpc,
    createQuestionnaireGrpc,
} from './communication-create-notification-definitions';
import {
    notificationDetailBackButton,
    notificationDetailScrollView,
    questionnaireDiscardChangesAcceptButton,
    questionAnswerItem,
    questionChoiceItem,
    questionnaireEditMode,
    questionnaireQuestionItem,
    questionnaireResubmitButton,
    questionnaireSubmitButton,
    questionnaireValidationErrorKey,
    questionnaireViewMode,
    submitQuestionnaireAcceptButton,
} from './learner-keys/communication-key';
import { ByValueKey, FlutterDriver } from 'flutter-driver-x';
import { SerializableFinder } from 'flutter-driver-x/dist/common/find';
import { Questionnaire, QuestionType } from 'manabuf/common/v1/notifications_pb';

export const questionnaireDummyTextAnswer = 'Manabie';
export const questionnaireDummyTextNewAnswer = 'Manabie - updated';

export interface QuestionnaireDataTableRow {
    questionType: string;
    required: boolean;
    numberOfQuestions: number;
}

export function createNotificationWithQuestionnaireData(
    context: ScenarioContext,
    questionnaireData: QuestionnaireDataTableRow[],
    resubmitAllowed: boolean,
    expiredAt?: Date
) {
    const createdNotificationData = createANotificationGrpc({
        courseIds: [],
        gradeIds: [],
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        targetGroup: [UserRoles.USER_GROUP_STUDENT, UserRoles.USER_GROUP_PARENT],
        receiverIdsList: [],
    });

    const createdQuestionnaire = createQuestionnaireGrpc(
        resubmitAllowed,
        questionnaireData,
        expiredAt
    );

    context.set(aliasCreatedNotificationData, createdNotificationData);
    context.set(aliasCreatedQuestionnaire, createdQuestionnaire);
}

export async function sendCreatedQuestionnaireNotificationByGrpc(
    cms: CMSInterface,
    context: ScenarioContext,
    learnerIds: string[]
) {
    const createdNotificationData = context.get<UpsertNotificationProps>(
        aliasCreatedNotificationData
    );
    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);

    createdNotificationData.receiverIdsList.push(...learnerIds);
    const token = await cms.getToken();
    const { response: responseDraftNotification } =
        await notificationMgmtNotificationService.upsertNotification(
            token,
            createdNotificationData,
            createdQuestionnaire
        );

    if (responseDraftNotification) {
        await notificationMgmtNotificationService.sendNotification(
            token,
            responseDraftNotification.notificationId
        );
    }
}

export async function learnerFillAllQuestionsWithValidData(
    context: ScenarioContext,
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const scrollViewFinder = new ByValueKey(notificationDetailScrollView);
    const editModeFinder = new ByValueKey(questionnaireEditMode);
    await driver.waitFor(editModeFinder);

    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);

    for (const question of createdQuestionnaire.questionsList) {
        const questionFinder = new ByValueKey(
            questionnaireQuestionItem(
                QuestionnaireMode.editMode,
                question.orderIndex,
                question.type
            )
        );
        await driver.waitFor(questionFinder);

        const choiceIndex = 0;
        const firstChoiceItemFinder = new ByValueKey(
            questionChoiceItem(question.orderIndex, choiceIndex)
        );
        await scrollUntilVisible(driver, scrollViewFinder, firstChoiceItemFinder);

        if (question.type == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            await driver.tap(firstChoiceItemFinder);
            await driver.enterText(questionnaireDummyTextAnswer);
        } else {
            await driver.tap(firstChoiceItemFinder);
        }
    }
}

export async function learnerClicksOnSubmitQuestionnaireButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const scrollViewFinder = new ByValueKey(notificationDetailScrollView);
    //scroll to bottom
    await driver.scroll(scrollViewFinder, 0, -10000, 50, 50);
    const submitButtonFinder = new ByValueKey(questionnaireSubmitButton(true));
    await driver.tap(submitButtonFinder);
}

export async function learnerClicksOnResubmitQuestionnaireButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const resubmitButtonFinder = new ByValueKey(questionnaireResubmitButton);
    await driver.tap(resubmitButtonFinder);
}

export async function learnerAcceptQuestionnaireSubmission(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const acceptButtonFinder = new ByValueKey(submitQuestionnaireAcceptButton);
    await driver.tap(acceptButtonFinder);
}

export async function learnerSeesQuestionnaireViewModeDisplayCorrectData(
    context: ScenarioContext,
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);
    for (const question of createdQuestionnaire.questionsList) {
        const questionFinder = new ByValueKey(
            questionnaireQuestionItem(
                QuestionnaireMode.viewMode,
                question.orderIndex,
                question.type
            )
        );
        await driver.waitFor(questionFinder);

        const answerIndex = 0;
        const answerItemFinder = new ByValueKey(
            questionAnswerItem(question.orderIndex, answerIndex)
        );
        await driver.waitFor(answerItemFinder);
        if (question.type == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            const text = await driver.getText(answerItemFinder);
            weExpect(text).toEqual(questionnaireDummyTextAnswer);
        }
    }
}

export async function learnerSeesQuestionnaireViewModeDisplayNewData(
    context: ScenarioContext,
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);
    for (const question of createdQuestionnaire.questionsList) {
        const questionFinder = new ByValueKey(
            questionnaireQuestionItem(
                QuestionnaireMode.viewMode,
                question.orderIndex,
                question.type
            )
        );
        await driver.waitFor(questionFinder);

        const firstAnswerItemFinder = new ByValueKey(questionAnswerItem(question.orderIndex, 0));
        const secondAnswerItemFinder = new ByValueKey(questionAnswerItem(question.orderIndex, 1));
        if (question.type == QuestionType.QUESTION_TYPE_CHECK_BOX) {
            await driver.waitFor(firstAnswerItemFinder);
            await driver.waitFor(secondAnswerItemFinder);
        }
        if (question.type == QuestionType.QUESTION_TYPE_MULTIPLE_CHOICE) {
            await driver.waitFor(secondAnswerItemFinder);
        }
        if (question.type == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            await driver.waitFor(firstAnswerItemFinder);
            const newText = await driver.getText(firstAnswerItemFinder);
            weExpect(newText).toEqual(questionnaireDummyTextNewAnswer);
        }
    }
}

export async function learnerSeeViewModeAndResubmitButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const viewModeFinder = new ByValueKey(questionnaireViewMode);
    await driver.waitFor(viewModeFinder);

    const resubmitButtonFinder = new ByValueKey(questionnaireResubmitButton);
    await driver.waitFor(resubmitButtonFinder);
}

export async function learnerSeesValidationErrorsOfEachQuestion(
    context: ScenarioContext,
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;

    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);

    for (const question of createdQuestionnaire.questionsList) {
        const questionFinder = new ByValueKey(
            questionnaireQuestionItem(
                QuestionnaireMode.editMode,
                question.orderIndex,
                question.type
            )
        );
        await driver.waitFor(questionFinder);

        const validationErrorFinder = new ByValueKey(
            questionnaireValidationErrorKey(question.orderIndex)
        );
        await driver.waitFor(validationErrorFinder);
    }
}

export async function learnerRemoveAnswersOfQuestions(
    context: ScenarioContext,
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const scrollViewFinder = new ByValueKey(notificationDetailScrollView);

    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);

    for (const question of createdQuestionnaire.questionsList) {
        const firstChoiceItemFinder = new ByValueKey(questionChoiceItem(question.orderIndex, 0));
        await scrollUntilVisible(driver, scrollViewFinder, firstChoiceItemFinder);
        if (question.type == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            await driver.tap(firstChoiceItemFinder);
            await driver.enterText('');
        } else {
            await driver.tap(firstChoiceItemFinder);
        }
    }
}

export async function learnerChangeAnswerOfQuestions(
    context: ScenarioContext,
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const scrollViewFinder = new ByValueKey(notificationDetailScrollView);

    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);

    for (const question of createdQuestionnaire.questionsList) {
        if (question.type == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            const firstChoiceItemFinder = new ByValueKey(
                questionChoiceItem(question.orderIndex, 0)
            );
            await scrollUntilVisible(driver, scrollViewFinder, firstChoiceItemFinder);
            await driver.tap(firstChoiceItemFinder);
            await driver.enterText(questionnaireDummyTextNewAnswer);
        } else {
            const secondChoiceItemFinder = new ByValueKey(
                questionChoiceItem(question.orderIndex, 1)
            );
            await scrollUntilVisible(driver, scrollViewFinder, secondChoiceItemFinder);
            await driver.tap(secondChoiceItemFinder);
        }
    }
}

async function scrollUntilVisible(
    driver: FlutterDriver,
    scrollViewFinder: SerializableFinder,
    itemFinder: SerializableFinder
) {
    await driver.scrollUntilVisible(scrollViewFinder, itemFinder, 0, 0, -200, 20000);
}

export async function learnerClicksOnBackButtonOfNotificationDetailScreen(
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const notificationDetailBackButtonFinder = new ByValueKey(notificationDetailBackButton);
    await driver.tap(notificationDetailBackButtonFinder);
}

export async function learnerAcceptTheDiscardChanges(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const questionnaireDiscardChangesAcceptButtonFinder = new ByValueKey(
        questionnaireDiscardChangesAcceptButton
    );
    await driver.tap(questionnaireDiscardChangesAcceptButtonFinder);
}

export async function learnerSeesQuestionnaireViewModeDisplayOldData(
    context: ScenarioContext,
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const createdQuestionnaire = context.get<Questionnaire.AsObject>(aliasCreatedQuestionnaire);
    for (const question of createdQuestionnaire.questionsList) {
        const questionFinder = new ByValueKey(
            questionnaireQuestionItem(
                QuestionnaireMode.viewMode,
                question.orderIndex,
                question.type
            )
        );
        await driver.waitFor(questionFinder);

        const firstAnswerItemFinder = new ByValueKey(questionAnswerItem(question.orderIndex, 0));
        if (
            question.type == QuestionType.QUESTION_TYPE_CHECK_BOX ||
            question.type == QuestionType.QUESTION_TYPE_MULTIPLE_CHOICE
        ) {
            await driver.waitFor(firstAnswerItemFinder);
        }
        if (question.type == QuestionType.QUESTION_TYPE_FREE_TEXT) {
            await driver.waitFor(firstAnswerItemFinder);
            const oldText = await driver.getText(firstAnswerItemFinder);
            weExpect(oldText).toEqual(questionnaireDummyTextAnswer);
        }
    }
}

export async function learnerReturnToPreviousScreen(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const notificationDetailScreenFinder = new ByValueKey(LearnerKeys.notificationDetail);
    await driver.waitForAbsent(notificationDetailScreenFinder);
}
