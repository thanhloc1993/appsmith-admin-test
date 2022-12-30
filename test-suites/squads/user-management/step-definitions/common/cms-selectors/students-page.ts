import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { Meridiem } from 'test-suites/squads/adobo/step-definitions/entry-exit-utils';

/// Add student page
export const studentForm = '[data-testid="FormStudentInfo__generalInfo"]';
export const studentFormHomeAddress = getTestId('StudentHomeAddressUpsert__homeAddress');
export const studentFormPhoneNumber = getTestId('StudentPhoneNumberUpsert__phoneNumber');

export const formInputName = '[data-testid="FormStudentInfo__inputName"]';
export const formInputFirstNamePhonetic = '[data-testid="FormStudentInfo__inputFirstNamePhonetic"]';
export const formInputLastNamePhonetic = '[data-testid="FormStudentInfo__inputLastNamePhonetic"]';
export const formInputEmail = '[data-testid="FormStudentInfo__inputEmail"]';
export const formInputFirstName = '[data-testid="FormStudentInfo__inputFirstName"]';
export const formInputLastName = '[data-testid="FormStudentInfo__inputLastName"]';
export const textInputExternalStudentID = '[data-testid="FormStudentInfo__inputExternalStudentID"]';
export const textareaStudentNote = '[data-testid="FormStudentInfo__inputStudentNote"]';
export const radioGenderButton = (gender: string) => `[data-testid="Radio__${gender}"]`;
export const formInputGender = '[data-testid="FormStudentInfo__inputStudentGender"]';
export const formInputBirthday = '[data-testid="FormStudentInfo__inputStudentBirthday"]';
export const locationInput = '[data-testid="LocationSelectInputHF"]';
export const locationChips = '[data-testid="LocationSelectInputHF__tagBox"]';
export const locationChipLimitTags = '[data-testid="LocationSelectInputHF__ChipLimitTags"]';
export const gradeAutoComplete = '[data-testid="FormStudentInfo__autoCompleteGrade"]';
export const tagAutoComplete = '[data-testid="AutocompleteUserTagHF__autocomplete"]';
export const enrollmentStatusAutoComplete = '[data-testid="FormStudentInfo__autocompleteStatus"]';
export const muiComponentSelectEnrollmentStatus =
    '[id="EnrollmentStatusAutocompleteHF__autocomplete"]';
export const muiComponentSelectCountryCode = '[id="mui-component-select-countryCode"]';
export const countryItems = '[class="MuiList-root MuiMenu-list MuiList-padding"]';
export const textFieldPhoneNumber = '[data-testid="PhoneInputHF__inputPhoneNumber"]';
export const textFieldEmailRoot = '[data-testid="FormStudentInfo__inputEmailRoot"]';
export const formSelectInputLocation = '[data-testid="LocationSelectInputHF"]';
export const formInputPostalCode = getTestId('StudentHomeAddressUpsert__inputPostalCode');
export const formInputPrefectureAutocomplete = getTestId(
    'StudentHomeAddressUpsert__autoCompletePrefecture'
);
export const formInputCity = getTestId('StudentHomeAddressUpsert__inputCity');
export const formInputFirstStreet = getTestId('StudentHomeAddressUpsert__inputFirstStreet');
export const formInputSecondStreet = getTestId('StudentHomeAddressUpsert__inputSecondStreet');

// student phone number section
export const formInputStudentPhoneNumber = getTestId(
    'StudentPhoneNumberUpsert__inputStudentPhoneNumber'
);
export const formInputHomePhoneNumber = getTestId('StudentPhoneNumberUpsert__inputHomePhoneNumber');
export const formContactPreferenceAutocomplete = getTestId(
    'StudentPhoneNumberUpsert__autocompleteContactPreference'
);

export const tableParent = '[data-testid="TableParents__action"]';
export const tableParentAddButton = '[data-testid="TableAction__buttonAdd"]';
export const tableParentSearchButton = '[data-testid="TableAction__buttonSearch"]';

