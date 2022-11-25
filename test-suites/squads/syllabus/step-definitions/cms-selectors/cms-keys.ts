import { LOType } from '@supports/app-types';
import { ActionOptions, MoveDirection, SelectActionOptions } from '@supports/types/cms-types';

import { KeyCourseTab } from 'step-definitions/types/common';

export const getId = (id: string) => `[id=${id}]`;

// Common
export const dialogDatePicker = 'div[aria-label="DatePickerHF__dialog"]';

export const getTestId = (testId: string) => `[data-testid='${testId}']`;

export const tableRowByText = (tableSelector: string, text: string) =>
    `${tableSelector} ${tableBaseRow}:has-text("${text}")`;

export const studentDetail = '[data-testid="StudentDetail"]';

export const courseNameInput = '#name';

export const selectTestId = 'SelectHF__select';

export const quizTypeSelect = 'QuizTypeSelect__root';

export const quizMain = getTestId('QuizMain__root');

export const submitButton = 'button[type="submit"]';

export const lookingForIcon = '[data-testid="LookingFor__icon"]';

export const courseTitle = (courseName: string) => `[title="${courseName}"]`;

export const saveButton = '[data-testid="FooterDialogConfirm__buttonSave"]';
export const closeButton = '[data-testid="FooterDialogConfirm__buttonClose"]';

export const confirmApplyButton = `${saveButton}:text-is("Confirm")`;

export const cancelApplyButton = `${closeButton}:text-is("Cancel")`;

export const removeMaterialButton = '[data-testid="ChipRemoveIcon__icon"]';

export const lessonNameInput = '[data-testid="LiveLessonsUpsert__lessonNameInput"]';

export const endDatePicker = '[data-testid="LiveLessonsUpsert__endDatePicker"]';

export const pickYearButton = `${dialogDatePicker} [data-testid="ArrowDropDownIcon"]`;

export const yearItems = '[class="MuiTypography-root MuiPickersYear-root MuiTypography-subtitle1"]';

export const doneYearPickerButton = '[class="MuiButton-label"]';

export const muiPickersYearSelection = `${dialogDatePicker} [class*="MuiYearPicker-root"]`;

export const tableCourse = '[data-testid="TableCourses__action"]';

export const searcherCourseInput = '[title="Add Course"] [placeholder="Enter your keyword"]';

export const formFilterAdvancedTextFieldSearchInput =
    '[data-testid="FormFilterAdvanced__textField"] [placeholder="Enter your keyword"]';

export const formFilterAdvancedTextFieldSearchStudentInput =
    '[data-testid="FormFilterAdvanced__textField"] input[placeholder="Enter Student Name"]';

export const formFilterAdvancedTextFieldSearchTeacherInput =
    '[data-testid="FormFilterAdvanced__textField"] [placeholder="Search by Teacher Name"]';

export const formFilterAdvancedTextFieldSearchStaffInput =
    '[data-testid="FormFilterAdvanced__textField"] [placeholder="Search by Staff Name"]';

export const checkCourseLabel = '[data-testid="CheckboxGroupWithLabel__label"]';

export const courseItem =
    '[class="MuiButtonBase-root MuiListItem-root MuiListItem-dense MuiListItem-button"]';

export const saveButtonInDialog =
    '[data-testid="DialogWithHeaderFooter_wrapper"] [data-testid="FooterDialogConfirm__buttonSave"]';

export const tableStudent = '[data-testid="TableStudents__action"]';

export const searchStudentInput = '[title="Add Student"] [placeholder="Enter your keyword"]';

export const studentItem = (studentName: string) => `td:has-text("${studentName}")`;

export const checkStudent =
    '[data-testid="DialogWithHeaderFooter__dialogContent"] [data-testid="TableRowWithCheckbox__checkboxRow"] input[type="checkbox"]';

export const dialogWithHeaderFooter = '[data-testid="DialogWithHeaderFooter__dialogContent"]';

export const autoCompleteBaseInput = getTestId('AutocompleteBase__input');

export const autoCompleteTeacher = '[data-testid="AutocompleteBase__input"]';

