import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { datePickerInput } from 'test-suites/squads/timesheet/common/cms-selectors/common';

// navbar
export const locationConfirmButton = getTestId('LocationListNavbar__buttonConfirm');

// table
export const locationConfirmationStatusCell = getTestId(
    'ConfirmerLocationsList__locationConfirmationStatus'
);
export const locationNameCell = getTestId('ConfirmerLocationsList__locationName');

// date filter
export const locationsFromDateFilter = `${getTestId(
    'LocationListFilterForm__fromDate'
)} ${datePickerInput}`;
export const locationsToDateFilter = `${getTestId(
    'LocationListFilterForm__toDate'
)} ${datePickerInput}`;