export const dialogWithHeaderFooterWrapper = '[data-testid="DialogWithHeaderFooter_wrapper"]';
export const dialogWithHeaderFooterTitle = 'DialogWithHeaderFooter__dialogTitle';
export const dialogWithHeaderFooterButtonExit =
    '[data-testid="DialogWithHeaderFooter__buttonExit"]';
export const dialogWithHeaderFooterButtonClose = '[data-testid="FooterDialogConfirm__buttonClose"]';
export const dialogWithHeaderFooterSubNote = '[data-testid="DialogTreeLocations__subNote"]';

export const nameName = '[name="name"]';
export const nameEmail = '[name="email"]';

export const formParentSearchSelectRelationship =
    '[data-testid="FormSearchParent__selectRelationship"]';
export const formParentSearchNewSelectRelationship =
    '[data-testid="FormUpsertParent__selectRelationship"]';
export const relationshipMenu = '[id="menu-relationship"]';
export const relationshipItems = '[role="option"]';
export const parentPrimaryPhoneNumber = '[name="parentPrimaryPhoneNumber"]';
export const parentSecondaryPhoneNumber = '[name="parentSecondaryPhoneNumber"]';
export const formSearchParentInputEmail = '[data-testid="FormSearchParent__inputEmail"]';
export const formSearchParentInputEmailReadOnly =
    '[data-testid="FormSearchParent__inputEmail"][readonly]';
export const formSearchParentNewInputEmailReadOnly =
    '[data-testid="FormUpsertParent__inputEmail"][readonly]';
export const inputReadOnly = 'input[readonly]';
export const dialogStudentInfo = '[data-testid="DialogStudentAccountInfo"]';
export const accountInfoTypeEmail = '[data-testid="AccountInfo__typoEmail"]';
export const multiInputBaseInputAdornedEnd =
    '[class*="MuiInputBase-input MuiInputBase-inputAdornedEnd"]';
export const dialogStudentAccountInfoFooterButtonClose =
    '[data-testid="DialogStudentAccountInfoFooter__buttonClose"]';

//tableBase
export const tableBaseBody = '[data-testid="TableBaseBody__root"]';
export const tableStudentRoot = '[data-testid="TableStudent__root"]';
export const tableBaseRow = `[data-testid="TableBase__row"]`;
export const tableBaseRowWithId = (id: string) =>
    `[data-testid="TableBase__row"][data-value="${id}"]`;
export const tableBaseCheckbox =
    '[data-testid="TableRowWithCheckbox__checkboxRow"] input[type="checkbox"]';
export const footerDialogConfirmButtonSave = '[data-testid="FooterDialogConfirm__buttonSave"]';

export const accountInfoInputPassword = '[data-testid="AccountInfo__inputPassword"]';
export const ariaLabelAddParent = '[aria-label="Add"]';
export const tableBaseHeader = '[data-testid="TableBase__header"]';
export const tableBaseFooter = '[data-testid="TableBaseFooter"]';
export const tableBaseFooterSelect = 'id=TableBaseFooter__select';
export const buttonNextPageTable = '[aria-label="Go to next page"]';
export const buttonPreviousPageTable = '[aria-label="Go to previous page"]';

/// Student List
export enum StudentsPageDetailTabNames {
    DETAIL = 'Detail',
    FAMILY = 'Family',
    COURSE = 'Course',
    ENTRY_EXIT = 'Entry & Exit',
}
export const tableStudent = '[data-testid="TableStudent__table"]';
export const tableStudentName = '[data-testid="TableColumnName__content"]';
export const tableStudentNameOnLessonManagement = '[data-testid="TableStudent__studentName"]';
export const tableStudentCourse = '[data-testid="TableColumnCourse__content"]';
export const tableStudentCourseOnLessonManagement = '[data-testid="TableStudent__studentCourse"]';
export const tableStudentGradeOnLessonManagement = '[data-testid="TableStudent__studentGrade"]';
export const tableStudentGrade = '[data-testid="TableColumnGrade__content"]';
export const tableStudentNameID = 'TableColumnName__content';
export const tableStudentStatus = '[data-testid="TableColumnStatus__content"]';
export const tabletStudentEmail = '[data-testid="TableColumnEmail__content"]';
export const tabletStudentCourse = '[data-testid="TableColumnCourse__content"]';
export const tabletStudentGrade = '[data-testid="TableColumnGrade__content"]';