export const autoCompleteTeacherItem = (username: string) =>
    `[data-testid="AutocompleteBase__listBox"] div:has-text("${username}")`;

export const autocompleteBaseOption = '[data-testid="AutocompleteBase__option"]';

export const lessonItem = (lessonName: string) => `text=${lessonName}`;

export const locationSelectorCreateCourse = '[data-testid="LocationSelectInputHF__root"]';

export const locationCheckBox = (locationId: string) => `[data-value='${locationId}'] input`;

export const locationSelectedField = '[data-testid="DialogTreeLocations__subNote"]';

export const locationSettingTa = '[data-testid="SettingsTabForm__locationsName"]';

export const locationHelperText = (text: string) =>
    `[data-testid="LocationSelectInputHF__root"] p:text-is("${text}")`;

export const teachingMethodSelectorCreateCourse =
    '[data-testid="TeachingMethodAutocompleteHF__autocomplete"]';

export const teachingMethodHelperText = (text: string) =>
    `[data-testid="TeachingMethodAutocompleteHF__autocomplete"] p:text-is("${text}")`;

export const locationDialog = '[data-testid="DialogTreeLocations__tree"]';

export const courseTableCourseNameLink = (courseName: string) =>
    `[data-testid="CourseTable__courseNameLink"][title="${courseName}"]`;

export const courseTabletCourseName = '[data-testid="CourseTable__courseName"]';

export const autocompleteBaseLoading = `[data-testid='AutocompleteBase__loading']`;

export const courseTab = getTestId('CourseShow__tab');

export const tabInCourseDetail = (tabName: KeyCourseTab) =>
    `[data-testid="CourseShow__${tabName}Tab"]`;

export const breadcrumb = '[aria-label="breadcrumb"]';

export const forgotForm = getTestId('Forgot__form');

export const multiTenantLoginButton = getTestId('LoginTenantForm__buttonLogin');

export const multiTenantForgotForm = getTestId('ForgotPasswordTenant__form');

export const resendEmailForm = getTestId('ResendEmail__form');

export const forgotPasswordLink = getTestId('LoginForm__forgot__button');

export const multiTenantForgotPasswordLink = getTestId('LoginTenantForm__buttonForgot');

export const resetPasswordButton = getTestId('ForgotForm__reset__button');

export const multiTenantResetPasswordButton = getTestId('ForgotPasswordTenant__buttonReset');

export const backToSignInButton = getTestId('BackToSignIn__button');

export const userMenuSettingButton = getTestId('UserMenu__setting');

export const checkBoxLocation = (locationId: string | undefined) =>
    getTestId(`CheckBoxLocation__${locationId}`);

export const checkBoxIndeterminateIcon = (indeterminate: boolean) =>
    `[data-indeterminate='${indeterminate}']`;

export const checkBoxCheckedIcon = getTestId('CheckBoxIcon');

export const checkBoxUncheckIcon = getTestId('CheckBoxOutlineBlankIcon');

export const selectLocationField = getTestId('LocationDisplay__LocationNames');

export const inputByValue = (value: string) => `input[value="${value}"]`;

export const checkBoxWithCheckedState = (checked: boolean) =>
    `input[type=checkbox]:${checked ? 'checked' : 'not(:checked)'}`;

export const tableSkeleton = getTestId('TableSke__item');

// Layout
export const wrapperHeaderRoot = getTestId('WrapperPageHeader__root');

// Books
export const bookListTable = getTestId('BookList__table');

export const bookListItemName = getTestId('BookList__bookName');

// Books in course
export const bookTabTable = getTestId('BookTab__table');

//  Study plan in course
export const studyPlanNameColumn = (studyPlanName: string) =>
    `${getTestId('StudyPlanNameColumn__name')}:has-text("${studyPlanName}")`;

export const studentStudyPlanNameColumn = getTestId('StudentStudyPlanTable__studyPlanName');

export const showHideStudyPlanItem = getTestId('ButtonShowHide');
export const studyPlanItemTableAction = getTestId('StudyPlanItemTableAction__root');

export const studyPlanItem = (studyPlanName: string) =>
    `${getTestId('StudyPlanNameColumn__name')}:has-text("${studyPlanName}")`;
