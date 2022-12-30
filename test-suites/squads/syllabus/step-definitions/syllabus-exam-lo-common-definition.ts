import { randomBoolean } from '@legacy-step-definitions/utils';
import { asyncForEach } from '@syllabus-utils/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { LearnerInterface } from '@supports/app-types';

import { QuizDetail, QuizResult } from './cms-models/quiz';
import { studentChoosesNextQuestionButton } from './syllabus-do-exam-lo-definitions';
import {
    studentDoesQuestionCorrect,
    studentDoesQuestionIncorrect,
} from './syllabus-question-utils';
import { getQuizTypeValue } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export const syllabusExamLOInstruction = 'Syllabus_ExamLO_ExamLOInstruction';

export async function studentStartExamLOFromInstructionScreen(
    learner: LearnerInterface
): Promise<void> {
    const isEnableExamLOInstruction = await featureFlagsHelper.isEnabled(syllabusExamLOInstruction);

    if (isEnableExamLOInstruction) {
        const driver = learner.flutterDriver!;

        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.examLOInstructionScreen));
        await driver.tap(new ByValueKey(SyllabusLearnerKeys.startExamLOButton));
    }
}

export async function studentDoesExamLOWithRandomQuizResult(
    learner: LearnerInterface,
    quizDetailList: QuizDetail[]
): Promise<QuizResult> {
    let totalGradedPoint = 0;
    let totalQuestionPoint = 0;
    let questionSubmissionList: QuizResult['questionSubmissionList'] = [];

    await asyncForEach(
        quizDetailList,
        async ({ description: { type, content, point } }, quizDetailIndex) => {
            const quizNumber = quizDetailIndex + 1;
            const isCorrect = randomBoolean();
            const { quizTypeNumber } = getQuizTypeValue({ quizTypeTitle: type });
            totalQuestionPoint = totalQuestionPoint + point;

            if (isCorrect) {
                await studentDoesQuestionCorrect(learner, {
                    name: content,
                    type: quizTypeNumber,
                });

                totalGradedPoint = totalGradedPoint + point;
                questionSubmissionList = [
                    ...questionSubmissionList,
                    { content, type, gradedPoint: point, questionPoint: point },
                ];
            } else {
                await studentDoesQuestionIncorrect(learner, {
                    name: content,
                    type: quizTypeNumber,
                });

                questionSubmissionList = [
                    ...questionSubmissionList,
                    { content, type, gradedPoint: 0, questionPoint: point },
                ];
            }

            if (quizNumber === quizDetailList.length) {
                return;
            }

            await studentChoosesNextQuestionButton(learner);
        }
    );

    return {
        totalScore: { totalGradedPoint, totalQuestionPoint },
        questionSubmissionList,
    };
}
