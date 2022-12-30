import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { ArrowType, ToggleViewButtonType } from '../communication-common-questionnaire-definitions';

export const notificationDialog = getTestId('NotificationUpsertDialog__dialog');
export const notificationAudienceSelectorUpsertDialog = getTestId(
    'NotificationAudienceSelectorUpsertDialog__dialog'
);

export const chipAutocomplete = getTestId('ChipAutocomplete');
export const chipAutocompleteText = `${getTestId('ChipAutocomplete')} span`;

export const composeButton = 'NotificationList__buttonCompose';
export const notificationDiscardButton = 'NotificationDialogFooter__buttonDiscard';
export const notificationUploadButton = getTestId('MediaListUploadNotification__buttonUpload');

export const sendNotificationButton = 'DialogNotificationButtonGroup__buttonSend';
export const saveDraftNotificationButton = 'DialogNotificationButtonGroup__buttonSaveDraft';

export const coursesAutocompleteHF = getTestId('CoursesAutocompleteHF__autocomplete');
export const coursesAutocompleteInput = `${coursesAutocompleteHF} input`;

export const studentsAutocompleteHF = getTestId('StudentsAutocompleteHF__autocomplete');
export const studentsAutocompleteInput = `${studentsAutocompleteHF} input`;

export const gradesMasterAutocompleteHF = getTestId('GradesMaterAutocompleteHF__autocomplete');
export const gradesAutocompleteInput = 'input[id="GradesAutocompleteHF__autocomplete"]';

export const notificationDialogConfirmDiscardButton = `${getTestId(
    'FooterDialogConfirm__buttonSave'
)}[aria-label="Discard"]`;
export const notificationDialogConfirmCancelButton = `${getTestId(
    'FooterDialogConfirm__buttonClose'
)}[aria-label="Cancel"]`;

export const notificationDialogConfirmDisposeButton = `${getTestId(
    'FooterDialogConfirm__buttonSave'
)}[aria-label="Dispose"]`;

export const userTypeParentRadio = `${getTestId(
    'Radio__USER_GROUP_PARENT'
)} > input[value="USER_GROUP_PARENT"]`;
export const userTypeStudentRadio = `${getTestId(
    'Radio__USER_GROUP_STUDENT'
)}> input[value="USER_GROUP_STUDENT"]`;

export const notificationTitleInput = getTestId('NotificationUpsertForm__inputTitle');
export const notificationContentInput = 'div[role="textbox"]';

export const menuItemAll = "[data-testid='NotificationCategory__NOTIFICATION_STATUS_NONE']";
export const menuItemDraft = "[data-testid='NotificationCategory__NOTIFICATION_STATUS_DRAFT']";
export const menuItemSent = "[data-testid='NotificationCategory__NOTIFICATION_STATUS_SENT']";
export const menuItemSchedule =
    "[data-testid='NotificationCategory__NOTIFICATION_STATUS_SCHEDULED']";

export const notificationTitle = getTestId('NotificationTable__title');

export const notificationContent = `[data-js="Notification__content"]`;

export const notificationDetailTitle = getTestId('HeaderNotification__title');
export const notificationDetailContent = getTestId('Editor__draftEditor');
export const notificationDetailStatus = getTestId('ChipNotificationStatus');
export const notificationDetailRecipientDropdownButton = getTestId(
    'ButtonDropdownWithPopover__button'
);
export const notificationDetailRecipientDropdown = getTestId(
    'InfoNotificationDetailSentTable__container'
);

export const notificationTable = getTestId('Notification__table');
export const notificationTableLastUpdatedColumn = getTestId('NotificationTable__lastUpdated');
export const notificationTableStatus = getTestId('NotificationTable__status');

export const notificationDetailRecipientTable = getTestId('Recipient__table');
export const notificationDetailRecipientStatus = getTestId('Recipient__status');
export const notificationDetailRecipientLinkName = getTestId('RecipientTable__linkName');
export const resendNotificationButton = getTestId('RecipientTable__buttonResend');
export const notificationEditorInlineLinkInput = getTestId('Editor__inputInlineLink');
export const notificationEditorAddInlineLinkButton = getTestId('Editor__buttonAddInlineLink');

export const notificationAriaLabel = 'Notification';
export const notificationEditorLinkAriaLabel = 'Insert Link';

export const notificationReadCountColumn = getTestId('ReadCountColumn__box');

// TODO: Temporary selector for file chip, will create another task to refactor when upload file function is available
export const notificationChipFileContainer = getTestId('ChipFileDescription__name');

export const notificationUpsertForm = getTestId('NotificationUpsertForm__root');

//schedule notification
export const saveScheduleNotificationButton = `DialogNotificationButtonGroup__buttonSaveSchedule`;
export const notificationTypeNowRadio = `${getTestId(
    'Radio__NOTIFICATION_STATUS_DRAFT'
)} > input[value="NOTIFICATION_STATUS_DRAFT"]`;
export const notificationTypeScheduleRadio = `${getTestId(
    'Radio__NOTIFICATION_STATUS_SCHEDULED'
)} > input[value="NOTIFICATION_STATUS_SCHEDULED"]`;

