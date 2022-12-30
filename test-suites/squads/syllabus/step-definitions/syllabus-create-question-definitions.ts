import {
    questionGroupListRoot,
    questionListItemByText,
} from '@legacy-step-definitions/cms-selectors/syllabus';
import { asyncForEach, genId } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { Quiz } from '@supports/services/common/quiz';
import { QuizTypeTitle } from '@supports/types/cms-types';

import {
    aliasOriginalQuizQuestionNames,
    aliasQuizByAttempt,
    aliasQuizDescriptions,
    aliasQuizQuestionName,
    aliasQuizQuestionNames,
    aliasQuizTypeTitle,
    aliasRandomQuizzes,
    aliasRemainingQuizCount,
    aliasTotalAttempts,
    aliasTotalQuestionCount,
} from './alias-keys/syllabus';
import { QuizDescription, QuizDifficultyLevels } from './cms-models/quiz';
import {
    autoCompleteBaseInput,
    draftEditor,
    fillInTheBlankInput,
    loAndAssignmentByName,
    questionListTable,
    questionRow,
    quizAnswerMultipleAnswerBoxes,
    quizAnswerMultipleChoiceBoxes,
    quizExplanationBoxInput,
    quizPointHFInput,
    quizPreviewDifficultText,
    quizPreviewKindText,
    quizPreviewPointText,
    quizPreviewRoot,
    quizQuestionEditorInput,
    quizTablePreviewBtn,
    quizV2SelectDifficult,
    quizV2TaggedLOsInput,
    tableRowByText,
    textBox,
} from './cms-selectors/cms-keys';
import { singleQuestionPreviewBtn } from './cms-selectors/syllabus';
import { learnerLeaveHandwritingMode } from './syllabus-do-lo-quiz-definitions';
import { checkIsQuestionGroupEnabled } from './syllabus-migration-temp';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminClickCreateQuestion,
    schoolAdminFillsAllAnswersByQuestionType,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import { getQuizTypeValue, waitForLoadingAbsent } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';
import { QuizBaseInfo } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export const correctAnswer = 'correctAnswer';

export async function schoolAdminGoesToLODetailsPage(cms: CMSInterface, loName: string) {
    const loRow = await cms.page!.waitForSelector(loAndAssignmentByName(loName));

    await loRow.click();

    await cms.waitingForLoadingIcon();

    await cms.assertThePageTitle(loName);

    await schoolAdminWaitingQuizTableInTheLODetail(cms);
}

export async function schoolAdminCreateLOQuestion(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    scenario: ScenarioContext
): Promise<void> {
    const questionName = `Question ${genId()}`;
    const explanationContent = `Explanation ${genId()}`;

    await schoolAdminChooseToCreateQuizWithTypeV2(cms, quizTypeTitle);

    await schoolAdminFillQuizQuestionData(cms, questionName);

    await schoolAdminFillsAllAnswersByQuestionType(cms, quizTypeTitle);

    await schoolAdminFillQuizExplanationData(cms, explanationContent);

    await schoolAdminSubmitQuestion(cms);

    const quizDescription: QuizDescription = {
        content: questionName,
        point: 1,
        type: quizTypeTitle,
        difficultyLevel: QuizDifficultyLevels.ONE,
        taggedLOs: [],
    };

    const quizDescriptions = scenario.get<QuizDescription[]>(aliasQuizDescriptions) ?? [];

    scenario.set(aliasQuizQuestionName, questionName);
    scenario.set(aliasQuizDescriptions, [...quizDescriptions, quizDescription]);
}