export const tableColumnCourseLoading = '[data-testid="TableColumnCourse__loading"]';
export const tableColumnGradeLoading = '[data-testid="TableColumnGrade__loading"]';

export const tableStudentNameCell = '[data-testid="StudentTableCell__columnName"]';
export const tableStudentStatusCell = '[data-testid="StudentTableCell__columnStatus"]';
export const tableStudentEmailCell = '[data-testid="StudentTableCell__columnEmail"]';
export const tableStudentCourseCell = '[data-testid="StudentTableCell__columnCourse"]';
export const tableStudentGradeCell = '[data-testid="StudentTableCell__columnGrade"]';
export const tableStudentHomeAddressCell = '[data-testid="StudentTableCell__columnHomeAddress"]';
export const tableStudentTagCell = '[data-testid="StudentTableCell__columnTag"]';
export const tableStudentContactPreferenceCell =
    '[data-testid="StudentTableCell__columnContactPreference"]';
export const tableStudentHomeAddressLoading = '[data-testid="TableColumnHomeAddress__loading"]';
export const tableStudentContactPreferenceLoading =
    '[data-testid="TableColumnContactPreference__loading"]';
export const tableStudentSiblingCell = '[data-testid="StudentTableCell__columnSibling"]';
export const tableStudentSiblingLoading = '[data-testid="TableColumnSibling__loading"]';

export const buttonAction = '[data-testid="StyledButtonDropdown__contentButton"]';

export const buttonImportMaster = '[data-value="IMPORT"]';
export const dropdownValueItem = (value: string) => {
    return `[data-value="${value}"]`;
};
export const buttonGroupDropdown = '[data-testid="ButtonGroupDropdown"]';
export const buttonGroupDropdownPopover = '[data-testid="ButtonGroupDropdown__popover"]';
export const buttonGroupDropdownValueItem = (value: 'NORMAL_ADD' | 'IMPORT_STUDENT_CSV') => {
    return `[data-value="${value}"]`;
};

//table lesson
export const tableStudentsGradeLoading = '[data-testid="TableStudents__gradeLoading"]';

export const tabletStudentRow = (id: string) =>
    `[data-testid="TableBase__row"][data-value="${id}"]`;

/// Student Details
export const studentGeneralInfo = '[data-testid="StudentGeneralInfo__root"]';
export const studentDetailsHeader = `[data-testid="WrapperPageHeader__root"]`;
export const muiGridContainer = '[class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2"]';
export const muiGridXS8 =
    '[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-8 MuiGrid-grid-md-4 MuiGrid-grid-lg-3"]';
export const studentTableParent = '[data-testid="StudentTableParent__root"]';
export const studentDetailHomeAddress = '[data-testid="HomeAddressDetail__root"]';
export const studentDetailPhoneNumber = '[data-testid="ContactDetail__root"]';

/// Show password icon, the class attribute changes dynamically so we can't use it
export const hidePasswordIcon = '[data-testid="VisibilityOffOutlinedIcon"]';

export const classMuiTypographyBody2 = '[class="MuiTypography-root MuiTypography-body2"]';

export const parentAutoComplete = '[id="ParentsAutocomplete__autoComplete"]';

export const autoCompleteItem = (name: string) =>
    `[data-testid="AutocompleteBase__listBox"] div:has-text("${name}${name}")`;

export const ChipAutoCompleteItem = (autocomplete: string, name: string) =>
    `${autocomplete} [aria-label="${name}"]`;
export const chipAutocompleteIconDelete = '[data-testid="ChipAutocomplete__iconDelete"]';
export const chipAutocompleteIconClear = '[data-testid="CloseIcon"]';