export const studyPlanBookLink = getTestId('StudyPlanInfo__bookLink');

export const studyPlanBulkEditTable = getTestId('StudyPlanItemBulkEditTable');

// Chapters

export const chapterItemRoot = getTestId('ChapterItem_root');

export const chapterItem = (chapterName: string) => `${chapterItemRoot}:has-text("${chapterName}")`;

export const chapterItemName = getTestId('ChapterAccordion__name');
export const chapterItemMoveDownButton = getTestId('ChapterItem__moveDown');
export const chapterItemMoveUpButton = getTestId('ChapterItem__moveUp');
export const createChapterButton = `button[data-testid="ChapterForm__visibleFormControl"]`;
// Topics
export const topicList = `TopicList__root`;
export const topicItemRoot = getTestId('TopicItem__root');
export const topicItemName = getTestId('TopicAccordion__name');
export const topicItemMoveDownButton = getTestId('TopicItem__moveDown');
export const topicItemMoveUpButton = getTestId('TopicItem__moveUp');

export const topicItem = (topicName: string) =>
    `[data-testid="TopicItem__root"]:has-text("${topicName}")`;

export const createTopicButton = `button[data-testid="TopicList__createTopic"]`;

export const topicFormRoot = getTestId('TopicForm__root');

// Learning Objectives
export const createLOTabRoot = getTestId('CreateLOsTab__root');
export const loAndAssignmentRoot = getTestId('LOAndAssignment__root');
export const loAndAssignmentItem = getTestId(`LOAndAssignmentItem__root`);
export const studyPlanItemTableTopicName = getTestId('StudyPlanItemTableColumns__topicName');
export const studyPlanItemTableLoName = getTestId('StudyPlanItemTableColumns__loName');

export const loAndAssignmentItemAtIndex = (index: number) => {
    return `${loAndAssignmentRoot} li:nth-child(${index})`;
};

export const loAndAssignmentName = getTestId('LOAndAssignmentItem__name');

export const loAndAssignmentByName = (name: string) =>
    `${loAndAssignmentRoot} li:has-text("${name}")`;

export const studyPlanItemByName = (name: string) =>
    `${studyPlanItemTableLoName} p:has-text("${name}")`;

export const createLoButton = `button[data-testid="LOAndAssignment__addLOs"]`;

export const loAndAssignmentItemMoveUp = getTestId('LOAndAssignmentItem__moveUp');
export const loAndAssignmentItemMoveDown = getTestId('LOAndAssignmentItem__moveDown');

// Assignments
export const assignmentGradingMethodText = (info: string) =>
    `${getTestId('ShowAssignment__gradingMethod')}:has-text("${info}")`;

export const assignmentGradeDropdownList = `[aria-labelledby="is_required_grade"]`;

export const assignmentBrightcoveUploadInput = 'input[name="url"]';

// Task assignment
export const taskAssignmentFormRoot = getTestId('TaskAssignmentForm__root');

export const taskAssignmentInstruction = getTestId('TaskAssignmentDetail__instruction');

export const taskAssignmentRequiredItems = getTestId('TaskAssignmentDetail__requiredItems');

export const taskAssignmentInstructionText = (text: string) =>
    `${getTestId('TaskAssignmentDetail__instruction')}:has-text("${text}")`;

export const taskAssignmentNoAttachmentText = (text: string) =>
    `${getTestId('TaskAssignmentDetail__noAttachment')}:has-text("${text}")`;

export const taskAssignmentRequiredItemsText = (text: string) =>
    `${getTestId('TaskAssignmentDetail__requiredItems')}:has-text("${text}")`;

// Draft JS
export const draftEditor = getTestId('Editor__draftEditor');

// Quizzes - Questions
export const quizPointHFInput = getTestId('QuizPointInputHF__input');

export const quizTypeSelectHFRoot = getTestId('QuizTypeSelect__root');

export const quizQuestionBox = `[data-js="Quiz__question"]`;

export const quizQuestionEditorInput = `${quizQuestionBox} ${draftEditor}`;

export const quizExplanationBox = `[data-js="Quiz__explanation"]`;

