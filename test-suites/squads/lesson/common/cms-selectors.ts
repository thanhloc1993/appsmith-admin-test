import { Meridiem } from 'step-definitions/lesson-management-utils';
import {
    AttendanceStatusValues,
    LessonReportStatus,
    LessonSavingMethodType,
    LessonTimeValueType,
} from 'test-suites/squads/lesson/common/types';
import { TeachingMedium, TeachingMethod } from 'test-suites/squads/lesson/types/lesson-management';

export const lessonTimeTableWithNth = (nth: number) =>
    `[data-testid="TableLessonsWithPaging__lessonTime"] >> nth=${nth}`;

// Data test id only
export const editLessonReportButton = 'DetailSectionReportHeaderInd__buttonEdit';

export const lessonReportUpsertDialog = 'LessonReportUpsertInd__dialog';

export const lessonReportSubmitAllButton = 'FooterLessonReportUpsertIndV1__buttonSubmitAll';

export const lessonReportSaveDraftButton = 'FooterLessonReportUpsertIndV1__buttonSaveDraft';

export const lessonReportDiscardButton = 'FooterLessonReportUpsertIndV1__buttonDiscard';

export const attendanceStatusFieldContainer = 'DynamicFieldAttendanceStatus__container';

export const dialogStudentSubscriptions = 'DialogAddStudentInfo__dialogContainer';

export const lessonManagementList = 'LessonList__root';

export const dialogFullScreenButtonClose = 'DialogFullScreen__buttonClose';

export const lessonAutocompleteLowestLevelLocations =
    '#AutocompleteLocationLowestLevelHF__autocomplete';

export const openUpsertLessonDialog = 'TabLessonList__buttonAdd';

export const openUpsertCourseDialog = 'CourseTable__addButton';

// Element selector
export const lessonListTab = (tab: LessonTimeValueType) => `[data-testid=LessonList__${tab}]`;
export const lessonListFuture = '[data-testid="LessonList__future"]';
export const lessonListPast = '[data-testid="LessonList__past"]';

export const lessonStatusInLessonList = '[data-testid="TableLessonsWithPaging__lessonStatus"]';

export const saveButton = '[data-testid="FooterDialogConfirm__buttonSave"]';
export const confirmApplyButton = `${saveButton}:text-is("Confirm")`;

export const courseSideBar =
    'div[class*="MuiPaper-root"] a[data-testid="MenuItemLink__root"] h6:text-is("Course")';

export const courseContainer = 'div[data-testid="CourseShow__tab"]';

export const courseTeachingMethod = (courseId: string, teachingMethod: string) =>
    `[data-value="${courseId}"] [data-testid="CourseTable__teachingMethod"]:text-is("${teachingMethod}")`;

export const lessonReportTextField = 'input[data-testid="TextFieldHF__input"][type="text"]';

export const lessonReportPercentageField = 'input[data-testid="TextFieldHF__input"][type="number"]';

export const lessonReportTextAreaField = 'textarea[data-testid="TextFieldHF__input"]';

export const lessonReportDetailValueLabels = '[data-testid="DynamicLabelBase__typographyLabel"]';

export const lessonReportDetailValues = '[data-testid="DynamicLabelBase__typographyValue"]';

export const teacherNameChip = (teacherName: string) =>
    `[data-testid="ChipAutocomplete"] span:text-is("${teacherName}")`;

export const lessonUpsertStudentInformationCenter =
    '[data-testid="TableLessonManagementUpsertStudentsInfo__columnCenterName"]';

export const attendanceStatusDetailValue =
    '[data-testid="DynamicLabelAttendanceStatus__typographyValue"]';

export const attendanceRemarkDetailValue =
    '[data-testid="DynamicLabelAttendanceRemark__typographyValue"]';

export const lessonReportDetailEmptyValues =
    '[data-testid="DynamicLabelBase__typographyValue"] p:has-text("--")';

export const lessonReportStatusTag = (tag: LessonReportStatus) =>
    `[data-testid="DetailSectionReportHeaderInd__chipLessonReportStatus"] span:has-text("${tag}")`;

export const attendanceStatusAutocompleteInput = `[data-testid="${attendanceStatusFieldContainer}"] input`;

export const attendanceStatusMissingFieldMessage = `[data-testid="${attendanceStatusFieldContainer}"] p:has-text("This field is required")`;

export const errorIconOnStudentList = '[data-testid="ListStudent__iconError"]';

export const lessonManagementIndividualReportUpsertDialog =
    '[data-testid="LessonReportUpsertInd__dialog"]';

export const allAutocompleteInputs = '[data-testid="AutocompleteBase__input"]';

