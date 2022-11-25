import { asyncForEach } from '@syllabus-utils/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface, LOType, TeacherInterface } from '@supports/app-types';

import { QuestionGroupDetail } from './cms-models/question-group';
import {
    studentDoesQuizQuestion,
    teacherGoesToSeeNextQuizQuestion,
} from './syllabus-create-question-definitions';
import { ByValueKey } from 'flutter-driver-x/dist/common/find';

export function getTotalQuestionsFromQuestionGroupDetails(
    questionGroupDetails: QuestionGroupDetail[]
) {
    let totalQuestions = 0;
    for (const questionGroupDetail of questionGroupDetails) {
        totalQuestions += (questionGroupDetail.questionNames as string[]).length;
    }

    return totalQuestions;
}

export async function showQuizProgressBarButton(learner: LearnerInterface, loType: LOType) {
    const driver = learner.flutterDriver!;

    if (loType === 'learning objective') {
        await driver.tap(new ByValueKey(SyllabusLearnerKeys.showQuizProgressBarButton), 10000);
    }
}

export async function learnerVerifyQuestionGroups(
    learner: LearnerInterface,
    loType: LOType,
    questionGroupDetail: QuestionGroupDetail,
    currentQuestionIndex: number,
    totalQuestions: number
) {
    const driver = learner.flutterDriver!;
    if (questionGroupDetail.questionNames === undefined) return;

    const questionGroupName = questionGroupDetail.questionGroupName;
    const questionNames = questionGroupDetail.questionNames as string[];
    const questionTypeNumbers = questionGroupDetail.questionTypeNumbers as number[];
    let questionIndex = currentQuestionIndex;

    // Verify question group progress item
    if (questionNames.length !== 0) {
        const questionIndexes = getQuestionIndexesString(questionNames.length, questionIndex);
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.questionGroupProgressItem(questionIndexes))
        );
    }

    for (let i = 0; i < questionNames.length; i++) {
        // Verify question progress item
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(questionIndex + 1))
        );
        // Verify question group title for each question
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.questionGroupTitle(questionIndex, questionGroupName))
        );

        await studentDoesQuizQuestion(learner, questionTypeNumbers[i], questionNames[i]);

        await learnerGoToNextQuestion(learner, loType, totalQuestions, questionIndex);
        questionIndex++;
    }
}

export async function learnerVerifyIndividualQuestion(
    learner: LearnerInterface,
    loType: LOType,
    questionGroupDetail: QuestionGroupDetail,
    currentQuestionIndex: number,
    totalQuestions: number
) {
    const driver = learner.flutterDriver!;
    let questionIndex = currentQuestionIndex;

    // Verify question progress item
    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(questionIndex + 1)));

    await studentDoesQuizQuestion(
        learner,
        (questionGroupDetail.questionTypeNumbers as number[])[0],
        (questionGroupDetail.questionNames as string[])[0]
    );

    await learnerGoToNextQuestion(learner, loType, totalQuestions, questionIndex);
    questionIndex++;
}

async function learnerGoToNextQuestion(
    learner: LearnerInterface,
    loType: LOType,
    totalQuestions: number,
    index: number
) {
    if (index < totalQuestions - 1) {
        await learner.flutterDriver!.tap(
            new ByValueKey(
                loType == 'exam LO'
                    ? SyllabusLearnerKeys.next_button
                    : SyllabusLearnerKeys.submit_button
            )
        );

        if (loType === 'learning objective') {
            await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
        }
    }
}

function getQuestionIndexesString(length: number, startIndex: number): string {
    const questionIndexesArray = [];

    for (let i = startIndex; i < startIndex + length; i++) {
        questionIndexesArray.push(i);
    }

    return `[${questionIndexesArray.join(', ')}]`;
}

export async function studentAnswersAllQuestions(
    learner: LearnerInterface,
    questionGroupDetails: QuestionGroupDetail[]
): Promise<void> {
    const totalQuestions = getTotalQuestionsFromQuestionGroupDetails(questionGroupDetails);
    const loType = 'learning objective';
    let questionIndex = 0;
    await asyncForEach(questionGroupDetails, async (item) => {
        if (item.groupType === 'group') {
            await learnerVerifyQuestionGroups(learner, loType, item, questionIndex, totalQuestions);
            questionIndex += (item.questionNames as string[]).length;
        } else if (item.groupType === 'individual question') {
            await learnerVerifyIndividualQuestion(
                learner,
                loType,
                item,
                questionIndex,
                totalQuestions
            );
            questionIndex++;
        }
    });
}

export async function teacherVerifyQuestionGroups(
    teacher: TeacherInterface,
    questionGroupDetail: QuestionGroupDetail,
    currentQuestionIndex: number
) {
    const driver = teacher.flutterDriver!;
    if (questionGroupDetail.questionNames === undefined) return;

    const questionGroupName = questionGroupDetail.questionGroupName;
    const questionNames = questionGroupDetail.questionNames as string[];
    let questionIndex = currentQuestionIndex;

    // Verify question group progress item
    if (questionNames.length !== 0) {
        const questionIndexes = getQuestionIndexesString(questionNames.length, questionIndex);
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.questionGroupProgressItem(questionIndexes))
        );
    }

    for (let i = 0; i < questionNames.length; i++) {
        // Verify question progress item
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(questionIndex + 1))
        );
        // Verify question group title for each question
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.questionGroupTitle(questionIndex, questionGroupName))
        );

        await teacherGoesToSeeNextQuizQuestion(teacher);
        questionIndex++;
    }
}

export async function teacherVerifyIndividualQuestion(
    teacher: TeacherInterface,
    currentQuestionIndex: number
) {
    const driver = teacher.flutterDriver!;

    // Verify question progress item
    await driver.waitFor(
        new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(currentQuestionIndex + 1))
    );

    await teacherGoesToSeeNextQuizQuestion(teacher);
}