export const quizExplanationBoxInput = `${quizExplanationBox} ${draftEditor}`;

export const quizPreviewRoot = getTestId('QuizPreview__root');

export const quizAnswerListItem = getTestId('QuizAnswerList__item');

export const quizAnswerListItemNth = (index: number) => `${quizAnswerListItem}:nth-child(${index})`;

export const quizAnswerDescription = getTestId('QuizDescription__question');

export const quizMainExplanation = getTestId('QuizMain__explanation');

export const quizMainExplanationEditor = `${quizMainExplanation} ${draftEditor}`;

export const quizV2QuestionEditorInput = `${quizAnswerDescription} ${draftEditor}`;

export const quizEditorHelperText = getTestId('QuizEditorHF__formHelperText');

export const quizQuestionHelperText = `${quizAnswerDescription} ${quizEditorHelperText}`;

export const quizExplanationHelperText = `${quizMainExplanation} ${quizEditorHelperText}`;

export const quizPreviewPoint = getTestId('QuizPreview__point');

export const quizPreviewDifficultText = (content: number) =>
    `${getTestId('QuizPreview__difficultyLevel')}:has-text("${content}")`;

export const quizPreviewKindText = (content: string) => `${quizPreviewRoot}:has-text("${content}")`;

export const quizPreviewTaggedLOsText = (content: string) =>
    `${quizPreviewRoot}:has-text("${content}")`;

export const quizPreviewPointText = (content: number) =>
    `${quizPreviewPoint}:has-text("${content}")`;

export const quizPreviewEditBtn = getTestId('QuizPreview__editQuizButton');

export const quizAnswerBox = `[data-js="Quiz__answers"]`;

export const quizAnswerAddMoreBtn = getTestId('AnswerList__addNewAnswer');

export const quizAnswerAddMoreBtnV2 = getTestId('QuizAnswerList__btnAddAnswer');

export const quizAnswerMultipleChoiceBoxes = `[data-testid="AnswerMultipleChoice__form"]`;

export const quizAnswerMultipleChoiceRoot = `[data-testid="QuizMCQAnswerItem__root"]`;

export const quizAnswerMultipleChoiceEditorInput = `${quizAnswerMultipleChoiceBoxes} ${draftEditor}`;

export const quizAnswerMultipleChoiceEditorInputNth = (index: number) =>
    `${quizAnswerMultipleChoiceBoxes}:nth-child(${index}) ${draftEditor}`;
export const quizDeleteAnswerBtn = getTestId('DeleteAnswerButton__root');

export const quizDeleteAnswerBtnV2 = getTestId('DeleteButton__root');

export const quizAnswerMultipleChoiceDeleteNth = (index: number) =>
    `${quizAnswerMultipleChoiceBoxes}:nth-child(${index}) ${quizDeleteAnswerBtn}`;

export const quizAnswerMultipleChoiceCorrect = (index: number) =>
    `${quizAnswerMultipleChoiceBoxes}:nth-child(${index}) input[type="radio"]`;

export const quizAnswerMultipleChoiceCorrectRadio = (index: number) =>
    `${quizAnswerListItem}:nth-child(${index}) input[type="radio"]`;

export const quizAnswerMultipleAnswerBoxes = `[data-testid="AnswerMultipleAnswer__form"]`;

export const quizAnswerMultipleAnswerRoot = `[data-testid="QuizMAQAnswerItem__root"]`;

export const quizAnswerMultipleAnswerEditorInput = `${quizAnswerMultipleAnswerRoot} ${draftEditor}`;

export const quizAnswerEditorInput = `${quizAnswerListItem} ${draftEditor}`;

export const quizAnswerEditorInputValidation = `${quizAnswerListItem} ${quizEditorHelperText}`;

export const quizAnswerDescriptionEditorInputValidation = `${quizAnswerDescription} ${quizEditorHelperText}`;

export const quizAnswerMultipleAnswerEditorInputNth = (index: number) =>
    `${quizAnswerMultipleAnswerBoxes}:nth-child(${index}) ${draftEditor}`;

export const quizAnswerEditorInputNth = (index: number) =>
    `${quizAnswerListItem}:nth-child(${index}) ${draftEditor}`;