export const lessonReportAutocompleteInputsDynamicFieldOnly = `[data-testid="DynamicFieldBase__container"] ${allAutocompleteInputs}`;

export const lessonReportDetailPageContainer = '[data-testid="TabLessonReport__container"]';
export const groupLessonReportDetailPageContainer = '[data-testid="TabLessonReportGrp__container"]';

export const studentListItemWithStudentName = (studentName: string) =>
    `[data-testid="ListStudent__listItem"] p:has-text("${studentName}")`;

export const selectedMeridiem =
    'h6[class="MuiTypography-root MuiPickersToolbarText-toolbarTxt MuiPickersTimePickerToolbar-ampmLabel MuiPickersToolbarText-toolbarBtnSelected MuiTypography-subtitle1"]';

export const lessonDate = 'div[data-testid="FormLessonUpsert__lessonDate"] input';

export const lessonEndDate = 'div[data-testid="FormLessonUpsert__lessonEndDate"] input';
export const lessonIconPenEditDate = '[data-testid="PenIcon"]';

export const lessonInputLessonDate =
    'div[data-testid="FormLessonUpsert__lessonDate"] input >> nth=1';

export const lessonInputLessonEndDate =
    'div[data-testid="FormLessonUpsert__lessonEndDate"] input >> nth=1';

export const endTimeInput = 'div[data-testid="FormLessonUpsert__lessonEndTime"] input';
export const endTimeInputWithNth = (nth: number) =>
    `div[data-testid="FormLessonUpsert__lessonEndTime"] input >> nth=${nth}`;

export const lessonErrorInputDateTime =
    '.Manaverse-MuiFormHelperText-root.Mui-error.Manaverse-MuiFormHelperText-sizeSmall.Manaverse-MuiFormHelperText-filled';
export const columnStudentName =
    '[data-testid="DetailSectionLessonStudents__columnStudentName"] [data-testid="TypographyTableCell__typographyMaxLines"]';

export const startTimeInput = 'div[data-testid="FormLessonUpsert__lessonStartTime"] input';
export const startTimeInputWithNth = (nth: number) =>
    `div[data-testid="FormLessonUpsert__lessonStartTime"] input >> nth=${nth}`;

export const timePickerWithValue = (value: string | number) =>
    `div[class^="MuiClockPicker-root"] span:text-is("${value}")`;

export const timePickerWithValueV2 = (value: string | number) =>
    `div[class^="Manaverse-MuiClockPicker-root"] span:text-is("${value}")`;

export const datePickerWithValue = (value: string | number) =>
    `div[class^="MuiCalendarPicker-root"] button:text-is("${value}")`;

export const datePickerWithValueV2 = (value: string | number) =>
    `div[class^="Manaverse-MuiCalendarPicker-root"] button:text-is("${value}")`;

export const meridiemOnTimePicker = (meridiem: Meridiem) =>
    `div[class^="Manaverse-PrivateTimePickerToolbar-ampmSelection"] button[class^="Manaverse-MuiButton-root"] span:text-is("${meridiem}")`;

export const selectedTimePicker =
    'span[class="MuiTypography-root MuiPickersClockNumber-clockNumber MuiPickersClockNumber-clockNumberSelected MuiTypography-body1"]';

export const timePickerOKButton =
    'div[class^="MuiDialogActions-root"] button[class^="MuiButton-root"]:has-text("OK")';

export const timePickerOKButtonV2 =
    '[aria-label="DatePickerHF__dialog"] [role="dialog"] button >> text=OK';

export const teacherAutocomplete = '[data-testid="AutocompleteTeachersHF__autocomplete"]';

export const teacherAutocompleteInput = `${teacherAutocomplete} input[data-testid="AutocompleteBase__input"]`;

export const teacherAutocompleteTagBox = `${teacherAutocomplete} [data-testid="AutocompleteBase__tagBox"]`;

export const teacherAutocompleteTagBoxWithTeacherName = (teacherName: string) =>
    `${teacherAutocomplete} [data-testid="AutocompleteBase__tagBox"]:has-text("${teacherName}")`;

export const locationsLowestLevelAutocomplete =
    '[data-testid="AutocompleteLocationLowestLevelHF__autocomplete"]';

export const contentLocationsLowestLevelAutocomplete = `${locationsLowestLevelAutocomplete} > div > div > input`;

export const locationsLowestLevelAutocompleteWithNth = (nth: number) =>
    `${locationsLowestLevelAutocomplete} >> nth =${nth}`;

export const locationsLowestLevelAutocompleteInput = `${locationsLowestLevelAutocomplete} input`;

export const locationsLowestLevelAutocompleteClearButton = `${locationsLowestLevelAutocomplete} button[title="Clear"]`;

