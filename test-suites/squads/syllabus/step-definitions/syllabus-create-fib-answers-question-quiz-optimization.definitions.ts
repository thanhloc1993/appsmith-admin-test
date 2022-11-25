import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    quizAnswerAddAlternativeAnswer,
    quizAnswerFillInBlankAlternativeInputV2,
    quizAnswerFillInBlankInputV2,
    quizAnswerLabelPrefixInputV2,
    quizAnswerListItemNth,
    quizAnswerLabelTypeSelect,
    quizAnswerLabelTypeSelectInput,
    quizAnswerMadeIntoListCheckboxInput,
    quizAnswerFillInBlankEditorInputNthV2,
} from './cms-selectors/cms-keys';
import {
    QuizLabelTypeKeys,
    QuizLabelTypes,
} from './syllabus-question-create-multiple-choice.definitions';

export const schoolAdminSelectMadeIntoListQuestion = async (
    cms: CMSInterface,
    shouldMadeToList: boolean
) => {
    if (shouldMadeToList) {
        await cms.page?.check(quizAnswerMadeIntoListCheckboxInput);
        return;
    }

    await cms.page?.uncheck(quizAnswerMadeIntoListCheckboxInput);
};

export const schoolAdminSelectQuestionLabelType = async (
    cms: CMSInterface,
    value: QuizLabelTypeKeys
) => {
    await cms.page?.click(quizAnswerLabelTypeSelect);

    await cms.chooseOptionInAutoCompleteBoxByDataValue(QuizLabelTypes[value]);
};

export const schoolAdminCountFillInBlankInputAnswer = async (cms: CMSInterface) => {
    const elements = await cms.page?.$$(quizAnswerFillInBlankInputV2);
    return elements?.length || 0;
};

export const schoolAdminFillFIBAnswer = async (
    cms: CMSInterface,
    index: number,
    content: string
) => {
    await cms.page?.fill(quizAnswerFillInBlankEditorInputNthV2(index), content);
};

export const schoolAdminFillAnswerPrefixLabel = async (
    cms: CMSInterface,
    index: number,
    content: string
) => {
    const inputElements = await cms.page!.$$(quizAnswerLabelPrefixInputV2);

    await inputElements[index].fill(content);
};

export const schoolAdminAddMoreAlternativeFIBAnswer = async (
    cms: CMSInterface,
    index: number,
    totalClick: number
) => {
    const list = createNumberArrayWithLength(totalClick);

    await asyncForEach<number, void>(list, async () => {
        await cms.selectElementByDataTestId(quizAnswerAddAlternativeAnswer(index));
    });
};

export const schoolAdminGetWrapperOfFIBAnswer = async (cms: CMSInterface, answerIndex: number) => {
    return cms.page!.waitForSelector(quizAnswerListItemNth(answerIndex));
};

export const schoolAdminFillFIBAlternativeAnswer = async (
    cms: CMSInterface,
    answerIndex: number,
    index: number,
    content: string
) => {
    const wrapperElement = await schoolAdminGetWrapperOfFIBAnswer(cms, answerIndex);

    const inputElements = await wrapperElement.$$(quizAnswerFillInBlankAlternativeInputV2);

    await inputElements[index].fill(content);
};

export const schoolAdminCheckFIBQuestionMadeIntoListStatus = async (
    cms: CMSInterface,
    shouldMadeToList: boolean
) => {
    const isChecked = await cms.page?.isChecked(quizAnswerMadeIntoListCheckboxInput);

    weExpect(isChecked, `Made into list should equal: ${shouldMadeToList}`).toEqual(
        shouldMadeToList
    );
};

export const schoolAdminCannotSeeAnyPrefixLabel = async (cms: CMSInterface) => {
    await cms!.page?.waitForSelector(quizAnswerLabelPrefixInputV2, {
        state: 'detached',
    });
};

export const schoolAdminSeeQuestionLabelType = async (
    cms: CMSInterface,
    labelType: QuizLabelTypeKeys
) => {
    const element = await cms.page!.waitForSelector(quizAnswerLabelTypeSelectInput);

    const value = await element.inputValue();

    weExpect(value, `Value of select label type should equal ${labelType} `).toEqual(labelType);
};

export const schoolAdminSeeQuestionPrefixLabel = async (
    cms: CMSInterface,
    index: number,
    labelValue: string
) => {
    const inputElements = await cms.page!.$$(quizAnswerLabelPrefixInputV2);

    const inputValue = await inputElements[index].inputValue();

    weExpect(labelValue, `Should equal with label at index [${index}]`).toEqual(inputValue);
};