export async function schoolAdminFillQuizData(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    questionName: string
): Promise<void> {
    const page = cms.page!;

    await schoolAdminFillQuizQuestionData(cms, questionName);

    switch (quizTypeTitle) {
        case 'multiple choice': {
            await cms.instruction(`school admin fill MCQ answers data`, async function () {
                const answerEditors = await page!.$$(quizAnswerMultipleChoiceBoxes);
                for (let i = 0; i < answerEditors.length; i++) {
                    const testAnswer = await answerEditors[i].waitForSelector(textBox);
                    await testAnswer.fill(`Answer ${genId()}`);
                }
            });
            break;
        }

        case 'fill in the blank': {
            await cms.instruction(`school admin fill FIB answers data`, async function () {
                await page.fill(fillInTheBlankInput, correctAnswer);
            });
            break;
        }

        case 'multiple answer': {
            await cms.instruction(`school admin fill MAQ answers data`, async function () {
                const answerEditors = await page!.$$(quizAnswerMultipleAnswerBoxes);
                for (let i = 0; i < answerEditors.length; i++) {
                    const testAnswer = await answerEditors[i].waitForSelector(textBox);
                    await testAnswer.fill(`Answer ${genId()}`);
                }
            });
            break;
        }

        default:
            break;
    }

    await schoolAdminFillQuizExplanationData(cms, `Explanation ${genId()}`);
}

export const schoolAdminFillQuizQuestionData = async (cms: CMSInterface, content: string) => {
    const page = cms.page!;

    const questionEditor = await page.waitForSelector(quizQuestionEditorInput);

    await questionEditor.fill(content);
};

export const schoolAdminFillQuizPoint = async (cms: CMSInterface, point: number) => {
    const page = cms.page!;

    const questionEditor = await page.waitForSelector(quizPointHFInput);

    await questionEditor.fill(String(point));
};

export const schoolAdminFillQuizExplanationData = async (cms: CMSInterface, content: string) => {
    await cms.instruction(`school admin fills quiz explanation ${content}`, async function () {
        const page = cms.page!;

        const explanationBox = await page.waitForSelector(quizExplanationBoxInput);

        await explanationBox.fill(content);
    });
};

export const schoolAdminSeeQuestionInTable = async (cms: CMSInterface, content: string) => {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
    const selector = isQuestionGroupEnabled
        ? questionListItemByText(content)
        : tableRowByText(questionListTable, content);

    await cms.page!.waitForSelector(selector);
};

export const schoolAdminSelectPreviewQuestionInTable = async (
    cms: CMSInterface,
    content: string
) => {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
    const selector = isQuestionGroupEnabled
        ? questionListItemByText(content)
        : tableRowByText(questionListTable, content);

    const row = await cms.page!.waitForSelector(selector);

    const previewElementSelector = isQuestionGroupEnabled
        ? singleQuestionPreviewBtn
        : quizTablePreviewBtn;
    const previewElement = await row.$(previewElementSelector);

    if (!previewElement) {
        throw new Error(`Can't find ${quizTablePreviewBtn} of question ${content}`);
    }

    await previewElement.click();

    await cms.page?.waitForSelector(quizPreviewRoot);

    await cms.waitingForLoadingIcon();
};

export const schoolAdminSeeBaseInfoOfQuestionInPreview = async (
    cms: CMSInterface,
    baseInfo: QuizBaseInfo
) => {
    const { difficultyLevel, kind } = baseInfo;

    await cms.page?.waitForSelector(quizPreviewDifficultText(difficultyLevel));

    await cms.page?.waitForSelector(quizPreviewKindText(kind));
};

export const schoolAdminSeePointOnQuestionPreview = async (cms: CMSInterface, point: number) => {
    await cms.page!.waitForSelector(quizPreviewPointText(point));
};

const schoolAdminSelectQuizDifficult = async (
    cms: CMSInterface,
    level: QuizBaseInfo['difficultyLevel']
) => {
    const select = await cms.page?.waitForSelector(quizV2SelectDifficult);

    await select!.click();

    await cms.chooseOptionInAutoCompleteBoxByDataValue(level.toString());
};

export const schoolAdminSelectQuizDifficultV2 = async (
    cms: CMSInterface,
    level: QuizBaseInfo['difficultyLevel']
) => {
    const select = await cms.page?.waitForSelector(quizV2SelectDifficult);

    await select!.click();

    await cms.chooseOptionInAutoCompleteBoxByDataValue(level.toString());
};

export const schoolAdminSelectTaggedLOsOfQuiz = async (
    cms: CMSInterface,
    taggedLOs: QuizBaseInfo['taggedLONames']
) => {
    await asyncForEach(taggedLOs, async (name) => {
        await cms.page?.fill(autoCompleteBaseInput, name);
        await cms.waitingAutocompleteLoading();

        await cms.chooseOptionInAutoCompleteBoxByText(name);
    });
};