export const tableAddStudentSubscription =
    '[data-testid="DialogAddStudentSubscriptions__dialogContainer"]';
export const DialogAddStudentInfo = '[data-testid="DialogAddStudentInfo__dialogContainer"]';

export const tableStudentSubscriptionAddAction =
    '[data-testid="TableStudents__action"] button[data-testid="TableAction__buttonAdd"]';

export const tableStudentSubscriptionAddActionV2 =
    '[data-testid="TableStudentsInfoWithActionsV2__actions"] button[data-testid="TableAction__buttonAdd"]';
export const tableStudentAddAction = 'button[data-testid="TableAction__buttonAdd"]';

export const dropdownAddStudent = '[data-testid=ButtonDropdownMenu__button]';
export const buttonDropdownAddStudent = '[data-value="ADD_STUDENT"]';

export const tableAddStudentSubscriptionAddButton = `${tableAddStudentSubscription} button[data-testid="FooterDialogConfirm__buttonSave"]`;
export const tableAddStudentSubscriptionAddButtonV2 = `${DialogAddStudentInfo} button[data-testid="FooterDialogConfirm__buttonSave"]`;

export const tableAddStudentAddButton = 'button[data-testid="FooterDialogConfirm__buttonSave"]';

export const tableAddStudentSubscriptionCancelButton = `${tableAddStudentSubscription} button[data-testid="FooterDialogConfirm__buttonClose"]`;

export const lessonManagementLessonSubmitButton =
    '[data-testid="DialogFullScreen__footer"] button[data-testid="LessonUpsertFooter__buttonPublish"]';

export const lessonManagementLessonSubmitDraftButton =
    '[data-testid="DialogFullScreen__footer"] button[data-testid="LessonUpsertFooter__buttonSaveDraft"]';

export const teachingMediumRadioButton = (medium: TeachingMedium) => `input[value="${medium}"]`;

export const teachingMethodRadioButton = (method: TeachingMethod) => `input[value="${method}"]`;

export const recurringSettingRadioButton = (setting: LessonSavingMethodType) =>
    `input[value="${setting}"]`;

export const lessonReportBulkAction = 'TableAction__buttonAdd';

export const lessonReportBulkActionUpsertDialog = 'DialogWithHeaderFooter_wrapper';

export const lessonReportBulkActionAutocompleteAttendanceStatus =
    'TableBulkUpdateAttendanceTable__autocompleteAttendance';

export const lessonReportBulkActionInputAttendanceStatus = `[data-testid=${lessonReportBulkActionUpsertDialog}] [data-testid=${lessonReportBulkActionAutocompleteAttendanceStatus}] ${allAutocompleteInputs}`;

export const lessonReportInputAttendanceStatus = `[data-testid=${attendanceStatusFieldContainer}] ${allAutocompleteInputs}`;

export const tabItem = '[role="tablist"] [data-testid="Tab"]';

export const lessonDetailGeneralInfo = '[data-testid="LessonDetailsGeneralInfo__root"]';

export const lessonDetailStudentsTable = '[data-testid="DetailSectionLessonStudents__root"]';

export const lessonDetailMaterialInfo = '[data-testid="LessonDetailsMaterials__root"]';

export const reportTab = '[role="tablist"] button[data-testid="Tab"] span:has-text("Report")';

export const lessonReportDetailContainer = 'div[data-testid="TabLessonReport__container"]';

export const lessonRowWithId = (lessonId: string) =>
    `tr[data-testid="TableBase__row"][data-value="${lessonId}"]`;

export const lessonsTable = '[data-testid="TableLessonsWithPaging__root"]';

export const lessonTableRow = 'tr[data-testid="TableBase__row"]';

export const lessonRowFirstInList =
    '[data-testid="TableLessonsWithPaging__root"] tbody tr:first-child';

export const lessonRowNumberInList = (number: number) =>
    `[data-testid="TableLessonsWithPaging__root"] tbody tr:nth-child(${number})`;

export const lessonLink = 'a[data-testid="TableLessonsWithPaging__lessonDate"]';
export const lessonLinkByOrder = (order: number) =>
    `a[data-testid="TableLessonsWithPaging__lessonDate"] >> nth=${order}`;

export const lessonLinkOfFirstRowOnLessonList = `${lessonRowFirstInList} ${lessonLink}`;
export const lessonLinkOfSecondRowOnLessonList = `${lessonRowNumberInList(2)} ${lessonLink}`;
export const lessonLinkOfRowOnLessonListByOrder = (nth: number) =>
    `${lessonRowNumberInList(nth)} ${lessonLink}`;

