import { getTestId, tableBaseRow } from '@legacy-step-definitions/cms-selectors/cms-keys';

export const location = getTestId('TransportationExpenseConfigTable__location');
export const transportationType = getTestId('TransportationExpenseConfigTable__transportationType');
export const transportationFrom = getTestId('TransportationExpenseConfigTable__transportationFrom');
export const transportationTo = getTestId('TransportationExpenseConfigTable__transportationTo');
export const amount = getTestId('TransportationExpenseConfigTable__amount');
export const roundTrip = getTestId('TransportationExpenseConfigTable__roundTrip');
export const transportationExpenseRemarks = getTestId('TransportationExpenseConfigTable__remarks');
export const staffTransportationExpenseTableRow = `${getTestId(
    'TransportationExpenseConfigTable__root'
)} ${tableBaseRow}`;