const schoolAdminSelectTaggedLOsOfQuizV2 = async (
    cms: CMSInterface,
    taggedLOs: QuizBaseInfo['taggedLONames']
) => {
    await asyncForEach(taggedLOs, async (name) => {
        await cms.page?.fill(quizV2TaggedLOsInput, name);
        await cms.waitingAutocompleteLoading();

        await cms.chooseOptionInAutoCompleteBoxByText(name);
    });
};

export const schoolAdminFillBaseInfoOfQuiz = async (cms: CMSInterface, baseInfo: QuizBaseInfo) => {
    const { kind, difficultyLevel, taggedLONames } = baseInfo;

    await schoolAdminSelectQuizDifficult(cms, difficultyLevel);

    await schoolAdminChooseToCreateQuizWithTypeV2(cms, kind);

    await schoolAdminSelectTaggedLOsOfQuiz(cms, taggedLONames);
};

export const schoolAdminFillBaseInfoOfQuizV2 = async (
    cms: CMSInterface,
    baseInfo: QuizBaseInfo
) => {
    const { kind, difficultyLevel, taggedLONames } = baseInfo;

    await schoolAdminSelectQuizDifficultV2(cms, difficultyLevel);

    await schoolAdminChooseToCreateQuizWithTypeV2(cms, kind);

    await schoolAdminSelectTaggedLOsOfQuizV2(cms, taggedLONames);
};

export async function schoolAdminChooseToCreateAQuestion(
    cms: CMSInterface,
    context: ScenarioContext,
    quizTypeTitle: QuizTypeTitle
) {
    await cms.instruction('school admin choose add new question in LO', async function () {
        await schoolAdminClickCreateQuestion(cms);

        await cms.waitingForProgressBar();
    });

    await cms.instruction(`school admin create ${quizTypeTitle} in LO`, async function () {
        await schoolAdminCreateLOQuestion(cms, quizTypeTitle, context);
    });

    context.set(aliasQuizTypeTitle, quizTypeTitle);
}

//TODO: Remove context, instruction
export async function schoolAdminSeesNewQuestionCreated(
    cms: CMSInterface,
    context: ScenarioContext,
    quizTypeTitle: QuizTypeTitle
): Promise<void> {
    const questionName = context.get<string>(aliasQuizQuestionName);
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();

    await cms.instruction(
        `school admin sees the new question ${questionName} type ${quizTypeTitle} created on CMS`,
        async function (cms) {
            const selector = isQuestionGroupEnabled
                ? questionListItemByText(questionName)
                : tableRowByText(questionListTable, questionName);

            await cms.page!.waitForSelector(selector);
            await getAllQuizQuestionsNameInTable(cms, context);
        }
    );
}
// Please don't use this function anymore, because we getting via alias (quizRaw)
export async function getAllQuizQuestionsNameInTable(cms: CMSInterface, scenario: ScenarioContext) {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();

    let names: string[] = [];

    if (isQuestionGroupEnabled) {
        const quizQuestionList = await cms.page!.waitForSelector(questionGroupListRoot);
        const quizQuestionListItem = await quizQuestionList.$$(draftEditor);

        const quizQuestionNames = await Promise.all(
            quizQuestionListItem.map((question) => question.textContent())
        );

        names = quizQuestionNames.map((question) => question!.trim());
    } else {
        const quizQuestionTable = await cms.page!.waitForSelector(questionListTable);

        const quizQuestionListItems = await quizQuestionTable.$$(questionRow);
        const quizQuestionNames = await Promise.all(
            quizQuestionListItems.map((question) => question.textContent())
        );

        names = quizQuestionNames.map((question) => question!.trim());
    }

    const totalQuizQuestions = names.length;

    scenario.set(aliasQuizQuestionNames, names);
    scenario.set(aliasOriginalQuizQuestionNames, names);
    scenario.set(aliasTotalQuestionCount, totalQuizQuestions);
}

export function getQuizTypeNumberFromModel(scenario: ScenarioContext, questionName: string) {
    const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
    const test = quizzes.find((quiz) => questionName.includes(quiz.externalId));
    return test?.kind;
}

