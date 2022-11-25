import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

export const staffFilterAdvancedFromDateInput = `${getTestId(
    'StaffTimesheetListFilterForm__fromDate'
)} input[type="text"]`;
export const staffFilterAdvancedToDateInput = `${getTestId(
    'StaffTimesheetListFilterForm__toDate'
)} input[type="text"]`;
export const staffTimesheetDateLink = getTestId('StaffTimesheetListTable__timesheetDate');
export const staffTimesheetLocation = getTestId('StaffTimesheetListTable__timesheetLocation');
export const timesheetLocation = getTestId('AdminTimesheetListTable__timesheetLocation');

export const staffFilterAdvancedFromDate = getTestId('StaffTimesheetListFilterForm__fromDate');
export const staffFilterAdvancedToDate = getTestId('StaffTimesheetListFilterForm__toDate');
export const lessonHoursTimeRange = getTestId('LessonHoursTable__timeRange');
export const staffNumberOfLessons = getTestId('StaffTimesheetListTable__numberOfLessons');
export const numberOfLessons = getTestId('AdminTimesheetListTable__numberOfLessons');
export const timesheetStatusTabAll = getTestId('TimesheetStatusTab__ALL');
export const timesheetStatusTabDraft = getTestId('TimesheetStatusTab__TIMESHEET_STATUS_DRAFT');
export const timesheetStatusTabSubmitted = getTestId(
    'TimesheetStatusTab__TIMESHEET_STATUS_SUBMITTED'
);
export const timesheetStatusTabApproved = getTestId(
    'TimesheetStatusTab__TIMESHEET_STATUS_APPROVED'
);
export const timesheetStatusTabConfirmed = getTestId(
    'TimesheetStatusTab__TIMESHEET_STATUS_CONFIRMED'
);
export const formFilterAdvancedTextFieldInput = `${getTestId(
    'FormFilterAdvanced__textField'
)} input[type="text"]`;

export const filterAdvancedFromDate = getTestId('AdminTimesheetListFilterForm__fromDate');
export const filterAdvancedToDate = getTestId('AdminTimesheetListFilterForm__toDate');
export const filterAdvancedFromDateInput = `${getTestId(
    'AdminTimesheetListFilterForm__fromDate'
)} input[type="text"]`;
export const filterAdvancedToDateInput = `${getTestId(
    'AdminTimesheetListFilterForm__toDate'
)} input[type="text"]`;
export const staffTimesheetStatusCell = getTestId('StaffTimesheetListTable__timesheetStatus');

export const dateFilterChip = getTestId('FormFilterAdvancedChipList__chipItem');
export const timesheetDateLink = getTestId('AdminTimesheetListTable__timesheetDate');
export const timesheetStatusCell = getTestId('AdminTimesheetListTable__timesheetStatus');
export const timesheetStaffNameCell = getTestId('AdminTimesheetListTable__timesheetStaffName');
export const noDataIcon = getTestId('LookingFor__icon');

export const approveButton = getTestId('AdminTimesheetListNavbar__buttonApprove');
export const checkBoxTableRow = getTestId('TableRowWithCheckbox__checkboxRow');
