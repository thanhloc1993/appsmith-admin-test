import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    quizAnswerMultipleAnswerDeleteNth,
    quizAnswerMultipleAnswerEditorInput,
    quizAnswerMultipleAnswerEditorInputNth,
    quizAnswerMultipleAnswerCorrectNth,
    quizPreviewAnswerContent,
} from './cms-selectors/cms-keys';

export const schoolAdminCountAnswerInputOfMultipleAnswerQuestion = async (cms: CMSInterface) => {
    const elements = await cms.page?.$$(quizAnswerMultipleAnswerEditorInput);
    return elements?.length || 0;
};

export const schoolAdminDeleteAnswersOfMultipleAnswerQuestion = async (
    cms: CMSInterface,
    indexes: number[]
) => {
    await asyncForEach(indexes, async (indexValue) => {
        await cms.page?.click(quizAnswerMultipleAnswerDeleteNth(indexValue));
    });
};

export const schoolAdminFillAnswerOfMultipleAnswerQuestion = async (
    cms: CMSInterface,
    index: number,
    content: string
) => {
    await cms.page?.fill(`${quizAnswerMultipleAnswerEditorInputNth(index)}`, content);
};

export const schoolAdminSelectCorrectAnswerOfMultipleAnswerQuestion = async (
    cms: CMSInterface,
    index: number
) => {
    await cms.page?.locator(quizAnswerMultipleAnswerCorrectNth(index + 1)).check();
};

export const schoolAdminDeselectAllCorrectAnswerOfMultipleAnswerQuestion = async (
    cms: CMSInterface
) => {
    const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleAnswerQuestion(cms);

    await asyncForEach(createNumberArrayWithLength(totalAnswerInput), async (_, index) => {
        await cms.page?.locator(quizAnswerMultipleAnswerCorrectNth(index + 1)).uncheck();
    });
};

export const schoolAdminGetAllAnswerInPreviewMultipleAnswerQuestion = async (cms: CMSInterface) => {
    return await cms.page!.$$(quizPreviewAnswerContent);
};
