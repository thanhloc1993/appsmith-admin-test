import { Quiz } from '@services/common/quiz';

import { QuizAttribute } from '../syllabus-question-utils';
import { QuizTypeTitle } from '../types/cms-types';
import { QuestionAnswerBase } from './question';
import { LearningMaterialType } from 'manabuf/syllabus/v1/enums_pb';

export enum QuizDifficultyLevels {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export interface QuizDescription {
    content: string;
    type: QuizTypeTitle;
    point: number;
    difficultyLevel: QuizDifficultyLevels;
    taggedLOs: string[];
    questionTags?: string[];
    explanation?: string;
}

export interface QuizAnswer {
    content: string;
    correct: boolean;
    label?: string;
    attribute?: QuizAttribute;
}

export interface QuizExplanation {
    content: string;
}

export interface QuizDetail<D = QuizDescription, A = Array<QuizAnswer>, E = QuizExplanation> {
    description: D;
    answers: A;
    explanation: E;
}

export interface QuizResult {
    totalScore: { totalGradedPoint: number; totalQuestionPoint: number };
    questionSubmissionList: Array<
        Partial<Pick<QuizDescription, 'content' | 'type'>> & {
            gradedPoint: number;
            questionPoint: number;
        }
    >;
}

export interface CreateDataQuizAnswerListOptions {
    answerList: Array<Partial<QuestionAnswerBase>>;
}

export interface CreateDataQuestionListOptions {
    questionList: Array<
        Partial<
            Pick<
                Quiz,
                | 'externalId'
                | 'kind'
                | 'point'
                | 'difficultyLevel'
                | 'question'
                | 'optionsList'
                | 'explanation'
            >
        >
    >;
    lmType:
        | LearningMaterialType.LEARNING_MATERIAL_LEARNING_OBJECTIVE
        | LearningMaterialType.LEARNING_MATERIAL_EXAM_LO;
}