/// Form course duration
export const formCourseInfoDatePickerStart = '[data-testid="FormCourseInfo__datePickerStart"]';
export const formCourseInfoDatePickerEnd = '[data-testid="FormCourseInfo__datePickerEnd"]';
export const formCourseInfoAutoCompleteLocation =
    '[data-testid="FormCourseInfo__autoCompleteLocation"]';
export const formCourseInfoAutoCompleteCourse =
    '[data-testid="FormCourseInfo__autoCompleteCourse"]';
export const formClassInfoAutoCompleteClass = '[data-testid="FormCourseInfo__autoCompleteClass"]';
export const calendarButton =
    '[class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary"]';
export const datePickerFooter = '[class="MuiDialogActions-root MuiDialogActions-spacing"]';
export const tableCoursesAction = '[data-testid="TableCourses__action"]';
export const locationAutoCompleteHF = '[id="LocationsAutocompleteHF__autocomplete"]';
export const tableActionButtonAdd = '[data-testid="TableAction__buttonAdd"]';
export const courseAutoCompleteHF = '[id="CoursesAutocompleteHF__autocomplete"]';
export const gradeAutoCompleteHF = '[id="GradesAutocompleteHF__autocomplete"]';
export const gradeMasterAutoCompleteHF = '[id="GradeMasterAutocompleteHF__autocomplete"]';
export const dayItemInDatePicker = (day: number) =>
    `[class="MuiIconButton-label"] p:has-text("${day}")`;
export const courseAutoCompleteHFPopUp = '[id="CoursesAutocompleteHF__autocomplete-popup"]';
export const gradeAutoCompleteHFPopUp = '[id="GradesAutocompleteHF__autocomplete-popup"]';
export const muiAutocompleteOptionNoOptions = '[class="MuiAutocomplete-noOptions"]';
export const courseListColumnName = (name: string) =>
    `[data-testid="CourseList__name"] p:has-text("${name}")`;
export const courseListColumnStartDate = (date: string) =>
    `[data-testid="CourseList__startDate"] p:has-text("${date}")`;
export const courseListColumnEndDate = (date: string) =>
    `[data-testid="CourseList__endDate"] p:has-text("${date}")`;
export const calendarFullDateField =
    'div[aria-label="DatePickerHF__dialog"] div[class*="PrivatePickersToolbar-dateTitleContainer"] [class*="MuiTypography-h4"]';
export const tableBaseNoDataMessage = '[data-testid="TableBase__noDataMessage"]';
export const studentTableCourseRoot = '[data-testid="StudentTableCourse__root"]';
export const studentDialogUpsertCourse = '[data-testid="DialogUpsertCourse"]';
export const studentTableCourseRow = `[data-testid="StudentTableCourse__root"] ${tableBaseRow}`;
export const buttonEditCourseTable = '[data-testid="FormTableCourses__buttonEdit"]';
export const formTableCourseTable = '[data-testid="FormTableCourses__table"]';
export const autocompleteLoading = '[data-testid="AutocompleteBase__loading"]';
/// Reissue
export const reissuePasswordStudentButton = 'StudentGeneralInfo__buttonReIssuePassword';
export const reissuePasswordParentButton = 'TableParent__action';
export const accountInfoDialog = 'DialogStudentAccountInfo';
export const accountEmailTypo = 'AccountInfo__typoEmail';
export const accountPassTypo = 'AccountInfo__inputPassword';

// Upsert student
export const formTableParentsTable = '[data-testid="FormTableParents__table"]';
export const formTableParentsTableWithValue = (value: string) =>
    `[data-testid="FormTableParents__table"] [data-value="${value}"]`;
export const tableWithCheckboxRow = '[data-testid="TableRowWithCheckbox__checkboxRow"]';
export const tableWithCheckboxHeader = '[data-testid="TableHeaderWithCheckbox__checkboxHeader"]';
export const treeLocationDialog = `[data-testid="DialogTreeLocations"]`;
export const locationItemInTreeLocationsDialog = (value: string) =>
    `${treeLocationDialog} [data-testid="ItemLocation__container"][data-value="${value}"]`;