export const lessonTimeColumn = '[data-testid="TableLessonsWithPaging__lessonTime"]';

export const lessonCenterColumn = '[data-testid="TableLessonsWithPaging__center"]';

export const lessonTeacherColumn = '[data-testid="TableLessonsWithPaging__teacher"]';

export const atTheFirstLessonRowInList = (columnSelector: string) =>
    `${lessonRowFirstInList} ${columnSelector}`;

export const lessonOnListWithDataValue = (value: string) =>
    `[data-testid="TableLessonsWithPaging__root"] tr[data-value="${value}"]`;

export const lessonLinkOnLessonList = (lessonId: string) =>
    `${lessonOnListWithDataValue(lessonId)} td ${lessonLink}`;

export const autocompleteClearButton = 'button[aria-label="Clear"]';

export const viewStudyPlanButton = '[data-testid="ButtonViewStudyPlan__button"]';

export const lessonFormFilterAdvancedTextFieldInput =
    '[data-testid="FormFilterAdvanced__textField"] input[type="text"]';

export const lessonNoDataMessage = '[data-testid="NoData__message"]';

export const lessonDetailsStudentTable = '[data-testid="DetailSectionLessonStudents__table"]';

export const checkBoxOfTableRow =
    '[data-testid="TableRowWithCheckbox__checkboxRow"] input[type="checkbox"]';

export const checkBoxOfTableRowStudentSubscriptions =
    '[data-testid="TableStudentSubscriptions__tableContainer"] [data-testid="TableRowWithCheckbox__checkboxRow"] input[type="checkbox"]:not(:checked)';
export const checkBoxOfTableRowStudentSubscriptionsV2 =
    '[data-testid="TableStudentSubscriptionV2__tableContainer"] [data-testid="TableRowWithCheckbox__checkboxRow"] input[type="checkbox"]:not(:checked)';

export const recordStudentSubscriptionTableCheckBox = (recordId: string) =>
    `[data-testid="TableBase__row"][data-value="${recordId}"] input[type="checkbox"]`;

export const checkboxSelectAll =
    '[data-testid="TableHeaderWithCheckbox__checkboxHeader"] input[aria-label="Select all items"]';

export const tableAddStudentSubscriptionCheckboxSelectAll = `${tableAddStudentSubscription} ${checkboxSelectAll}`;

export const lessonLinkWithTab = (tab: LessonTimeValueType) =>
    `${lessonListTab(tab)} ${lessonLink}`;

export const lessonFilterAdvancedSearchInput = (tab: LessonTimeValueType) =>
    `${lessonListTab(
        tab
    )} [data-testid="FormFilterAdvanced__textField"] input[placeholder="Enter Student Name"]`;

export const selectedTabOnTabList = 'div[role="tablist"] [aria-selected="true"]';

export const alertMessageOfStartEndTime = ':text-is("Start Time must come before End Time")';

export const fieldRequireMessage = ':text-is("This field is required")';

export const alertMessageLessonCenter = `${locationsLowestLevelAutocomplete} ${fieldRequireMessage}`;

export const alertMessageLessonTeachers = `${teacherAutocomplete} ${fieldRequireMessage}`;

export const alertMessageLessonStudents = `[data-testid="TableStudents__action"] ${fieldRequireMessage}`;
export const alertMessageLessonStudentsV2 = `[data-testid="TableStudentsInfoWithActionsV2__wrapper"] ${fieldRequireMessage}`;

export const assertAlertMessageRequiredField = `[class*="Mui-error"]${fieldRequireMessage}`;

export const upsertLessonDialog = `[data-testid="LessonUpsert__dialog"]`;

export const upsertLessonForm = `[data-testid="FormLessonUpsert__root"]`;

export const previousLessonReport = '[data-testid="ButtonPreviousReport__button"]';

export const nextLessonMonth = '[data-testid="ArrowRightIcon"]';

export const previousLessonMonth = '[data-testid="ArrowLeftIcon"]';

export const studentAttendanceStatusOnLessonDetail = (attendanceValue: AttendanceStatusValues) =>
    `${lessonDetailsStudentTable} [data-testid="TableBase__row"] td p:text-is("${attendanceValue}")`;

export const previousReportButtonOnUpsertReportDialog = `${lessonManagementIndividualReportUpsertDialog} [data-testid="ButtonPreviousReport__button"]`;

export const previousReportButtonOnReportDetailPage = `${lessonReportDetailPageContainer} [data-testid="ButtonPreviousReport__button"]`;

export const doesNotHavePreviousReportMessageOnUpsertReportDialog = `${lessonManagementIndividualReportUpsertDialog} [title="Student does not have previous lesson report for this course"]`;

