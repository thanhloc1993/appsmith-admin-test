import { CMSInterface } from '@supports/app-types';

import {
    quizAnswerMultipleAnswerRoot,
    quizEditorHelperText,
    quizPreviewAnswers,
} from './cms-selectors/cms-keys';

export const schoolAdminSeeAnswerOfMultipleQuestionCorrectInPreview = async (
    cms: CMSInterface,
    answerContent: string,
    isCorrect = false
) => {
    const answerPreviewElement = await cms.waitForSelectorHasText(
        `${quizPreviewAnswers} > div`,
        answerContent
    );

    let isExistedCorrectElement = true;

    try {
        // TODO: add data-testid for correct answer
        await answerPreviewElement!.waitForSelector(':has-text("CORRECT")');
    } catch {
        isExistedCorrectElement = false;
    }

    weExpect(
        isExistedCorrectElement,
        `Answer: ${answerContent} should correct ${isCorrect}`
    ).toEqual(isCorrect);
};

export const schoolAdminSeesAnswerErrOfMultipleAnswerQuestion = async (
    cms: CMSInterface,
    answerIndex: number
) => {
    const answerElements = await cms.page!.$$(quizAnswerMultipleAnswerRoot);

    const element = await answerElements[answerIndex].waitForSelector(quizEditorHelperText);
    await element.scrollIntoViewIfNeeded();
};
