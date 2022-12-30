import { DTValue } from '../types/data-table';
import { LMTypeShortMappedKey } from './learning-material';
import { QuizDifficultyLevels } from './quiz';
import { QuizOption } from 'manabuf/common/v1/contents_pb';

export enum QuestionTypeShortMappedKey {
    mcq = 'QUIZ_TYPE_MCQ',
    fib = 'QUIZ_TYPE_FIB',
    pow = 'QUIZ_TYPE_POW',
    tad = 'QUIZ_TYPE_TAD',
    miq = 'QUIZ_TYPE_MIQ',
    maq = 'QUIZ_TYPE_MAQ',
}
export const QuestionTypeShortByLMTypeShort: Record<
    keyof typeof LMTypeShortMappedKey,
    Array<keyof typeof QuestionTypeShortMappedKey>
> = {
    lo: ['mcq', 'fib', 'maq', 'miq'],
    exam_lo: ['mcq', 'fib', 'maq'],
    fc: ['tad', 'pow'],
    asgmt: [],
    task_asgmt: [],
};

export interface DTQuestionDescription {
    type: keyof typeof QuestionTypeShortMappedKey;
    point?: number | DTValue;
    difficultLevel?: QuizDifficultyLevels | DTValue;
    numOfTags?: boolean | DTValue;
}

export interface QuestionAnswerBase extends QuizOption.AsObject {}