export const locationItemByTypeInTreeLocationsDialog = (type: string) =>
    `${treeLocationDialog} [data-testid="ItemLocation__container"][data-type="${type}"]`;
export const selectedLocationSubNote = '[data-testid="DialogTreeLocations__subNote"]';
export const locationItemCheckbox = '[data-testid="ItemLocation__checkbox"]';
export const inputSelectLocationChipTag = '[data-testid="LocationSelectInputHF__ChipTag"]';
export const inputSelectLocationChipLimitTags =
    '[data-testid="LocationSelectInputHF__ChipLimitTags"]';
export const parentLocationLocationItem = (value: string) =>
    `[data-testid="ItemLocation__container"][data-value="${value}"][data-type="parent"]`;
export const childLocationItem = (value: string) =>
    `[data-testid="ItemLocation__container"][data-value="${value}"][data-type="child"]`;
export const parentLocationContainer = (value: string) =>
    `[data-testid="ListLocations__item"][data-value="${value}"]`;
export const childLocationInParentLocation = `[data-testid="ItemLocation__container"][data-type="child"]`;
// Search student
export const formFilterAdvancedTextFieldInput =
    '[data-testid="FormFilterAdvanced__textField"] input[type="text"]';

// Multi tenant authentication
export const loginFormRedirectLoginTenant = '[data-testid="LoginForm__redirectLoginTenant"]';
export const loginCardContent = '[data-testid="LoginCard__content"]';
export const loginTenantFormAutocompleteOrganizations =
    '[data-testid="LoginTenantForm__autocompleteOrganizations"]';
export const loginTenantFormTextFieldUsername =
    '[data-testid="LoginTenantForm__textFieldUsername"]';
export const loginTenantFormTextFieldPassword =
    '[data-testid="LoginTenantForm__textFieldPassword"]';
export const loginTenantFormTextFieldOrganizations =
    '[data-testid="LoginTenantForm__textFieldOrganizations"]';
export const organizationsAutoCompleteHF = '[id="OrganizationsAutocompleteHF__autocomplete"]';
export const loginTenantFormRedirectLoginNormal =
    '[data-testid="LoginTenantForm__redirectNormalLoginPage"]';
export const forgotPasswordTenantFormTextFieldUsername =
    '[data-testid="ForgotPasswordTenant__textFieldUsername"]';
export const forgotPasswordTenantFormTextFieldOrganizations =
    '[data-testid="ForgotPasswordTenant__textFieldOrganizations"]';
// Menu
export const menuItem = (item: string) =>
    `[data-testid="MenuItemLink__root"][aria-label="${item}"]`;
//Tab layout
export const tabLayoutStudent = '[data-testid="TabLayout"]';

//Detail tab
export const studentDetailTabList = '[data-testid="StudentDetail"] [role="tablist"]';
export const studentDetailTabs = `${studentDetailTabList} [role="tab"]`;
export const tabStudentDetailRoot = '[data-testid="TabStudentDetail__root"]';
export const editStudentButton = '[data-testid="TabStudentDetail__buttonEdit"]';
export const generalNameValue = '[data-testid="TabStudentDetail__generalNameValue"]';
export const generalPhoneticNameValue =
    '[data-testid="TabStudentDetail__generalPhoneticNameValue"]';
export const generalEmailValue = '[data-testid="TabStudentDetail__generalEmailValue"]';
export const generalPhoneNumberValue = '[data-testid="TabStudentDetail__generalPhoneNumberValue"]';
export const generalStudentIDValue = '[data-testid="TabStudentDetail__generalStudentIDValue"]';
export const generalNoteValue = '[data-testid="TabStudentDetail__generalNoteValue"]';
export const generalTagValue = '[data-testid="TabStudentDetail__generalTagValue"]';
export const generalLocationValue = '[data-testid="TabStudentDetail__generalLocationValue"]';
export const generalEnrollmentStatusValue =
    '[data-testid="TabStudentDetail__generalEnrollmentStatusValue"]';