export const quizAnswerMultipleAnswerDeleteNth = (index: number) =>
    `${quizAnswerMultipleAnswerBoxes}:nth-child(${index}) ${quizDeleteAnswerBtn}`;

export const quizAnswerDeleteBtnNth = (index: number) =>
    `${quizAnswerListItem}:nth-child(${index}) ${quizDeleteAnswerBtnV2}`;

export const quizAnswerMultipleAnswerCorrectNth = (index: number) =>
    `${quizAnswerListItemNth(index)} input[type="checkbox"]`;

export const quizAnswerCorrectCheckboxNth = (index: number) =>
    `${quizAnswerListItem}:nth-child(${index}) input[type="checkbox"]`;

export const quizFIBAnswerHFInput = `${getTestId('QuizFIBAnswerInputHF__textInput')} input`;

export const quizAnswerFillInBlankRoot = getTestId('AnswerFillInBlank__root');

export const quizAnswerFillInBlankRootV2 = getTestId('QuizFIBAnswerItem__root');

export const quizAnswerFillInBlankInput = getTestId('AnswerFillInBlankInput__answer');

export const quizAnswerFillInBlankInputV2 = getTestId('QuizFIBAnswerInputHF__textInput');

export const quizAnswerFillInBlankInputV3 = getTestId('QuizFIBAnswerInput__answer');

export const quizFIBAnswerHFInputV2 = `${quizAnswerFillInBlankInputV2} input`;

export const quizAnswerFillInBlankToggleMadeToList = `${getTestId(
    'AnswerOptions__highlightRadio'
)} input`;

export const quizAnswerMadeIntoListCheckboxInput = `${getTestId(
    'QuizFIBAnswerOption__labelCheckbox'
)} input`;

export const quizAnswerFillInBlankAlternativeInput = getTestId(
    'AnswerFillInBlankInput__alternative'
);

export const quizAnswerFillInBlankAlternativeInputV2 = getTestId('QuizFIBAnswerInput__alternative');

export const quizAnswerLabelPrefixInput = `${getTestId('ListLabel__prefix')} input`;

export const quizAnswerPrefixLabelRoot = getTestId('QuizPrefixLabelHF__root');

export const quizAnswerLabelPrefixInputV2 = `${quizAnswerPrefixLabelRoot} input`;

export const quizAnswerLabelPrefixValidationText = `${quizAnswerPrefixLabelRoot} p`;

export const quizAnswerFillInBlankRootNth = (index: number) =>
    `${quizAnswerFillInBlankRoot}:nth-child(${index})`;

export const quizAnswerFillInBlankEditorInputNth = (index: number) => {
    return `${quizAnswerFillInBlankRoot}:nth-child(${index}) ${quizAnswerFillInBlankInput}`;
};

export const quizAnswerFillInBlankEditorInputNthV2 = (index: number) => {
    return `${quizAnswerListItem}:nth-child(${index}) ${quizAnswerFillInBlankInputV2} input`;
};

export const quizAnswerFillInBlankEditorInputNthV3 = (index: number) => {
    return `${quizAnswerListItem}:nth-child(${index}) ${quizAnswerFillInBlankInputV3}`;
};

export const quizAnswerFIBEditorInput = `${quizAnswerListItem} ${quizAnswerFillInBlankInputV2}`;

export const quizAnswerFIBEditorInputNth = (index: number) =>
    `${quizAnswerListItem}:nth-child(${index}) ${quizAnswerFillInBlankInputV2}`;

export const quizAnswerFillInBlankDeleteNth = (index: number) =>
    `${quizAnswerFillInBlankRoot}:nth-child(${index}) ${quizDeleteAnswerBtn}`;

export const quizQuizAnserFillInBlankRemoveAlternative = getTestId(
    'AnswerFillInBlank__removeAlternative'
);

export const quizAnswerFillInBlankAddAlternative = getTestId('AnswerFillInBlank__addAlternative');

export const quizAnswerFIBAddAlternativeButton = getTestId('QuizFIBAnswerItem__addAlternative');