export const notificationScheduleDatePicker = `${getTestId(
    'NotificationUpsertForm__scheduledDate'
)} ${getTestId('DatePickerHF__input')}`;

export const fullCalendarFullDatePicker =
    'div[aria-label="DatePickerHF__dialog"] [class*="MuiTypography-h4"]';

export const timePickerHF = getTestId('TimePickerAutocompleteHF__autocomplete');
export const timePickerInput = `${timePickerHF} input`;
export const timePickerClear = `${timePickerHF} button[title='Clear']`;

export const notificationTableRowWithId = (id: string) => `tr[data-value="${id}"]`;

export const mandatoryFieldErrorTypography =
    '[class*="Mui-error"]:has-text("This field is required")';

export const addQuestionButton = getTestId('DynamicQuestionSection__buttonAddQuestion');
export const addAnswerButton = getTestId('DynamicAnswerSection__buttonAddAnswer');
export const questionTypeSelect = getTestId('QuestionSection__selectQuestionType');
export const questionTitle = getTestId('QuestionSection__questionTitle');
export const questionSection = getTestId('DynamicQuestionSection__questionSection');
export const answerItem = getTestId('AnswerItem__root');
export const questionInput = getTestId('QuestionSection__inputQuestion');
export const answerInput = getTestId('AnswerItem__inputAnswer');
export const deleteQuestionButton = getTestId('QuestionSection__buttonDeleteQuestion');
export const deleteAnswerButton = getTestId('AnswerItem__buttonDeleteAnswer');
export const requiredQuestionToggle = getTestId('QuestionSection__switchRequiredQuestion');
export const allowResubmissionToggle = getTestId('DynamicQuestionSection__switchAllowResubmission');
export const importantNotificationToggle = getTestId(
    'NotificationUpsertForm__switchImportantNotification'
);
export const expirationDatePicker = `${getTestId(
    'DynamicQuestionSection__datePickerExpiration'
)} ${getTestId('DatePickerHF__input')}`;
export const expirationTimePickerInput = `${getTestId(
    'DynamicQuestionSection__timePickerExpiration'
)} input`;

export const getQuestionSectionSelectorByQuestionIndex = (questionIndex: number) =>
    `${getTestId('DynamicQuestionSection__questionSection')} >> nth=${questionIndex}`;

export const getAnswerItemSelectorByAnswerIndex = (answerIndex: number) =>
    `${getTestId('AnswerItem__root')} >> nth=${answerIndex}`;

export const getTextFieldErrorMessageSelector = (errorMessage: string) =>
    `[aria-label="TextFieldHF__formHelperText"]:has-text("${errorMessage}")`;

export const getDateErrorMessageSelector = (errorMessage: string) =>
    `p:is(:has-text("${errorMessage}"))`;

export const questionSectionContainer = getTestId('DynamicQuestionSection__root');

export const getTextFromListbox = (text: string) => `[role='listbox'] li :text-is("${text}")`;

export const getAccordionSummarySelectorByQuestionSectionIndex = (questionSectionIndex: number) =>
    `${getTestId('AccordionSummaryBase__root')} >> nth=${questionSectionIndex}`;

export const getArrowIconSelectorByArrowIconType = (arrowIcon: ArrowType) => {
    return arrowIcon === 'Up Arrow'
        ? getTestId('AccordionSummaryIconExpand__expandLess')
        : getTestId('AccordionSummaryIconExpand__expandMore');
};

export const getToggleViewButtonSelectorByToggleViewButtonType = (
    toggleViewButton: ToggleViewButtonType
) => `${getTestId('ToggleViewButton__buttonViewMoreLess')}:has-text("${toggleViewButton}")`;

export const questionnaireDetailAnswers = getTestId('QuestionnaireDetailAnswers__root');
export const accordionQuestionContent = getTestId('AccordionSummaryBase__content');
export const accordionQuestionTitle = getTestId('QuestionSummary__title');
export const accordionAnswerContent = getTestId('QuestionnaireDetailAnswers__answer');

export const responderNameColumn = getTestId('QuestionnaireResultTable__responderName');
export const questionAnswerColumn = getTestId(
    'QuestionnaireResultTable_questionnaireQuestionAnswer'
);
export const questionnaireResultTable = getTestId('QuestionnaireResultTable__table');

export const formFilterAdvancedTextFieldSearchNotificationFilterInput =
    '[data-testid="FormFilterAdvanced__textField"] input[placeholder="Search by Notification Title"]';
export const notificationCloneButton = getTestId('ButtonCloneNotification__buttonClone');
export const notificationDetailContainer = getTestId('NotificationDetail');

export const notificationGeneralInfoAttachmentFiles = getTestId(
    'NotificationGeneralInfo__attachment'
);

export const commonTableBaseFooterTotalRows = getTestId('TableBaseFooter__totalRows');
