import { getTestId } from '@user-common/helper/get-key';

import { tableBaseRow } from './students-page';

// Student detail page
export const buttonEdit = `button[data-value="edit"]`;
export const buttonRemove = `button[data-value="remove"]`;
export const buttonAddParentStudent = `[data-testid="TableParents__action"] [data-testid="TableAction__buttonAdd"]`;
export const buttonSearchParentStudent = `[data-testid="TableAction__buttonSearch"] `;
export const buttonReIssuePassword = `button[data-value="reIssuePassword"]`;

export const buttonSaveAddParent = `[data-testid="FooterDialogConfirm__buttonSave"][aria-label="Add"]`;
export const buttonSaveEditStudent = `[data-testid="FooterDialogConfirm__buttonSave"][aria-label="Save"]`;
export const buttonSaveSearchParent = `[data-testid="DialogSearchParent__root"] [data-testid="FooterDialogConfirm__buttonSave"]`;

export const addParentOption = (option: string) => `[role="menuitem"][data-value=${option}]`;

// Form popup add parent - Edit page
export const parentTableSelector = `[data-testid="StudentTableParent__root"]`;
export const parentTableRowSelector = `[data-testid="StudentTableParent__root"] ${tableBaseRow}`;
export const parentTableEditButtonSelector = `[data-testid="FormTableParents__buttonEdit"]`;

export const parentTableEmailSelector = `[data-testid="TableParent__email"]`;
export const parentTablePhoneSelector = `[data-testid="TableParent__phone"]`;
export const parentTableRelationshipSelector = `[data-testid="TableParent__relationship"]`;
export const studentNameSelector = `[data-testid="StudentGeneralInfo__studentName"]`;

export const parentFormNameSelector = `[data-testid="FormParentInfo__inputName"] input`;
export const parentFormEmailSelector = `[data-testid="FormParentInfo__inputEmail"] input`;
export const parentFormRelationshipSelector = `[data-testid="FormParentInfo__selectRelationship"] > div`;

export const parentInputPasswordSelector = `[data-testid="AccountInfo__inputPassword"] input`;
export const parentInputSearchSelector = `[data-testid="ParentsAutocomplete__autoComplete"] input`;
export const studentInputNameSelector = `[data-testid="FormStudentInfo__inputName"]`;
export const studentInputFirstNameSelector = `[data-testid="FormStudentInfo__inputFirstName"]`;
export const studentInputLastNameSelector = `[data-testid="FormStudentInfo__inputLastName"]`;
export const studentInputFirstNamePhoneticSelector = `[data-testid="FormStudentInfo__inputFirstNamePhonetic"]`;
export const studentInputLastNamePhoneticSelector = `[data-testid="FormStudentInfo__inputLastNamePhonetic"]`;

export const neverLoggedInSelector = `[data-testid="ChipAutocomplete"]:has-text("Never logged in")`;
export const gradeChipAutoComplete = '[data-testid="ChipAutocomplete"]:has-text("Grade")';
export const courseChipAutoComplete = '[data-testid="ChipAutocomplete"]:has-text("Course")';
export const dialogWithHeaderFooter = `[data-testid="DialogWithHeaderFooter__dialogContent"]`;
export const filterButton = '[data-testid="ButtonDropdownWithPopover__button"]:has-text("Filter")';
export const checkboxLabelHF_isNotLogged = '[data-testid="CheckboxLabelHF_isNotLogged"]';
export const applyButton = 'button[data-testid="ButtonDropdownWithPopover__buttonApply"]';
export const inputCheckbox = 'input[type="checkbox"]';

export const rowsPerPage = '[id="TableBaseFooter__select"]';
export const rowOption = (page: string) => `[role="option"]:text("${page}")`;

export const studentTable = '[data-testid="TableStudent__table"]';
export const studentRowFirstInList = `${studentTable} tbody tr:first-child`;
export const columnOfFirstStudent = (columnSelector: string) =>
    `${studentRowFirstInList} ${columnSelector}`;
export const locationColumnOfStudent = '[data-testid="TableColumnLocation__content"]';

export const buttonDropdownWithPopoverPopover = getTestId('ButtonDropdownWithPopover__popover');