export const quizAnswerFillInBlankAddAlternativeForAnswer = (answerIndex: number) => {
    return `${quizAnswerFillInBlankRoot}:nth-child(${answerIndex}) ${quizAnswerFillInBlankAddAlternative}`;
};

export const quizAnswerAddAlternativeAnswer = (answerIndex: number) =>
    `${quizAnswerListItem}:nth-child(${answerIndex}) ${quizAnswerFIBAddAlternativeButton}`;

export const quizAnswerSelectLabelType = getTestId('AnswerOption__selectedList');

export const quizAnswerLabelTypeSelect = getTestId('QuizPrefixLabelSelectHF__root');

export const quizAnswerLabelTypeSelectInput = `${quizAnswerLabelTypeSelect} input`;

export const quizPreviewAnswers = getTestId('QuizPreview__answers');

export const editorContent = getTestId('Editor__content');

export const quizPreviewAnswerContent = `${quizPreviewAnswers} ${editorContent}`;

export const quizSelectDifficult = `${getTestId('QuizOptions__difficulty')} ${getTestId(
    'BaseSelect'
)}`;

export const quizV2SelectDifficult = `${getTestId('QuizDescription__difficulty')} ${getTestId(
    'SelectHF__select'
)}`;

export const quizV2SelectType = `${getTestId('QuizDescription__questionType')} ${getTestId(
    'QuizTypeSelect__root'
)}`;

export const quizTypeMenuOptions = `#menu-kind ul[role="listbox"] > li`;

export const quizSelectedTypeMenuOption = `${quizTypeMenuOptions}[aria-selected="true"]`;

export const quizV2ChangeTypeConfirmBtn = `${getTestId(
    'QuizTypeSelect__confirmDialog'
)} ${getTestId('FooterDialogConfirm__buttonSave')}`;

export const quizV2TaggedLOsInput = `${getTestId('QuizDescription__lo')} input#taggedLOs`;

export const quizTypeSelectDataValueInput = `${getTestId(quizTypeSelect)} > input`;

export const quizDifficultSelect = `${getTestId('QuizDescription__difficulty')} ${getTestId(
    selectTestId
)}`;

export const quizSubmitBtn = getTestId('QuizLayout__submit');

export const quizV2SubmitBtn = `${getTestId('DialogFullScreen__footer')} ${getTestId(
    'DialogWithHeaderFooter__dialogActions'
)} ${getTestId('FooterDialogConfirm__buttonSave')}`;

export const quizMoveDown = getTestId('QuizTable__moveDownButton');

export const quizMoveUp = getTestId('QuizTable__moveUpButton');

export const optionsButton = `button[data-testid="ActionPanel__trigger"]`;

export const addParentDropdownButton = `button[data-testid="ButtonDropdownMenu__button"]`;

export const renameOption = `[aria-label="Rename"]`;

export const editOption = `[aria-label="Edit"]`;

export const deleteOption = `[aria-label="Delete"]`;

export const formInput = `[data-testid="TextFieldHF__input"]`;

export const textBox = `[role="textbox"]`;

export const expandedItem = `div[aria-expanded="true"]`;

export const editorLoadingImage = `[data-testid="LoadingImage__root"]`;

export const quizPreviewExplanationContent = `${getTestId(
    'QuizPreview__explanation'
)} ${editorContent}`;

// Action buttons aria labels
export const createButton = 'Create';

export const deleteButton = 'Delete';

export const editButton = 'Edit';

// Dialogs
export const dialogByRole = '[role="dialog"]';
export const dialogWithHeaderFooterWrapper = '[data-testid="DialogWithHeaderFooter_wrapper"]';
export const dialogFullScreen = '[data-testid="DialogFullScreenHF__container"]';

// Dialog action buttons
export const dialogActions = getTestId('DialogWithHeaderFooter__dialogActions');

export const saveDialogButton = getTestId('FooterDialogConfirm__buttonSave');

export const cancelDialogButton = getTestId('FooterDialogConfirm__buttonClose');

export const closeDialogButton = 'DialogFullScreen__buttonClose';

export const formDialogContent = getTestId('FormDialog__content');

export const confirmDialogButton = getTestId('Confirm__ok');

export const dialogCancelConfirm = getTestId('DialogCancelConfirm__dialog');

