import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    quizAnswerAddMoreBtnV2,
    quizAnswerMultipleChoiceCorrect,
    quizAnswerMultipleChoiceDeleteNth,
    quizAnswerMultipleChoiceEditorInput,
    quizAnswerMultipleChoiceEditorInputNth,
    quizPreviewAnswers,
} from './cms-selectors/cms-keys';
import { QuizAttribute } from './syllabus-question-utils';

export enum QuizLabelTypes {
    NUMBER = 'NUMBER',
    CUSTOM = 'CUSTOM',
    TEXT = 'TEXT',
    TEXT_UPPERCASE = 'TEXT_UPPERCASE',
}

export type QuizLabelTypeKeys = keyof typeof QuizLabelTypes;

export interface QuizAnswer {
    content: string;
    correct: boolean;
    label?: string;
    attribute?: QuizAttribute;
}

export interface QuizForm {
    question: {
        content: string;
    };
    answers: QuizAnswer[];
    explanation: {
        content: string;
    };
}

export const schoolAdminCountAnswerInputOfMultipleChoiceQuestion = async (cms: CMSInterface) => {
    const elements = await cms.page?.$$(quizAnswerMultipleChoiceEditorInput);
    return elements?.length || 0;
};

export const schoolAdminFillAnswerOfMultipleChoiceQuestion = async (
    cms: CMSInterface,
    index: number,
    content: string
) => {
    await cms.page?.fill(`${quizAnswerMultipleChoiceEditorInputNth(index)}`, content);
};

export const schoolAdminDeleteAnswersOfMultipleChoiceQuestion = async (
    cms: CMSInterface,
    listIndex: number[]
) => {
    await asyncForEach(listIndex, async (indexValue) => {
        await cms.page?.click(quizAnswerMultipleChoiceDeleteNth(indexValue));
    });
};

export const schoolAdminClickAddMoreAnswerInQuestion = async (
    cms: CMSInterface,
    totalClick: number
) => {
    const list = createNumberArrayWithLength(totalClick);

    await asyncForEach<number, void>(list, async () => {
        await cms.selectElementByDataTestId(quizAnswerAddMoreBtnV2);
    });
};

export const schoolAdminSelectCorrectAnswerOfMultipleChoiceQuestion = async (
    cms: CMSInterface,
    index: number
) => {
    await cms.page?.locator(quizAnswerMultipleChoiceCorrect(index + 1)).click();
};

export const schoolAdminCheckCorrectAnswerInPreviewMultipleChoiceQuestion = async (
    cms: CMSInterface,
    answerContent: string
) => {
    const correct = await cms.page?.$$(`${quizPreviewAnswers}:has-text("Correct")`);

    weExpect(correct, 'should have only an answer is correctly').toHaveLength(1);

    await correct![0].waitForSelector(`:above(:has-text("${answerContent}"))`);
};
