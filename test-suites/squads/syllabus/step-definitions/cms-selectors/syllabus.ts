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

export const answerListItemRoot = getTestId('QuizAnswerList__item');

export const answerFIBRoot = getTestId('AnswerFillInBlank__root');

export const answerFIBRootV2 = getTestId('QuizFIBAnswerItem__root');

export const answerFIBHandwritingSetting = getTestId('AnswerFillInBlank__handwritingSetting');

export const answerFIBHandwritingSettingV2 = getTestId('QuizFIBAnswerItem__handwritingSetting');

export const answerFIBHandwritingSettingInput = `${answerFIBHandwritingSetting} input`;

export const answerFIBHandwritingSettingInputV2 = `${answerFIBHandwritingSettingV2} input`;

export const getAnswerFIBHandwritingSettingInputNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSettingInput}`;

export const getAnswerFIBHandwritingSettingInputNthV2 = (answerNumber: number) =>
    `${answerListItemRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSettingInputV2}`;

export const answerFIBHandwritingSettingText = `${answerFIBHandwritingSetting} [role="button"]`;

export const answerFIBHandwritingSettingTextV2 = `${answerFIBHandwritingSettingV2} [role="button"]`;

export const getAnswerFIBHandwritingSettingTextNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSettingText}`;

export const getAnswerFIBHandwritingSettingTextNthV2 = (answerNumber: number) =>
    `${answerListItemRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSettingTextV2}`;

export const getAnswerFIBHandwritingSettingNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSetting}`;

export const getAnswerFIBHandwritingSettingNthV2 = (answerNumber: number) =>
    `${answerListItemRoot}:nth-child(${answerNumber}) ${answerFIBHandwritingSettingV2}`;

export const answerFIBLabelPrefixInput = `${getTestId('ListLabel__prefix')} input`;

export const answerFIBLabelPrefixInputV2 = `${getTestId('QuizPrefixLabelHF__root')} input`;

export const getAnswerFIBLabelPrefixInputNth = (answerNumber: number) =>
    `${answerFIBRoot}:nth-child(${answerNumber}) ${answerFIBLabelPrefixInput}`;

export const quizPreviewDeleteBtn = getTestId('QuizPreview__deleteQuizButton');

export const singleQuestionPreviewBtn = getTestId('SingleQuestionBox__previewButton');

export const answerListRoot = getTestId('QuizFIBAnswer__answerList');

export const getAnswerFIBLabelPrefixInputNthV2 = (answerNumber: number) =>
    `${answerListItemRoot}:nth-child(${answerNumber}) ${answerFIBLabelPrefixInputV2}`;

export const autocompleteLoading = getTestId('AutocompleteLoading__root');

export const questionTagSelectBox = getTestId('QuizDescription__tag');

export const questionTagPreview = getTestId('QuizPreview__tag');

export const questionListHeaderAction = getTestId('QuestionListSectionHeader__action');

export const questionGroupNameInput = getTestId('QuestionGroupUpsertForm__name');

export const questionGroupDescriptionInput = getTestId('QuestionGroupUpsertForm__description');

export const questionGroupAddQuestionButton = getTestId('QuestionList__addQuestionButton');

export const questionGroupAccordion = getTestId('QuestionAccordion__root');

export const questionIndividual = getTestId('SingleQuestionBox__root');

export const questionItem = getTestId('QuestionItem__root');

export const getQuestionItemName = (questionName: string) =>
    `${questionItem}:has-text("${questionName}")`;

export const quizFibHandwritingChangeConfirmDialog = `${getTestId(
    'DialogCancelConfirm__dialog'
)}[title="Change handwriting selection"]`;

export const quizMaterialUploadInput = `${getTestId('QuizMaterialUpload__root')} ${getTestId(
    'UploadInput__inputFile'
)}`;

export const quizOCRTypeOptionsContainer = getTestId('OCROptionSelection__rectType');

export const quizOCRTypeText = getTestId('RectTypeSelection__text');

export const quizOCRTypeImage = getTestId('RectTypeSelection__image');

export const quizOCRTypeLatex = getTestId('RectTypeSelection__tex');

export const getOCRTypeSelector = (ocrOption: string) => {
    switch (ocrOption) {
        case 'Text':
            return `${quizOCRTypeOptionsContainer} ${quizOCRTypeText}`;
        case 'Image':
            return `${quizOCRTypeOptionsContainer} ${quizOCRTypeImage}`;
        case 'Latex':
            return `${quizOCRTypeOptionsContainer} ${quizOCRTypeLatex}`;
        default:
            throw Error(`Cannot get OCR type ${ocrOption} selector`);
    }
};

export const quizOCRFieldSelectContainer = getTestId('OCROptionSelection__fieldType');

export const quizOCRFieldOptions = `${quizOCRFieldSelectContainer} button`;