export const generalGradeValue = '[data-testid="TabStudentDetail__generalGradeValue"]';
export const generalExternalStudentIDValue =
    '[data-testid="TabStudentDetail__generalExternalStudentIDValue"]';
export const generalExternalUserIDValue =
    '[data-testid="TabStudentDetail__generalExternalUserIDValue"]';
export const generalBirthdayValue = '[data-testid="TabStudentDetail__generalBirthdayValue"]';
export const generalGenderValue = '[data-testid="TabStudentDetail__generalGenderValue"]';
export const studentPhoneNumberValue = '[data-testid="TabStudentDetail__studentPhoneNumber"]';
export const homePhoneNumberValue = '[data-testid="TabStudentDetail__homePhoneNumber"]';
export const parentPrimaryPhoneNumberValue =
    '[data-testid="TabStudentDetail__parentPrimaryPhoneNumber"]';
export const parentSecondaryPhoneNumberValue =
    '[data-testid="TabStudentDetail__parentSecondaryPhoneNumber"]';
export const preferredContactNumberValue =
    '[data-testid="TabStudentDetail__preferredContactNumber"]';
export const homeAddressPostalCodeValue = '[data-testid="TabStudentDetail__postalCodeValue"]';
export const homeAddressPrefectureValue = '[data-testid="TabStudentDetail__prefectureValue"]';
export const homeAddressCityValue = '[data-testid="TabStudentDetail__cityValue"]';
export const homeAddressFirstStreetValue = '[data-testid="TabStudentDetail__firstStreetValue"]';
export const homeAddressSecondStreetValue = '[data-testid="TabStudentDetail__secondStreetValue"]';

// Family tab
export const textTitleFamilyInfo = 'Family Info';
export const textTabFamily = 'Family';
export const tabStudentFamilyRoot = '[data-testid="StudentFamily__root"]';
export const dataTestIdParentItem = '[data-testid="ParentItem__root"]';
export const studentParentList = '[data-testid="ParentList__root"]';
export const studentParentItem = '[data-testid="ParentItem__root"]';
export const actionPanelMenuList = '[data-testid="ActionPanel__menuList"]';
export const moreHorizIcon = '[data-testid="MoreHorizIcon"]';
export const studentParentItemColumnValue = '[data-testid="ParentItem__infoItem"]';
export const studentGeneralInfoItem = '[data-testid="TabStudentDetail__generalInfoItem"]';
export const studentParentItemWithId = (id: string) =>
    `[data-testid="ParentItem__root"][data-value="${id}"]`;
export const studentParentNoDataMessage = '[data-testid="NoData__message"]';
export const upsertParentRelationship =
    '[data-testid="FormUpsertParent__selectRelationship"] > div';
export const upsertParentEmail = '[data-testid="FormUpsertParent__inputEmail"]';
export const parentItemNameValue = '[data-testid="ParentItem__Name"]';
export const parentItemRelationshipValue = '[data-testid="ParentItem__Relationship"]';
export const parentItemPhoneNumberValue = '[data-testid="ParentItem__PhoneNumber"]';
export const parentItemEmailValue = '[data-testid="ParentItem__Email"]';
export const parentItemTagValue = '[data-testid="ParentItem__ParentTags"]';
export const siblingListTable = '[data-testid="SiblingListTable"]';
export const tableSiblingNameCell = '[data-testid="SiblingListTable__nameCell"]';
export const tableSiblingStatusCell = '[data-testid="SiblingListTable__statusCell"]';
export const tableSiblingGradeCell = '[data-testid="SiblingListTable__gradeCell"]';
export const tableSiblingLocationCell = '[data-testid="SiblingListTable__locationCell"]';
// COURSE Tab
export const studentCourseTable = '[data-testid="StudentCourseTable"]';
export const studentCourseRowWithId = (id: string) =>
    `${studentCourseTable} [data-testid="TableBase__row"][data-value="${id}"]`;