export function getQuizTypeNumberFromAliasRandomQuizzes(
    scenario: ScenarioContext,
    questionName: string
) {
    const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
    const test = quizzes.find((quiz) => questionName == quiz.question?.raw);
    return test?.kind;
}

export async function studentGoesToLODetailsPage(
    learner: LearnerInterface,
    topicName: string,
    studyPlanItemName: string
): Promise<void> {
    const driver = learner.flutterDriver!;

    const loListScreenKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));
    await driver.waitFor(loListScreenKey);
    const studyPlanItemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));

    try {
        await driver.scrollUntilVisible(loListScreenKey, studyPlanItemKey, 0.0, 0.0, -100, 5000);
        await driver.tap(studyPlanItemKey);
    } catch (error) {
        throw new Error(`Not found ${studyPlanItemName}`);
    }
}

export async function studentSeesAndDoesLOQuestions(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    quizTypeTitle?: QuizTypeTitle
): Promise<void> {
    const bookQuestionNames = scenario.get<string[]>(aliasQuizQuestionNames);
    const newQuestionName = scenario.get<string>(aliasQuizQuestionName);
    for (const questionName of bookQuestionNames) {
        let quizNumber;
        if (questionName !== newQuestionName) {
            quizNumber = getQuizTypeNumberFromModel(scenario, questionName);
        } else {
            const { quizTypeNumber } = getQuizTypeValue({ quizTypeTitle });
            quizNumber = quizTypeNumber;
        }

        await studentDoesQuizQuestion(learner, quizNumber!, questionName);
        await studentSubmitsQuizAnswer(learner, questionName);
    }
}

export async function studentSeesAndDoesLOQuestionsWithIncorrectQuizzes(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    incorrectQuizzesCount: number,
    totalQuestion?: number
): Promise<void> {
    const bookQuestionNames = scenario.get<string[]>(aliasQuizQuestionNames);
    let totalQuiz = bookQuestionNames.length;

    if (totalQuestion != null) {
        totalQuiz = totalQuestion;
    }
    // For check retry mode, create 3 FIB quizzes for easily controlling correct quizzes;
    // therefore, check only QUIZ_TYPE_FIB and do the quizzes correctly

    for (let i = 0; i < totalQuiz - incorrectQuizzesCount; i++) {
        await studentSeesAndDoesFIBQuestionCorrectly(learner, bookQuestionNames[i]);
        await studentSubmitsQuizAnswer(learner, bookQuestionNames[i]);
    }
    const incorrectQuizzes: string[] = [];

    // Do the remaining quizzes incorrectly
    for (let i = totalQuiz - incorrectQuizzesCount; i < totalQuiz; i++) {
        await studentDoesQuizQuestion(learner, QuizType.QUIZ_TYPE_FIB, bookQuestionNames[i]);
        await studentSubmitsQuizAnswer(learner, bookQuestionNames[i]);
        incorrectQuizzes.push(bookQuestionNames[i]);
    }

    await scenario.set(aliasQuizQuestionNames, incorrectQuizzes);

    const totalAttempts = scenario.get<number>(aliasTotalAttempts) ?? 0;
    const quizByAttempt: number[] = scenario.get<number[]>(aliasQuizByAttempt) ?? [];
    if (totalAttempts == 0) {
        quizByAttempt.push(totalQuiz);
    }
    const newTotalAttempts = totalAttempts + 1;
    await scenario.set(aliasTotalAttempts, newTotalAttempts);

    quizByAttempt.push(incorrectQuizzesCount);
    await scenario.set(aliasQuizByAttempt, quizByAttempt);
}