export const doesNotHavePreviousReportMessageOnReportDetailPage = `${lessonReportDetailPageContainer} [title="Student does not have previous lesson report for this course"]`;

export const formFilterAdvancedLessonManagement = '[data-testid="FormFilterAdvancedLesson__root"]';

export const filterAdvancedFromDate = '[data-testid="FormFilterAdvancedLesson__fromDate"]';
export const buttonOpenDatePicker = '[data-testid="DatePickerHF__openPickerButton"]';

export const filterAdvancedToDate = '[data-testid="FormFilterAdvancedLesson__toDate"]';

export const filterAdvancedLessonDayOfTheWeek =
    '[data-testid="AutocompleteDayOfWeekHF__autocomplete"]';

export const filterAdvancedStartTime = '[data-testid="FormFilterAdvancedLesson__startTime"]';

export const filterAdvancedEndTime = '[data-testid="FormFilterAdvancedLesson__endTime"]';
export const studentNameOnTableStudentSubscription =
    '[data-testid="TableLessonManagementUpsertStudentsInfo__columnStudentName"]';
export const studentNameOnDialogAddStudentTableStudentSubscription =
    '[data-testid="TableStudentSubscriptions__studentName"]';

export const teachingMediumSelected =
    '[data-testid="FormLessonUpsert__radioTeachingMedium"] input[checked]';

export const teachingMethodSelected =
    '[data-testid="FormLessonUpsert__radioTeachingMethod"] input[checked]';

export const coursesAutocompleteHF = '[data-testid="AutocompleteCoursesHF__autocomplete"]';
export const coursesAutocompleteInput = `${coursesAutocompleteHF} input`;

export const gradesAutocompleteHF = '[data-testid="GradesAutocompleteHF__autocomplete"]';
export const gradesAutocompleteInput = `${gradesAutocompleteHF} input`;

export const studentsAutocompleteHF = '[data-testid="AutocompleteStudentsHF__autocomplete"]';
export const studentsAutocompleteInput = `${studentsAutocompleteHF} input`;

export const chipAutocomplete = '[data-testid="ChipAutocomplete"]';
export const chipAutocompleteWithWrapper = (wrapper: string) => `${wrapper} ${chipAutocomplete}`;
export const chipAutoCompleteWithOption = (option: string) =>
    `${chipAutocomplete}:has-text("${option}")`;

export const autoCompleteTimeOfDayWithNth = (nth: number) =>
    `#AutocompleteTimeOfDayHF__autocomplete >> nth =${nth}`;

export const nextButtonInLessonsList = 'button[aria-label="Next page"]';

export const lessonLinkAtFirstRowInList = `${lessonRowFirstInList} ${lessonLink}`;

export const RadioButtonLessonTeachingMediumOnline =
    'span[data-testid="Radio__LESSON_TEACHING_MEDIUM_ONLINE"] input';
export const RadioButtonLessonTeachingMediumOffline =
    'span[data-testid="Radio__LESSON_TEACHING_MEDIUM_OFFLINE"] input';

export const RadioButtonLessonTeachingMethodIndividual =
    'span[data-testid="Radio__LESSON_TEACHING_METHOD_INDIVIDUAL"] input';

export const RadioButtonLessonTeachingMethodGroup =
    'span[data-testid="Radio__LESSON_TEACHING_METHOD_GROUP"] input';

export const lessonUpsertStudentAttendanceStatusInput =
    '[data-testid="DynamicFieldBase__AUTOCOMPLETE_MANA_UI__dynamicAttendanceStatus"] input';

export const lessonUpsertStudentAttendanceNoticeInput =
    '[data-testid="DynamicFieldBase__AUTOCOMPLETE_MANA_UI__dynamicAttendanceNotice"] input';

export const lessonUpsertStudentReasonInput =
    '[data-testid="DynamicFieldBase__AUTOCOMPLETE_MANA_UI__dynamicAttendanceReason"] input';

export const lessonUpsertStudentAttendanceNoteInput =
    '[data-testid="DynamicFieldBase__TEXT_FIELD__attendanceNote"] input';

export const saveDraftLessonReportButton =
    '[data-testid="FooterLessonReportUpsertIndV2__buttonSaveDraft"]';

// TODO: Remove after has 404 page on CMS
// https://manabie.atlassian.net/browse/LT-12329
export const invalidLessonLinkMessage = `p:text-is("Unable to find this lesson's information")`;

