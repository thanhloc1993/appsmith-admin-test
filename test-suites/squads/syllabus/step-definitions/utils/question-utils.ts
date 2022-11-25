import { getRandomElement } from '@legacy-step-definitions/utils';

import { KeyQuizType } from '@supports/services/yasuo-course/const';

import { InputRange, QuizEditInfoTitle, QuizTypeTitle } from '../types/cms-types';
import { randomInteger } from './common';

/**
 * @description Check if question has answer config
 */
export const hasAnswerConfig = (quizTypeTitle: QuizTypeTitle) => {
    const quizTypesHasAnswerConfig: QuizTypeTitle[] = ['fill in the blank', 'multiple answer'];
    return quizTypesHasAnswerConfig.includes(quizTypeTitle);
};

/**
 *
 * @description Check if user can edit question {info}
 */
export const canEditQuizInfo = (quizTypeTitle: QuizTypeTitle, info: QuizEditInfoTitle) => {
    if (info === 'type') return true;

    if (quizTypeTitle === 'manual input' && !['description', 'explanation'].includes(info))
        return false;

    switch (info) {
        case 'answer config':
            if (hasAnswerConfig(quizTypeTitle)) return true;
            return false;
        case 'number of answers':
            // TODO: return true by default. This is just to bypass in case that mobile hasn't handle multiple answers in FIB
            if (quizTypeTitle === 'fill in the blank') return false;
            return true;
        default:
            return true;
    }
};

/**
 *
 * @description Get randomly the valid points per question from 1 to 999
 */
export const getValidPointsPerQuestion = ({
    min = InputRange.NUM_1,
    max = InputRange.NUM_999,
}: Partial<{
    min: number;
    max: number;
}> = {}) => {
    if (min < InputRange.NUM_1 || max > InputRange.NUM_999 || min > max) {
        throw new Error(
            `Points per question must be from ${InputRange.NUM_1} to ${InputRange.NUM_999}`
        );
    }

    return randomInteger(min, max);
};
export const getRandomQuestionTypeForLO = () => {
    // Consider create getAllQuestionStringTypesForLO
    const allQuestionTypes: (keyof typeof KeyQuizType)[] = [
        'QUIZ_TYPE_FIB',
        'QUIZ_TYPE_MCQ',
        'QUIZ_TYPE_MCQ',
        'QUIZ_TYPE_MIQ',
    ];
    return getRandomElement(allQuestionTypes);
};

export const joinCommaDelimiter = (tags: string[]) => tags.join(', ');