export const buttonByAriaLabel = (label: string) => `button[aria-label="${label}"]`;

// Materials
export const videoFileChipIcon = `img[alt="images/iconVideo.png"]`;
export const fileIconVideo = getTestId('FileIcon__video');

export const pdfFileChipIcon = `img[alt="images/iconPDF.png"]`;
export const fileIconPDF = getTestId('FileIcon__PDF');

export const audioFileChipIcon = `img[alt="images/iconAudio.png"]`;

export const fileChipName = (name: string) =>
    `[data-testid="ChipFileDescription__name"]:has-text("${name}")`;

export const brightcoveVideoPlayer = `video-js[aria-label="Video Player"]`;

export const brightcoveUploadInput = '[data-testid="FormUploadBrightCove__input"]';

export const externalLink = `a[data-testid="ExternalLink"]`;

export const pdfMediaExternalLink = (href: string): string => `${externalLink}[href="${href}"]`;

export const assignmentSetting = (setting: string) => `input[name="${setting}"]`;

export const entityIcon = getTestId('EntityIcon__root');
export const entityIconButton = `${entityIcon} button`;

export const lOSvgIcon = getTestId('LOIcon__svg');
export const assignmentIcon = getTestId('AssignmentIcon__svg');
export const taskAssignmentIcon = getTestId('TaskAssignmentIcon__svg');
export const flashCardIcon = getTestId('FlashCardIcon__svg');
export const examLOICon = getTestId('ExamLOIcon_svg');

export const mappedLOTypeIconSelector: { [x in LOType]: string } = {
    assignment: assignmentIcon,
    flashcard: flashCardIcon,
    'learning objective': lOSvgIcon,
    'exam LO': examLOICon,
    'task assignment': taskAssignmentIcon,
};

export const typographyRoot = '[class*=MuiTypography-root]';

// Tables
export const tableRowItem = (numberOfRows: number) => `li[data-value="${numberOfRows}"]`;
export const tableCellHeader = getTestId('TableBase__cellHeader');
export const tableBaseRow = getTestId('TableBase__row');
export const tableBaseBody = getTestId('TableBaseBody__root');
export const tableBaseFooter = '[data-testid="TableBaseFooter"]';
export const tableBaseFooterSelect = '#TableBaseFooter__select';
export const tableBaseRowWithId = (id: string | number) =>
    `[data-testid="TableBase__row"][data-value="${id}"]`;
export const tableFooterCaption = '[data-testid="TableBaseFooter__totalRows"]';
export const tableCellIndex = '[data-testid="TableIndexCell__index"]';

export const buttonNextPageTable = 'button[aria-label="Go to next page"]';
export const buttonPreviousPageTable = 'button[aria-label="Go to previous page"]';

export const tableEmptyMessage = '[data-testid="TableBase__noDataMessage"]';
export const tableEmptyMessageV2 = '[data-testid="NoResultPage__root"]';

export const datePickerDateButton =
    '[class="MuiButtonBase-root MuiButton-root MuiButton-text MuiPickersToolbarButton-toolbarBtn MuiPickersDatePickerRoot-dateLandscape"]';

export const datePickerPreviousMonthButton = '[aria-label="Previous month"]';

export const datePickerNextMonthButton = '[aria-label="Next month"]';

export const tableActionAddButton = (tableSelector: string): string =>
    `${tableSelector} [data-testid="TableAction__buttonAdd"]`;

export const tableActionDeleteButton = (tableSelector: string): string =>
    `${tableSelector} [data-testid="TableAction__buttonDelete"]`;

export const tableDeleteButton = '[data-testid="TableAction__buttonDelete"]';
// Quiz Question
export const questionListTable = getTestId('TableBaseBody__root');

export const questionRow = getTestId('QuizTable__description');

export const questionRowName = (name: string) =>
    `[data-testid="QuizTable__description"]:has-text("${name}")`;

export const fillInTheBlankInput = `[data-js="FillInBlank__input"] > div > input`;

export const currentPdfPage = (text: string) => (text === 'the next page' ? 2 : 1);

export const quizTablePreviewBtn = getTestId('QuizTable__previewButton');