// Lesson info
export const lessonInfoLessonDate = '[data-testid="LessonDetailsGeneralInfo__lessonDate"]';
export const lessonInfoDayOfWeek = '[data-testid="LessonDetailsGeneralInfo__dayOfWeek"]';
export const lessonInfoStartTime = '[data-testid="LessonDetailsGeneralInfo__startTime"]';
export const lessonInfoEndTime = '[data-testid="LessonDetailsGeneralInfo__endTime"]';
export const lessonInfoTeachingMedium = '[data-testid="LessonDetailsGeneralInfo__teachingMedium"]';
export const lessonInfoTeachingMethod = '[data-testid="LessonDetailsGeneralInfo__teachingMethod"]';
export const lessonInfoTeachers = '[data-testid="LessonDetailsGeneralInfo__teachers"]';
export const lessonInfoLocation = '[data-testid="LessonDetailsGeneralInfo__center"]';
export const lessonInfoStudentNameColumn =
    '[data-testid="DetailSectionLessonStudents__columnStudentName"]';
export const lessonInfoGradeColumn = '[data-testid="DetailSectionLessonStudents__columnGrade"]';
export const lessonInfoCourseColumn =
    '[data-testid="DetailSectionLessonStudents__columnCourseName"]';
export const lessonInfoAttendanceStatusColumn =
    '[data-testid="DetailSectionLessonStudents__columnAttendanceStatus"]';
export const lessonInfoAttendanceClassColumn =
    '[data-testid="DetailSectionLessonStudents__columnClassName"]';
export const lessonInfoAttendanceNoticeColumn =
    '[data-testid="DetailSectionLessonStudents__colAttendanceNotice"]';
export const lessonInfoAttendanceReasonColumn =
    '[data-testid="DetailSectionLessonStudents__colAttendanceReason"]';
export const lessonInfoAttendanceNoteColumn =
    '[data-testid="DetailSectionLessonStudents__colAttendanceNote"]';
export const lessonInfoCourseNames = '[data-testid="DetailSectionLessonGeneralInfo__course"]';
export const lessonInfoClassNames = '[data-testid="DetailSectionLessonGeneralInfo__class"]';

export const lessonDetailSavingOption =
    '[data-testid="DetailSectionLessonRecurring__savingOption"]';
export const lessonDetailDuration = '[data-testid="DetailSectionLessonRecurring__repeatDuration"]';
export const lessonDetailTitle = '[data-testid="WrapperPageHeader__root"] > div > div > h6';

// Lesson Upsert V2
export const studentsAutocompleteFilterV2 = '[data-testid="FormFilterAdvancedLessonV2__students"]';
export const studentsAutocompleteFilterInputV2 = `${studentsAutocompleteFilterV2} input`;

export const teacherAutocompleteFilterV2 = '[data-testid="FormFilterAdvancedLessonV2__teachers"]';
export const teacherAutocompleteFilterInputV2 = `${teacherAutocompleteFilterV2} input`;

export const filterAdvancedFromDateV2 = '[data-testid="FormFilterAdvancedLessonV2__fromDate"]';
export const filterAdvancedToDateV2 = '[data-testid="FormFilterAdvancedLessonV2__toDate"]';

export const filterAdvancedLessonDayOfTheWeekV2 =
    '[data-testid="FormFilterAdvancedLessonV2__daysOfWeek"]';
// Lesson Upsert V3
export const lessonDateV3 = 'div[data-testid="FormLessonUpsertV3__lessonDate"] input';

export const lessonEndDateRecurringV3 = '[data-testid="FormLessonUpsertV3__lessonEndDate"]';

export const endTimeInputV3 = 'div[data-testid="FormLessonUpsertV3__lessonEndTime"] input';

export const startTimeInputV3 = 'div[data-testid="FormLessonUpsertV3__lessonStartTime"] input';

export const lessonInputLessonDateV3 =
    'div[data-testid="FormLessonUpsertV3__lessonDate"] input >> nth=1';
export const upsertLessonFormV3 = '[data-testid="FormLessonUpsertV3__root"]';
export const lessonEndDateV3 = `${lessonEndDateRecurringV3} input`;

export const lessonInputLessonEndDateV3 =
    'div[data-testid="FormLessonUpsertV3__lessonEndDate"] input >> nth=1';

export const teacherAutocompleteV3 = '[data-testid="FormLessonUpsertV3__teachers"]';
export const teacherAutocompleteInputV3 = `${teacherAutocompleteV3} input`;

export const locationsLowestLevelAutocompleteV3 = '[data-testid="FormLessonUpsertV3__location"]';
export const locationsLowestLevelAutocompleteInputV3 = `${locationsLowestLevelAutocompleteV3} input#AutocompleteLocationLowestLevelHF__autocomplete`;
export const alertMessageLessonTeachersV3 = `${teacherAutocompleteV3} ${fieldRequireMessage}`;

