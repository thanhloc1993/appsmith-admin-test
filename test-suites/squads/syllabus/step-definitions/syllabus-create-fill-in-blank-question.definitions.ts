import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    quizAnswerFillInBlankAddAlternativeForAnswer,
    quizAnswerFillInBlankAlternativeInput,
    quizAnswerFillInBlankDeleteNth,
    quizAnswerFillInBlankEditorInputNthV3,
    quizAnswerFillInBlankInputV3,
    quizAnswerFillInBlankRootNth,
    quizAnswerFillInBlankToggleMadeToList,
    quizAnswerLabelPrefixInput,
    quizAnswerSelectLabelType,
    quizPreviewEditBtn,
} from './cms-selectors/cms-keys';
import { getAnswerFIBLabelPrefixInputNthV2 } from './cms-selectors/syllabus';
import {
    QuizLabelTypeKeys,
    QuizLabelTypes,
} from './syllabus-question-create-multiple-choice.definitions';

export const schoolAdminFillAnswerOfFillInBlank = async (
    cms: CMSInterface,
    index: number,
    content: string
) => {
    await cms.page?.fill(quizAnswerFillInBlankEditorInputNthV3(index), content);
};

export const schoolAdminDeleteAnswerOfFillInBlank = async (cms: CMSInterface, index: number) => {
    await cms.page?.click(quizAnswerFillInBlankDeleteNth(index));
};

export const schoolSelectLabelTypeForQuestion = async (
    cms: CMSInterface,
    value: QuizLabelTypeKeys
) => {
    await cms.page?.click(quizAnswerSelectLabelType);

    await cms.chooseOptionInAutoCompleteBoxByDataValue(QuizLabelTypes[value]);
};

export const schoolAdminCountAnswerInputOfFillInBlankQuestion = async (cms: CMSInterface) => {
    const elements = await cms.page?.$$(quizAnswerFillInBlankInputV3);
    return elements?.length || 0;
};

export const schoolAdminClickAddMoreAlternativeFillInBlankQuestion = async (
    cms: CMSInterface,
    index: number,
    totalClick: number
) => {
    const list = createNumberArrayWithLength(totalClick);

    await asyncForEach<number, void>(list, async () => {
        await cms.selectElementByDataTestId(quizAnswerFillInBlankAddAlternativeForAnswer(index));
    });
};

export const schoolAdminGetAnswerWrapperOfFillInBlank = async (
    cms: CMSInterface,
    answerIndex: number
) => {
    return cms.page!.waitForSelector(quizAnswerFillInBlankRootNth(answerIndex));
};

export const schoolAdminFillAlternativeOfAnswerFillInBlank = async (
    cms: CMSInterface,
    answerIndex: number,
    index: number,
    content: string
) => {
    const wrapperElement = await schoolAdminGetAnswerWrapperOfFillInBlank(cms, answerIndex);

    const inputElements = await wrapperElement.$$(quizAnswerFillInBlankAlternativeInput);

    await inputElements[index].fill(content);
};

export const schoolAdminSelectEditInPreviewQuestion = async (cms: CMSInterface) => {
    await cms.selectElementByDataTestId(quizPreviewEditBtn);
};

export const schoolAdminSelectMadeAnswerToListFillInBlankQuestion = async (
    cms: CMSInterface,
    shouldMadeToList: boolean
) => {
    if (shouldMadeToList) {
        await cms.page?.check(quizAnswerFillInBlankToggleMadeToList);
        return;
    }

    await cms.page?.uncheck(quizAnswerFillInBlankToggleMadeToList);
};

export const schoolAdminSeeLabelTypeForQuestion = async (
    cms: CMSInterface,
    labelType: QuizLabelTypeKeys
) => {
    const element = await cms.page!.waitForSelector(`${quizAnswerSelectLabelType} input`);

    const value = await element.inputValue();

    weExpect(value, `Value of select label type should equal ${labelType} `).toEqual(labelType);
};

export const schoolAdminCheckMadeAnswerToListFillInBlankQuestion = async (
    cms: CMSInterface,
    shouldMadeToList: boolean
) => {
    const isChecked = await cms.page?.isChecked(quizAnswerFillInBlankToggleMadeToList);

    weExpect(isChecked, `MadeAnswerToList should equal: ${shouldMadeToList}`).toEqual(
        shouldMadeToList
    );
};

export const schoolAdminFillAnswerLabelPrefixOfQuestion = async (
    cms: CMSInterface,
    index: number,
    content: string
) => {
    const inputElements = await cms.page!.$$(quizAnswerLabelPrefixInput);

    await inputElements[index].fill(content);
};

export const schoolAdminNotSeeAnyAnswerPrefixLabelOfQuestion = async (cms: CMSInterface) => {
    await cms!.page?.waitForSelector(quizAnswerLabelPrefixInput, {
        state: 'detached',
    });
};

export const schoolAdminSeeAnswerPrefixLabelOfQuestion = async (
    cms: CMSInterface,
    index: number,
    labelValue: string
) => {
    const inputElements = await cms.page!.$$(quizAnswerLabelPrefixInput);

    const inputValue = await inputElements[index].inputValue();

    weExpect(labelValue, `Should equal with label at index [${index}]`).toEqual(inputValue);
};

export const schoolAdminGetAnswerFIBLabelPrefixInputValue = async (
    cms: CMSInterface,
    answerNumber: number
) => {
    const cmsPage = cms.page!;
    const answerLabelPrefixInput = await cmsPage.waitForSelector(
        getAnswerFIBLabelPrefixInputNthV2(answerNumber)
    );

    return await answerLabelPrefixInput.inputValue();
};
