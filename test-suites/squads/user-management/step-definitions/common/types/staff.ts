import { GenderType } from './student';
import { StaffWorkingStatus } from 'manabuf/usermgmt/v2/users_pb';

export interface StaffListHasuraResponseType {
    email: string;
    name: string;
    resource_path: string;
    staff: {
        staff_id: string;
        working_status: StaffWorkingStatusType;
    };
}

export interface StaffLocationsHasuraResponseType {
    user_id: string;
    location: {
        access_path: string;
        is_archived: boolean;
        location_id: string;
        location_type: string;
        name: string;
        parent_location_id: string;
    };
}

export interface StaffUserGroupsHasuraResponseType {
    user_id: string;
    user_group: {
        user_group_id: string;
        user_group_name: string;
    };
}

interface StaffLocation {
    location_id: string;
    name: string;
}
interface StaffUserGroup {
    user_group_id: string;
    user_group_name: string;
}

export interface StaffListItemInformation {
    staff_id: string;
    working_status: StaffWorkingStatusType;
    email: string;
    name: string;
    resource_path: string;
    locations?: StaffLocation[];
    user_groups?: StaffUserGroup[];
}

export type StaffWorkingStatusType = keyof typeof StaffWorkingStatus;

export enum StaffWorkingStatusText {
    AVAILABLE = 'Available',
    RESIGNED = 'Resigned',
    ON_LEAVE = 'On Leave',
}

export type UpsertStaffConditionType =
    | 'only mandatory inputs'
    | 'all valid inputs'
    | 'empty name'
    | 'empty email'
    | 'empty location'
    | 'invalid email format'
    | 'existed email'
    | 'invalid phone number format'
    | 'duplicate phone number';

export type UpsertStaffErrorMessage =
    | 'This field is required'
    | 'Email address is not valid'
    | 'Email address already exists'
    | 'Phone number is not valid'
    | 'Duplicate phone number';

export type WorkingStatusType = 'Available' | 'Resigned' | 'On Leave';

export interface StaffInfo {
    name: string;
    email: string;
    primaryPhoneNumber: string;
    secondaryPhoneNumber: string;
    birthday: Date | null;
    gender: GenderType;
    location: string[];
    userGroup: string[];
    workingStatus: WorkingStatusType;
    startDate: Date | null;
    endDate: Date | null;
    remarks: string;
}