export const alertMessageLessonCenterV3 = `${locationsLowestLevelAutocompleteV3} ${fieldRequireMessage}`;
export const locationsAutocompleteClearButton = `${locationsLowestLevelAutocompleteV3} button[title="Clear"]`;

export const courseAutoCompleteV3 = '[data-testid="FormLessonUpsertV3__course"]';
export const courseAutoCompleteInputV3 = `${courseAutoCompleteV3} input`;

export const classAutoCompleteV3 = '[data-testid="FormLessonUpsertV3__class"]';
export const classAutoCompleteInputV3 = `${classAutoCompleteV3} input`;

// Student Page
export const editStudentButton = '[data-testid="TabStudentDetail__buttonEdit"]';

export const tabLayoutStudent = '[data-testid="TabLayout"]';

export const studentCourseUpsertTableClass = '[data-testid="StudentCourseUpsertTable__class"]';

export const tableStudentName = '[data-testid="TableColumnName__content"]';

export const formClassInfoAutoCompleteClass = '[data-testid="FormCourseInfo__autoCompleteClass"]';

export const inputAutoCompleteClass = 'input#ClassAutocompleteHF__autocomplete';

// Enum name
export enum LessonManagementLessonDetailTabNames {
    LESSON_INFO = 'Lesson Info',
    LESSON_REPORT = 'Report',
}

export enum LessonManagementListTabNames {
    FUTURE_LESSONS = 'Future Lessons',
    PAST_LESSONS = 'Past Lessons',
}

export const lessonLinkOnLessonListByOrder = (order: number, tab: LessonTimeValueType) => {
    return `${lessonListTab(tab)} ${lessonRowNumberInList(order)} ${lessonLink}`;
};

export const enum FileCSV {
    STUDENT = 'import-student',
    PARENT = 'import-parent',
    CLASS = 'import-class',
    EXT = '.csv',
    NUMBER_VALID_STUDENT = 5,
    NUMBER_INVALID_STUDENT = 1001,
}

export const editButtonLessonDetail = '[data-testid="TabLessonDetail__buttonEdit"]';
export const chipAutocompleteIconDelete = '[data-testid="ChipAutocomplete__iconDelete"]';
export const tableDeleteButton = '[data-testid="TableAction__buttonDelete"]';
export const checkBoxStudentInfoTable = `[data-testid="TableCellStudentSubscriptionV2__studentName"]`;

export const materialChipContainer = '[data-testid="ChipFileDescription"]';
export const materialChipByName = (name: string) =>
    `[data-testid="ChipFileDescription__name"] p:has-text("${name}")`;

export const materialChipByTitle = (name: string) =>
    `[data-testid="ChipFileDescription__name"] p[title="${name}"]`;

export const lessonTabInCourse = 'button[data-testid="CourseShow__lessonTab"]';
export const actionPanelTrigger = 'button[data-testid="ActionPanel__trigger"]';
export const actionPanelUploadOption = 'button[role="menuitem"][aria-label="Upload file"]';
export const actionPanelDeleteOption = 'button[role="menuitem"][aria-label="Delete"]';
export const saveButtonUploadMaterial = 'button[data-testid="BaseDialogAction__ok"]';
export const previewVideoContainer = 'video-js[aria-label="Video Player"]';
export const closePreviewVideoDialogButton = '[role="dialog"] button[aria-label="Close"]';
export const materialPDFIcon = 'svg[data-testid="FileIcon__PDF"]';
export const materialVideoIcon = 'svg[data-testid="FileIcon__video"]';
export const materialRemoveIcon = 'svg[data-testid="ChipRemoveIcon__icon"]';
export const uploadMaterialInput = '[data-testid="UploadInput"] input';

export enum LessonDetailTabs {
    LESSON_INFO = 'button[role="tab"]:has-text("Lesson Info")',
    LESSON_REPORT = 'button[role="tab"]:has-text("Report")',
}

export enum LessonListTabs {
    FUTURE_LESSONS = 'button[role="tab"]:has-text("Future Lessons")',
    PAST_LESSONS = 'button[role="tab"]:has-text("Past Lessons")',
}

export enum GroupLessonReportTabs {
    PERFORMANCE = 'button[data-testid="ToggleButtonBase"]:has-text("Performance")',
    REMARK = 'button[data-testid="ToggleButtonBase"]:has-text("Remark")',
}

export const autocompleteOptionList = 'ul[role="listbox"]';

export const autocompleteOptionByLabel = (label: string) =>
    `li[role="option"]:has-text("${label}")`;

export const autocompleteOptionByDataValue = (label: string) =>
    `li[role="option"][data-value="${label}"]`;