export async function studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    incorrectQuizzesCount: number,
    isRetryIncorrect: boolean,
    isResume: boolean
): Promise<void> {
    const bookQuestionNames = scenario.get<string[]>(aliasQuizQuestionNames);
    const originalBookQuestionNames = scenario.get<string[]>(aliasOriginalQuizQuestionNames);
    const remainingQuiz = scenario.get<number>(aliasRemainingQuizCount) ?? 0;
    let totalQuiz = 1;
    if (isRetryIncorrect) {
        totalQuiz = bookQuestionNames.length;
    } else if (isResume) {
        totalQuiz = remainingQuiz;
    } else {
        totalQuiz = originalBookQuestionNames.length;
    }

    const randomNumber = randomInteger(0, totalQuiz - incorrectQuizzesCount);
    const incorrectQuizzes: string[] = [];

    //ex: there are 4 out of 10 quizzes are incorrect. Do the last 3 quiz incorrectly (8-9-10th) and the other quiz that is one of [1,6].

    //correctly, 1 is random incorrect
    for (let i = 0; i < totalQuiz - incorrectQuizzesCount + 1; i++) {
        if (i == randomNumber) {
            await studentDoesQuizQuestion(learner, QuizType.QUIZ_TYPE_FIB, bookQuestionNames[i]);
            await studentSubmitsQuizAnswer(learner, bookQuestionNames[i]);
            incorrectQuizzes.push(bookQuestionNames[i]);
        } else {
            await studentSeesAndDoesFIBQuestionCorrectly(learner, bookQuestionNames[i]);
            await studentSubmitsQuizAnswer(learner, bookQuestionNames[i]);
        }
    }

    //incorrectly
    for (let i = totalQuiz - incorrectQuizzesCount + 1; i < totalQuiz; i++) {
        await studentDoesQuizQuestion(learner, QuizType.QUIZ_TYPE_FIB, bookQuestionNames[i]);
        await studentSubmitsQuizAnswer(learner, bookQuestionNames[i]);
        incorrectQuizzes.push(bookQuestionNames[i]);
    }

    await scenario.set(aliasQuizQuestionNames, incorrectQuizzes);

    const totalAttempts = scenario.get<number>(aliasTotalAttempts) ?? 0;
    const quizByAttempt: number[] = scenario.get<number[]>(aliasQuizByAttempt) ?? [];
    if (totalAttempts == 0) {
        quizByAttempt.push(totalQuiz);
    }
    const newTotalAttempts = totalAttempts + 1;
    await scenario.set(aliasTotalAttempts, newTotalAttempts);

    quizByAttempt.push(incorrectQuizzesCount);
    await scenario.set(aliasQuizByAttempt, quizByAttempt);
}

export async function studentDoesLOQuestionsInContentBook(
    learner: LearnerInterface,
    quizTypeTitle: QuizTypeTitle,
    quantity: number
): Promise<void> {
    for (let i = 0; i < quantity; i++) {
        const { quizTypeNumber } = getQuizTypeValue({ quizTypeTitle });
        const quizNumber = quizTypeNumber;
        await studentDoesQuizQuestion(learner, quizNumber!);
        await studentSubmitsQuizAnswer(learner);
    }
}

export async function studentDoesQuizQuestion(
    learner: LearnerInterface,
    quizTypeNumber: number,
    questionName?: string
): Promise<void> {
    switch (quizTypeNumber) {
        case QuizType.QUIZ_TYPE_MCQ: {
            await studentSeesAndDoesMCQQuestionCorrect(learner, questionName);
            break;
        }

        case QuizType.QUIZ_TYPE_FIB: {
            await studentSeesAndDoesFIBQuestion(learner, questionName);
            break;
        }

        case QuizType.QUIZ_TYPE_MAQ: {
            await studentSeesAndDoesMAQQuestion(learner, questionName);
            break;
        }

        case QuizType.QUIZ_TYPE_MIQ: {
            await studentSeesAndDoesMIQQuestion(learner, questionName);
            break;
        }
    }
}

export async function studentSeesAndDoesFIBQuestion(
    learner: LearnerInterface,
    questionName?: string
): Promise<void> {
    await learner.instruction(
        `student sees and does FIB question ${questionName ?? ''}`,
        async function () {
            const driver = learner.flutterDriver!;

            const currentFillTheBlankAnswer = 1;

            const fibAnswerInputKey = new ByValueKey(
                SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(currentFillTheBlankAnswer)
            );
            await driver.tap(fibAnswerInputKey);
            await driver.enterText(currentFillTheBlankAnswer.toString());
        }
    );
}

export const studentFillFlashcardQuestion = async (learner: LearnerInterface, answer: string) => {
    const driver = learner.flutterDriver!;

    const fibAnswerInputKey = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(1)
    );
    await driver.tap(fibAnswerInputKey);

    await learnerLeaveHandwritingMode(learner);

    await driver.enterText(answer);
};

