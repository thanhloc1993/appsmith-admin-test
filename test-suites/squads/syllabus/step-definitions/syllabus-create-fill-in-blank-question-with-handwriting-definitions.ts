import { CMSInterface } from '@supports/app-types';

import { saveDialogButton } from './cms-selectors/cms-keys';
import {
    getAnswerFIBHandwritingSettingNthV2,
    getAnswerFIBHandwritingSettingTextNthV2,
    quizFibHandwritingChangeConfirmDialog,
} from './cms-selectors/syllabus';
import { HandwritingOption } from './syllabus-question-utils';

export const schoolAdminChooseHandwritingAnswerInFIB = async (
    cms: CMSInterface,
    answerNumber: number,
    handwritingOptionKey: HandwritingOption['key']
) => {
    const cmsPage = cms.page!;

    await cmsPage.click(getAnswerFIBHandwritingSettingNthV2(answerNumber));

    await cms.selectElementByDataValue(handwritingOptionKey.toString());

    await cms.page!.waitForTimeout(500);

    const confirmDialog = await cms.page!.$(quizFibHandwritingChangeConfirmDialog);
    if (confirmDialog) {
        await cms.selectElementWithinWrapper(
            quizFibHandwritingChangeConfirmDialog,
            saveDialogButton
        );
    }
};

export const schoolAdminSeeMatchedHandwritingAnswerInFIB = async (
    cms: CMSInterface,
    answerNumber: number,
    selectedHandwritingOption: HandwritingOption['value']
) => {
    const cmsPage = cms.page!;
    const handwritingSettingTextElement = await cmsPage.waitForSelector(
        getAnswerFIBHandwritingSettingTextNthV2(answerNumber)
    );

    const handwritingSettingValue = await handwritingSettingTextElement.textContent();

    weExpect(
        handwritingSettingValue,
        `Handwriting setting value should be ${selectedHandwritingOption}`
    ).toEqual(selectedHandwritingOption);
};