export const autocompleteInputValue = (value: string) => `input[value="${value}"]`;

export const saveDraftIndividualReportButton =
    'button[data-testid="FooterLessonReportUpsertIndV2__buttonSaveDraft"]';

export const submitGroupReportButton =
    'button[data-testid="LessonReportUpsertFooterGrp__buttonSubmitAll"]';

export const saveDraftGroupReportButton =
    'button[data-testid="LessonReportUpsertFooterGrp__buttonSaveDraft"]';

export const submitIndReportButton =
    'button[data-testid="FooterLessonReportUpsertIndV2__buttonSubmitAll"]';

export const confirmSubmitGroupReportButton =
    '[data-testid="DialogConfirmSubmitLessonReport__dialog"] button[aria-label="Submit"]';

export const cancelSubmitGroupReportButton =
    '[data-testid="DialogConfirmSubmitLessonReport__dialog"] button[aria-label="Cancel"]';

export const confirmSubmitIndReportButton = '[data-testid="FooterDialogConfirm__buttonSave"]';
export const cancelSubmitIndReportButton = '[data-testid="FooterDialogConfirm__buttonClose"]';

export const doubleDashValue = 'p:text-is("--")';
export const valuableFieldLessonReport =
    'div[data-testid="DetailSectionReportInfoIndV2__valuableElement"]';

export const autocompleteInput = 'input[role="combobox"]';
export const appBarProfileButton = 'button[data-testid="Appbar__profileButton"]';
export const locationSettingDialog = '[data-testid="DialogLocationSelectOnNav__dialog"]';
export const locationSettingOption = '[role="menuitem"][data-testid="UserMenu__setting"]';
export const locationSettingCheckboxById = (locationId: string) =>
    `[data-testid="CheckBoxLocation__${locationId}"]`;

export const lessonInfoPageContainer = '[data-testid="TabLessonDetail__container"]';
export const createLessonReportButton = '[data-testid="LessonDetail__createReportButton"]';
export const selectIconGroupLessonReport = (label: string) =>
    `div[aria-haspopup="listbox"] div:has-text("${label}")`;

export const groupLessonReportFormContainer =
    '[data-testid="FormLessonReportGrp__containerSections"]';

export const buttonPreviousLessonReportInd = '[data-testid="ButtonPreviousReportIndV2__button"]';

export const listStudentItemButton = '[role="button"][data-testid="ListStudent__listItem"]';
export const dialogWithHeaderFooterWrapper = '[data-testid="DialogWithHeaderFooter_wrapper"]';
export const dialogWithHeaderFooterTitle = '[data-testid="DialogWithHeaderFooter__dialogTitle"]';

export const buttonEditIndReport = '[data-testid="DetailSectionReportHeaderInd__buttonEdit"]';

export const buttonEditGrpReport = '[data-testid="DetailSectionReportHeaderInd__buttonEdit"]';
// Button edit group report has data test id = ind is a mistake in Front End, will update when FE update

export const upsertDialogLessonReportInd = '[data-testid="LessonReportUpsertInd__dialog"]';

export const duplicateLessonMenuItemSelector =
    '[role="menuitem"][data-value="duplicate"][aria-label="Duplicate"]';
export const addLessonDialogTitleSelector =
    '[data-testid="DialogFullScreen__dialogTitle"]:has-text("Add Lesson")';
export const aliasLessonIdList = 'aliasLessonIdList';

export const tableValueGroupReport = '[data-testid="DynamicFieldValueBase__nonLabel"]';
export const textAreaValueGroupReport =
    '[data-testid="DynamicFieldValueBase__TEXT_FIELD_AREA__value"]';

export const tableActionFormLessonReportInd = '[data-testid="FormLessonReportInd__tableAction"]';

export const buttonSaveDraftLessonReportGrp =
    'button[data-testid="LessonReportUpsertFooterGrp__buttonSaveDraft"]';

export const buttonPreviousLessonReportGrp = '[data-testid="ButtonPreviousReportGroup__button"]';
export const dynamicTableStudentName = '[data-testid="TableStudentWithDynamicValues__studentName"]';

export const dialogDeleteLesson = '[data-testid="DialogDeleteLesson__dialog"]';
export const noResultIcon = '[data-testid="NoResultPage__emptyIcon"]';

export const closeIcon = '[data-testid="CloseIcon"]';

export const getAutocompleteInput = (dataTestId: string) => {
    return `${dataTestId} input`;
};

export const autocompleteAttendanceStatus =
    '[data-testid="DynamicFieldAttendanceStatus__autocomplete__attendance_status"]';

export const tableLessonStatus = '[data-testid="HeaderLessonDetailWithAction__chipLessonStatus"]';
