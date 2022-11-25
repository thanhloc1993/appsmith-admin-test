import { convertEnumKeys } from '@legacy-step-definitions/utils';

import { Menu } from '@supports/enum';
import { ImportLocationData } from '@supports/services/bob-import-service/types';

import { TimesheetStatus as TimesheetStatusEnum } from 'manabuf/timesheet/v1/enums_pb';
import { VALID_TIMESHEET_ROLES } from 'test-suites/squads/timesheet/common/const';

export type WorkingTypeOptions = 'Office' | 'Other';
export type TransportationTypeOptions = 'Train' | 'Bus' | 'Others';
export type RoundTripOptions = 'Yes' | 'No';
export type TimesheetPages = 'Timesheet Management' | 'Timesheet Confirmation' | 'Timesheet Detail';

export enum TimesheetKeys {
    OTHER_WORKING_HOURS = 'otherWorkingHours',
    TRANSPORTATION_EXPENSES = 'transportationExpenses',
}

export const TIMESHEET_STATUS_KEYS = convertEnumKeys(TimesheetStatusEnum);
export type TimesheetStatusType = keyof typeof TIMESHEET_STATUS_KEYS;

export type TimesheetStatus = 'Approved' | 'Submitted' | 'Draft' | 'Confirmed';

export type TimesheetStatusExtend = TimesheetStatus | 'All';

export type HyperlinkColumns = 'Date' | 'Name';
export type HyperlinkPages = 'Staff Detail' | 'Timesheet Detail';
export interface LocationData extends ImportLocationData {
    location_id: string;
}

export type ConfirmationStatus = 'Not Confirmed' | 'Confirmed';

export interface OtherWorkingHoursDataTable {
    workingType: WorkingTypeOptions;
    startTime: string;
    endTime: string;
    remarks?: string;
}

export interface TransportationExpensesDataTable {
    transportationType: TransportationTypeOptions;
    from: string;
    to: string;
    amount: string;
    roundTrip: RoundTripOptions;
    remarks?: string;
}

export interface TimesheetInfo {
    staffName: string;
    staffEmail: string;
    locationName: string;
    date: string;
    otherWorkingHours: OtherWorkingHoursDataTable[];
    transportationExpenses: TransportationExpensesDataTable[];
    remarks: string;
}

export interface UserInfo {
    username: string;
    password: string;
}

export type TimesheetUserGroup = 'requestor' | 'approver' | 'confirmer';
export type TimesheetRole = typeof VALID_TIMESHEET_ROLES[number];
export type MenuLabel = `${Menu}`;
export type LocationIndex = 'A' | 'B' | 'C' | 'D';

export type LessonStatus = 'Published' | 'Completed' | 'Cancelled';
