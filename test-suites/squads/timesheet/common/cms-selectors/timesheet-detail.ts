import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import {
    tableBaseRow,
    actionPanelMenuList,
} from 'test-suites/squads/timesheet/common/cms-selectors/common';

// action panel
export const submitTimesheetButton = `${actionPanelMenuList} [aria-label="Submit"]`;
export const approveTimesheetButton = `${actionPanelMenuList} [aria-label="Approve"]`;
export const cancelSubmissionTimesheetButton = `${actionPanelMenuList} [aria-label="Cancel Submission"]`;
export const cancelApprovalTimesheetButton = `${actionPanelMenuList} [aria-label="Cancel Approval"]`;
export const editTimesheetButton = `${actionPanelMenuList} [aria-label="Edit"]`;
export const deleteTimesheetButton = `${actionPanelMenuList} [aria-label="Delete"]`;

// general info section
export const generalInfoSection = getTestId('GeneralInfoSection__generalInfo');
export const staffName = `${getTestId('GeneralInfoSection__generalStaffNameValue')} p`;
export const staffEmail = `${getTestId('GeneralInfoSection__generalStaffEmailValue')} p`;
export const locationName = `${getTestId('GeneralInfoSection__generalTimesheetLocationValue')} p`;
export const generalInfoDate = `${getTestId('GeneralInfoSection__generalTimesheetDateValue')} p`;
export const timesheetStatusChip = getTestId('TimesheetStatusChip');

// other working hours section
const otherWorkingHoursTable = getTestId('OtherWorkingHourTable__table');
export const otherWorkingHoursTableBaseRow = `${otherWorkingHoursTable} ${tableBaseRow}`;
export const workingType = getTestId('OtherWorkingHourTable__workingType');
export const timeRange = getTestId('OtherWorkingHourTable__timeRange');
export const totalHours = getTestId('OtherWorkingHourTable__totalHours');
export const otherWorkingHourRemarks = getTestId('OtherWorkingHourTable__remarks');

// transportation expenses section
const transportationExpensesTable = getTestId('TransportationExpensesTable__root');
export const transportationExpensesTableBaseRow = `${transportationExpensesTable} ${tableBaseRow}`;
export const transportationType = getTestId('TransportationExpensesTable__transportationType');
export const transportationFrom = getTestId('TransportationExpensesTable__transportationFrom');
export const transportationTo = getTestId('TransportationExpensesTable__transportationTo');
export const amount = getTestId('TransportationExpensesTable__amount');
export const roundTrip = getTestId('TransportationExpensesTable__roundTrip');
export const transportationExpenseRemarks = getTestId('TransportationExpensesTable__remarks');

// remarks section
export const remarks = `${getTestId('RemarkSection__remarkItem')} p`;

// lesson hours section
export const lessonHoursTable = `table${getTestId('LessonHoursTable__table')}`;