export async function studentSeesAndDoesFIBQuestionCorrectly(
    learner: LearnerInterface,
    questionName?: string,
    answerText?: string
): Promise<void> {
    await learner.instruction(
        `student sees and does FIB question ${questionName ?? ''}`,
        async function () {
            const driver = learner.flutterDriver!;

            const currentFillTheBlankAnswer = 1;

            const fibAnswerInputKey = new ByValueKey(
                SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(currentFillTheBlankAnswer)
            );
            await driver.tap(fibAnswerInputKey);
            await driver.enterText(answerText ?? `Answer ${currentFillTheBlankAnswer}`);
        }
    );
}

export async function studentSeesAndDoesMCQQuestion(
    learner: LearnerInterface,
    questionName?: string
): Promise<void> {
    await learner.instruction(
        `student sees and does MCQ question ${questionName ?? ''}`,
        async function () {
            const driver = learner.flutterDriver!;

            const quizzesKey = new ByValueKey(SyllabusLearnerKeys.quiz);
            await driver.waitFor(quizzesKey);

            let answersKey;
            for (let i = 0; i < 4; i++) {
                try {
                    answersKey = new ByValueKey(SyllabusLearnerKeys.answerIncorrect(i));
                    await driver.waitFor(answersKey, 2000);
                    await driver.tap(answersKey);
                    break;
                } catch (e) {
                    console.warn('Not found', e);
                }
            }
        }
    );
}

export async function studentSeesAndDoesMCQQuestionCorrect(
    learner: LearnerInterface,
    questionName?: string
): Promise<void> {
    await learner.instruction(
        `student sees and does MCQ question ${questionName ?? ''}`,
        async function () {
            const driver = learner.flutterDriver!;

            const quizzesKey = new ByValueKey(SyllabusLearnerKeys.quiz);
            await driver.waitFor(quizzesKey);
            const correctAnswerKey = new ByValueKey(SyllabusLearnerKeys.answer_correct);

            try {
                await driver.scrollUntilTap(quizzesKey, correctAnswerKey, 0.0, -500, 1000);
            } catch (error) {
                throw new Error(`Not found ${correctAnswerKey}`);
            }
        }
    );
}

export async function studentSeesAndDoesMIQQuestion(
    learner: LearnerInterface,
    questionName?: string
): Promise<void> {
    await learner.instruction(
        `student sees and does MIQ question ${questionName ?? ''}`,
        async function () {
            const driver = learner.flutterDriver!;

            const completeAndShowExplanationButtonKey = new ByValueKey(
                SyllabusLearnerKeys.completeAndShowExplanationButton
            );
            await driver.tap(completeAndShowExplanationButtonKey);

            const correctManualInputOptionKey = new ByValueKey(
                SyllabusLearnerKeys.correctManualInputOptionKey
            );
            await driver.tap(correctManualInputOptionKey);
        }
    );
}

export async function studentSeesAndDoesMAQQuestion(
    learner: LearnerInterface,
    questionName?: string
): Promise<void> {
    await learner.instruction(
        `student sees and does MAQ question ${questionName ?? ''}`,
        async function () {
            const driver = learner.flutterDriver!;

            const quizzesKey = new ByValueKey(SyllabusLearnerKeys.quiz);
            await driver.waitFor(quizzesKey);

            let answersKey;
            for (let i = 0; i < 4; i++) {
                try {
                    answersKey = new ByValueKey(SyllabusLearnerKeys.answerIncorrect(i));
                    await driver.waitFor(answersKey, 2000);
                    await driver.tap(answersKey);
                    break;
                } catch (e) {
                    console.warn('Not found', e);
                }
            }
        }
    );
}

export async function studentSeesAndDoesMAQQuestionCorrect(
    learner: LearnerInterface,
    questionName?: string
): Promise<void> {
    await learner.instruction(
        `student sees and does MAQ question ${questionName ?? ''}`,
        async function () {
            const driver = learner.flutterDriver!;

            const quizzesKey = new ByValueKey(SyllabusLearnerKeys.quiz);
            await driver.waitFor(quizzesKey);

            let answersKey;
            for (let i = 0; i < 4; i++) {
                try {
                    answersKey = new ByValueKey(SyllabusLearnerKeys.answerCorrect(i));
                    await driver.waitFor(answersKey, 2000);
                    await driver.tap(answersKey);
                } catch (e) {
                    console.warn('Not found', e);
                }
            }
        }
    );
}

