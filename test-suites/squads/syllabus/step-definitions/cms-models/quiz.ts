import { QuizTypeTitle } from '../types/cms-types';

export enum QuizDifficultyLevels {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export interface QuizDescription {
    content: string;
    point: number;
    type: QuizTypeTitle;
    difficultyLevel: QuizDifficultyLevels;
    taggedLOs: string[];
    questionTags?: string[];
    explanation?: string;
}