export const quizAnswerConfigRoot = getTestId('QuizAnswerConfig__root');

export const quizAnswerConfigCheckbox = `${quizAnswerConfigRoot} input[type="checkbox"]`;

// Image

export const imagePreviewDefault = getTestId('ImagePreview__default');

export const imagePreviewImage = getTestId('ImagePreview__img');

export const imagePreviewDelete = getTestId('ImagePreview__delete');

// Form

export const formHelperText = '[class*=MuiFormHelperText-root]';

export const quizAnswerFormHelperText = `${quizAnswerListItem} p${formHelperText}`;

// Paper

export const paperBulkActionsDelete = getTestId('PaperBulkActions__delete');

// Move Up/Down

export const moveDownBase = getTestId('MoveUpDownBase__down');

export const moveUpBase = getTestId('MoveUpDownBase__up');

export const moveDirectionMapped: { [key in MoveDirection]: string } = {
    down: moveDownBase,
    up: moveUpBase,
};

// Snackbar

export const snackbarContent = getTestId('SnackbarBase__content');

export const flashcardCardImg = `${getTestId('ImagePreview__img')} > img`;

export const dialogMessage = `[role='alert']${snackbarContent}`;

// action button
export const moreActionButton = getTestId('MoreAction__button');

export const moreActionAction = getTestId('MoreAction__action');

export const actionPanelTriggerButton = getTestId('ActionPanel__trigger');

export const getActionButtonSelector = (options: SelectActionOptions, testid: string) =>
    `${options?.wrapperSelector || ''} ${testid}${options?.suffix || ''}`.trim();

export const getButtonSelectorByAction = (action: ActionOptions) =>
    `button[role="menuitem"][aria-label="${action}"]`;

export const toggleButtonBase = getTestId('ToggleButtonBase');
// date picker

// TODO: update CMS selector
export const okButtonInDatePicker = `${dialogDatePicker} button:has-text("OK")`;

// Filter

export const filterAdvancedWrapper = getTestId('FormFilterAdvanced__root');
export const openFilterAdvancedPopupButton = getTestId('ButtonDropdownWithPopover__button');
export const resetFilterAdvancedButton = getTestId('ButtonDropdownWithPopover__buttonReset');
export const applyFilterAdvancedButton = getTestId('ButtonDropdownWithPopover__buttonApply');
export const clearAllFilterAdvancedButton = getTestId('FormFilterAdvancedChipList__buttonClearAll');

// Autocomplete HF

export const gradeAutoCompleteHFRoot = getTestId('GradesAutocompleteHF__autocomplete');
export const gradeMasterAutoCompleteHFRoot = getTestId('GradeMasterAutocompleteHF__autocomplete');
export const gradeAutoCompleteHFInput = `${gradeAutoCompleteHFRoot} input[name="grades"]`;

export const bookAutocompleteHFRoot = getTestId('BooksAutocompleteHF__autocomplete');
export const bookAutocompleteHFInput = `${bookAutocompleteHFRoot} input[name="book"]`;
export const courseAutocompleteHFRoot = getTestId('CoursesAutocompleteHF__autocomplete');
export const childListBox = (nth: number): string => `[role='listbox'] li:nth-child(${nth})`;

// location settings
export const selectedLocationSelector = getTestId('GlobalLocationsDisplay__root');
export const titleHeaderDialogSelector = getTestId('DialogWithHeaderFooter__dialogTitle');

// Login Form V2
export const loginFormTextFieldUsername = getTestId('LoginForm__textFieldUsername');
export const loginFormTextFieldPassword = getTestId('LoginForm__textFieldPassword');
export const loginFormButtonForgot = getTestId('LoginForm__buttonForgot');
export const loginCardContent = getTestId('LoginCard__content');
export const loginForm = getTestId('Login__form');

//Snackbar
export const snackBarContainer = getTestId('WrapperSnackbar__container');
export const snackBarError = `${snackBarContainer} .MuiAlert-filledError`;
export const snackBarSuccess = `${snackBarContainer} .MuiAlert-filledSuccess`;

export const disabledRadioButton = 'role=radio[disabled=true]';
