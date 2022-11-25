import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import {
    actionPanelMenuList,
    datePickerInput,
    getTestIdWithAutocompleteInput,
} from 'test-suites/squads/timesheet/common/cms-selectors/common';

// navbar
export const staffCreateTimesheetBtn = getTestId('StaffTimesheetListNavbar__addButton');
export const adminCreateTimesheetBtn = `${actionPanelMenuList} button[aria-label='Create']`;

// general info section
export const staffAutocompleteInput = getTestIdWithAutocompleteInput(
    'StaffAutocomplete__autocomplete'
);

export const locationAutocompleteInput = getTestIdWithAutocompleteInput(
    'TimesheetLocationAutocomplete__autocomplete'
);
const generalInfoDate = getTestId('GeneralInfoFormSection__timesheetDate');
export const generalInfoDateInput = `${generalInfoDate} ${datePickerInput}`;

// other working hours section
const otherWorkingHoursFormSection = getTestId('OtherWorkingHoursFormSection__root');
export const otherWorkingHoursAddBtn = `${otherWorkingHoursFormSection} button${getTestId(
    'OtherWorkingHoursFormSection__addButton'
)}`;
export const workingTypeAutocompleteInput = getTestIdWithAutocompleteInput(
    'OtherWorkingHoursUpsertTable__workingType'
);
export const startTimeAutocompleteInput = getTestIdWithAutocompleteInput(
    'OtherWorkingHoursUpsertTable__startTime'
);
export const endTimeAutocompleteInput = getTestIdWithAutocompleteInput(
    'OtherWorkingHoursUpsertTable__endTime'
);
export const otherWorkingHoursRemarksInput = getTestId('OtherWorkingHoursUpsertTable__remarkInput');

// transportation expenses section
const transportationExpensesFormSection = getTestId('TransportationExpensesFormSection__root');
export const transportationExpensesAddBtn = `${transportationExpensesFormSection} button${getTestId(
    'TransportationExpensesFormSection__addButton'
)}`;
export const transportationTypeAutocompleteInput = getTestIdWithAutocompleteInput(
    'TransportationExpensesUpsertTable__transportationType'
);

export const autocompleteTransportationTypeWithNth = (nth: number) =>
    `${transportationTypeAutocompleteInput} >> nth =${nth}`;

export const transportationFromInput = `input${getTestId(
    'TransportationExpensesUpsertTable__transportationFromInput'
)}`;
export const transportationToInput = `input${getTestId(
    'TransportationExpensesUpsertTable__transportationToInput'
)}`;
export const amountInput = `input${getTestId('TransportationExpensesUpsertTable__amountInput')}`;
export const roundTripAutocompleteInput = getTestIdWithAutocompleteInput(
    'TransportationExpensesUpsertTable__roundTrip'
);
export const transportationExpensesRemarksInput = getTestId(
    'TransportationExpensesUpsertTable__remarksInput'
);

// remarks section
const remarksFormSection = getTestId('RemarkFormSection__root');
export const timesheetRemarksInput = `${remarksFormSection} textarea${getTestId(
    'RemarkFormSection__remarkInput'
)}`;