export const editCourseButton = '[data-testid="StudentCourseNavbar__btnEdit"]';
export const addNewCourseButton = '[data-testid="StudentCourseUpsert__addButton"]';
export const studentCourseUpsertTable = '[data-testid="StudentCourseUpsertTable"]';
export const upsertCourseInfoDatePickerStart =
    '[data-testid="StudentCourseUpsertTable__startDate"]';
export const upsertCourseInfoDatePickerEnd = '[data-testid="StudentCourseUpsertTable__endDate"]';
export const upsertCourseInfoDialog = '[data-testid="StudentCourseUpsert__dialog"]';
export const studentCourseTableName = '[data-testid="StudentCourseTable__name"]';
export const studentCourseTableStartDate = '[data-testid="StudentCourseTable__startDate"]';
export const studentCourseTableEndDate = '[data-testid="StudentCourseTable__endDate"]';
export const studentCourseTableLocation = '[data-testid="StudentCourseTable__location"]';
export const studentCourseTableClass = '[data-testid="StudentCourseTable__class"]';
export const studentCourseUpsertTableCourseName =
    '[data-testid="StudentCourseUpsertTable__courseName"]';
export const studentCourseUpsertTableClass = '[data-testid="StudentCourseUpsertTable__class"]';
export const studentCourseUpsertTableLocation =
    '[data-testid="StudentCourseUpsertTable__location"]';

export const muiTableCellBody = '[class="MuiTableCell-root MuiTableCell-body"]';
export const courseListName = '[data-testid="CourseList__name"]';
export const courseListStartDate = '[data-testid="CourseList__startDate"]';
export const courseListEndDate = '[data-testid="CourseList__endDate"]';
export const studentCourseUpsertDeleteAction = '[data-testid="StudentCourseUpsert__deleteAction"]';

// Entry & Exit tab
export const textTabEntryExit = 'Entry & Exit';
export const entryExitRecordsTable = '[data-testid="StudentEntryExit__table"]';
export const entryExitAddRecordButton = '[data-testid="StudentEntryExit__btnAdd"]';
export const entryDatePicker = 'div[data-testid="EntryExitRecordForm__entryDatePicker"]';
export const entryTimePicker = 'div[data-testid="EntryExitRecordForm__entryTimePicker"]';
export const exitTimePicker = 'div[data-testid="EntryExitRecordForm__exitTimePicker"]';
export const notifyParentsCheckbox = '[data-testid="CheckboxLabelHF__notifyParents"]';
export const timePickerWithValue = (value: string | number, type: 'hours' | 'minutes') =>
    `span[aria-label="${value} ${type}"]`;
export const entryExitRecordActionPanelTrigger = '[data-testid="ActionPanel__trigger"]';

export const datePickerWithValue = (value: string | number) =>
    `div[class="MuiPickersCalendar-week"] button[tabindex="0"] p:text-is("${value}")`;

export const meridiemOnTimePicker = (meridiem: Meridiem) =>
    `.Manaverse-PrivateTimePickerToolbar-ampmSelection .Manaverse-MuiButton-root span:text-is("${meridiem}")`;

export const selectedTimePicker =
    'span[class="MuiTypography-root MuiPickersClockNumber-clockNumber MuiPickersClockNumber-clockNumberSelected MuiTypography-body1"]';

export const timePickerOKButton =
    '.Manaverse-MuiDialogActions-root .Manaverse-MuiButton-root:has-text("OK")';

export const entryEarlierThanExitValidation = `p:has-text("Entry time must be earlier than exit time")`;

// user import
export const ImportUserDialog = '[data-testid="ImportUserDialog__root"]';
export const templateFileDownloadButton = '[data-testid=ImportDataDialog__buttonDownload]';

export const dialogWithHeaderFooterDialogActions = getTestId(
    'DialogWithHeaderFooter__dialogActions'
);

export const lookingForIcon = '[data-testid="LookingFor__icon"]';
