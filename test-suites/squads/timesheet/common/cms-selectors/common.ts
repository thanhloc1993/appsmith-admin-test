import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

export const autocompleteBaseInput = `input[role=combobox]`;

// date picker
export const datePickerInput = `input${getTestId('DatePickerHF__input')}`;

// action panel
export const actionPanelTriggerButton = getTestId('ActionPanel__trigger');
export const actionPanelMenuList = getTestId('ActionPanel__menuList');

// table
export const tableBaseRow = getTestId('TableBase__row');

export const getTestIdWithAutocompleteInput = (testId: string) =>
    `${getTestId(testId)} ${autocompleteBaseInput}`;

export const withNth = (selector: string, nth: number) => `${selector} >> nth =${nth}`;

// confirm dialog
export const confirmDialogButtonSave = getTestId('FooterDialogConfirm__buttonSave');
export const confirmDialogButtonClose = getTestId('FooterDialogConfirm__buttonClose');

export const datePickerWithValue = (value: string | number) =>
    `div[class^="Manaverse-MuiCalendarPicker-root"] button:text-is("${value}")`;

export const timePickerOKButton =
    'div[class^="Manaverse-MuiDialogActions-root"] button[class^="Manaverse-MuiButton-root"] >> text=OK';
export const filterAdvancedPopupBackdrop = `${getTestId(
    'ButtonDropdownWithPopover__popover'
)} div[class^="Manaverse-MuiBackdrop-root"]`;

export const tabLayout = getTestId('TabLayout');

export const radioEnableInput = `${getTestId('Radio__enable')} input[type=radio]`;
export const radioDisableInput = `${getTestId('Radio__disable')} input[type=radio]`;
export const actionsPanelPopupBackdrop = `${getTestId(
    'ActionPanel__popover--open'
)} div[class^="Manaverse-MuiBackdrop-root"]`;