export async function studentSubmitsQuizAnswer(
    learner: LearnerInterface,
    questionName?: string
): Promise<void> {
    await learner.instruction(
        `student submits ${questionName ?? ''} answer and see the question explanation`,
        async function () {
            const driver = learner.flutterDriver!;

            await waitForLoadingAbsent(driver);

            const submitButtonKey = new ByValueKey(SyllabusLearnerKeys.submit_button);
            await driver.tap(submitButtonKey);

            await waitForLoadingAbsent(driver);

            const nextButtonKey = new ByValueKey(SyllabusLearnerKeys.next_button);
            await driver.tap(nextButtonKey);
        }
    );
}

export async function teacherGoesToStudyPlanItemDetails(
    teacher: TeacherInterface,
    studyPlanItemName: string
) {
    const driver = teacher.flutterDriver!;
    const loListScreenKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);
    const itemKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName));
    try {
        await driver.waitFor(loListScreenKey, 20000);
        try {
            await driver.scrollUntilTap(loListScreenKey, itemKey, 0.0, -20, 20000);
        } catch (error) {
            throw Error(`Expect study plan item ${studyPlanItemName} is displayed`);
        }
    } catch (e) {
        await driver.tap(itemKey, 20000);
    }
}

export async function teacherSeesLOQuestions(
    teacher: TeacherInterface,
    scenario: ScenarioContext,
    quizTypeTitle: QuizTypeTitle
): Promise<void> {
    const bookQuestionNames = scenario.get<string[]>(aliasQuizQuestionNames);
    const newQuestionName = scenario.get<string>(aliasQuizQuestionName);

    for (let i = 0; i < bookQuestionNames.length; i++) {
        const questionName = bookQuestionNames[i];
        let quizTitle;
        if (questionName !== newQuestionName) {
            const quizTypeNumber = getQuizTypeNumberFromModel(scenario, questionName);
            const { quizTypeTitle } = getQuizTypeValue({ quizTypeNumber });
            quizTitle = quizTypeTitle;
        } else {
            quizTitle = quizTypeTitle;
        }

        await teacherSeesQuizQuestion(teacher, questionName, quizTitle);

        if (i < bookQuestionNames.length - 1) {
            await teacherGoesToSeeNextQuizQuestion(teacher);
        }
    }
}

export async function teacherSeesQuizQuestion(
    teacher: TeacherInterface,
    questionName: string,
    quizTypeTitle: QuizTypeTitle
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const questionKey = new ByValueKey(
        SyllabusTeacherKeys.questionTypeTitle(quizTypeTitle, questionName)
    );

    await driver.waitFor(questionKey);
}

export async function teacherDoesNotSeeQuizQuestion(
    teacher: TeacherInterface,
    questionName: string,
    quizTypeTitle: QuizTypeTitle
): Promise<void> {
    await teacher.instruction(`teacher does not see question ${questionName}`, async function () {
        const driver = teacher.flutterDriver!;
        const questionKey = new ByValueKey(
            SyllabusTeacherKeys.questionTypeTitle(quizTypeTitle, questionName)
        );

        await driver.waitForAbsent(questionKey);
    });
}

export async function teacherGoesToSeeNextQuizQuestion(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const nextQuestionKey = new ByValueKey(SyllabusTeacherKeys.popupReviewQuestionNextButton);
    await driver.tap(nextQuestionKey);
}

export async function schoolAdminGoesToExamLOQuizDetailsPage(
    cms: CMSInterface,
    examLOName: string
): Promise<void> {
    const { page } = cms;
    const loRow = await page!.waitForSelector(loAndAssignmentByName(examLOName));

    await loRow.click();

    await cms.waitingForLoadingIcon();

    await cms.assertThePageTitle(examLOName);
    await cmsExamDetail.selectQuestionTab(page!);
    await schoolAdminWaitingQuizTableInTheLODetail(cms);
}
