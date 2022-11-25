import {
    StaffListItemInformation,
    StaffListHasuraResponseType,
    StaffLocationsHasuraResponseType,
    StaffUserGroupsHasuraResponseType,
} from '@user-common/types/staff';

import groupBy from 'lodash/groupBy';

export function parseStaffListData(
    staffList: StaffListHasuraResponseType[],
    staffLocationList: StaffLocationsHasuraResponseType[],
    staffUserGroupList: StaffUserGroupsHasuraResponseType[]
): StaffListItemInformation[] {
    const groupedLocationsByUserId = Object.entries(groupBy(staffLocationList, 'user_id')).map(
        ([user_id, groupedData]) => ({
            user_id,
            locations: groupedData.map((grouped) => grouped.location),
        })
    );
    const mapStaffLocations = new Map<string, any>();
    groupedLocationsByUserId.forEach((data) => {
        mapStaffLocations.set(data.user_id, data.locations);
    });

    const groupedUserGroupsByUserId = Object.entries(groupBy(staffUserGroupList, 'user_id')).map(
        ([user_id, groupedData]) => ({
            user_id,
            user_groups: groupedData.map((grouped) => grouped.user_group),
        })
    );
    const mapStaffUserGroups = new Map<string, any>();
    groupedUserGroupsByUserId.forEach((data) => {
        mapStaffUserGroups.set(data.user_id, data.user_groups);
    });
    const result: StaffListItemInformation[] = staffList.map((staffData) => {
        const { staff, ...otherData } = staffData;
        const locations = mapStaffLocations.get(staff.staff_id) ?? [];
        const user_groups = mapStaffUserGroups.get(staff.staff_id) ?? [];
        return {
            ...staff,
            ...otherData,
            locations,
            user_groups,
        };
    });

    return result;
}
