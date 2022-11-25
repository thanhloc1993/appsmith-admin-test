import { getTestId } from './cms-keys';

// CHAPTER
export const chapterFormRoot = getTestId('ChapterForm__root');

export const chapterFormSubmit = getTestId('ChapterForm__submit');

export const datePickerInput = getTestId('DatePickerHF__input');

export const timePickerHF = getTestId('TimePickerAutocompleteHF__autocomplete');
export const timePickerInput = `${timePickerHF} input`;

// QUESTION
export const quizTableRoot = getTestId('QuizTable__table');

export const questionListItemRoot = getTestId('SingleQuestionBox__root');

export const questionGroupListRoot = getTestId('QuestionGroupList__root');

export const questionGroupListHeader = getTestId('QuestionListSectionHeader__root');

export const questionGroupListLoading = getTestId('QuestionGroupList__loading');

export const questionGroupListItem = getTestId('QuestionGroupList__item');

export const questionSingleDescription = getTestId('SingleQuestionBox__description');

export const answerFIBRoot = getTestId('AnswerFillInBlank__root');

export const answerFIBHandwritingSetting = getTestId('AnswerFillInBlank__handwritingSetting');

export const answerFIBHandwritingSettingInput = `${answerFIBHandwritingSetting} input`;

export const getAnswerFIBHandwritingSettingInputNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSettingInput}`;

export const answerFIBHandwritingSettingText = `${answerFIBHandwritingSetting} [role="button"]`;

export const getAnswerFIBHandwritingSettingTextNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSettingText}`;

export const getAnswerFIBHandwritingSettingNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSetting}`;

export const answerFIBLabelPrefixInput = `${getTestId('ListLabel__prefix')} input`;

export const getAnswerFIBLabelPrefixInputNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBLabelPrefixInput}`;

export const questionListItemByText = (text: string) =>
    `${questionListItemRoot}:has-text("${text}")`;
