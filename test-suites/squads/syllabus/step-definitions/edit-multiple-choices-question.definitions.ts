import { CMSInterface } from '@supports/app-types';

import { quizAnswerMultipleChoiceRoot, quizEditorHelperText } from './cms-selectors/cms-keys';

export const schoolAdminSeesAnswerErrOfMultipleChoiceQuestion = async (
    cms: CMSInterface,
    answerIndex: number
) => {
    const answerElements = await cms.page!.$$(quizAnswerMultipleChoiceRoot);

    const element = await answerElements[answerIndex].waitForSelector(quizEditorHelperText);
    await element.scrollIntoViewIfNeeded();
};
