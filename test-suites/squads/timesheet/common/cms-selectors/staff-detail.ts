import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import {
    confirmDialogButtonSave,
    getTestIdWithAutocompleteInput,
} from 'test-suites/squads/timesheet/common/cms-selectors/common';

export const editStaffButton = getTestId('TabStaffDetail__buttonEdit');
export const locationInput = getTestIdWithAutocompleteInput('LocationSelectInputHF');
export const itemLocationContainer = getTestId('ItemLocation__container');
export const saveLocationButton = `${getTestId('DialogTreeLocations')} ${confirmDialogButtonSave}`;
export const locationLabel = getTestId('ItemLocation__label');
