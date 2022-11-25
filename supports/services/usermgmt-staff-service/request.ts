import { toTimestampNewProto } from '../common/request';
import NsUsermgmtStaffModifierService from './request-types';
import {
    CreateStaffRequest,
    StaffPhoneNumber,
    StaffPhoneNumberType,
    UpdateStaffRequest,
} from 'manabuf/usermgmt/v2/users_pb';

export function createStaffReq(data: NsUsermgmtStaffModifierService.createStaffReq) {
    const staffProfile = new CreateStaffRequest.StaffProfile();
    const staffReq = new CreateStaffRequest();

    const {
        name,
        organizationId,
        userGroup,
        country,
        phoneNumber,
        email,
        avatar,
        userGroupIdsList,
        locationIdsList,
        birthday,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        workingStatus,
        startDate,
        endDate,
        remarks,
    } = data;

    const staffNumberList = convertCreateStaffPhoneNumberList(
        primaryPhoneNumber,
        secondaryPhoneNumber
    );

    staffProfile.setName(name);
    staffProfile.setEmail(email);
    staffProfile.setAvatar(avatar);
    staffProfile.setPhoneNumber(phoneNumber);
    staffProfile.setCountry(country);
    staffProfile.setUserGroup(userGroup);
    staffProfile.setOrganizationId(organizationId);
    staffProfile.setUserGroupIdsList(userGroupIdsList);
    staffProfile.setLocationIdsList(locationIdsList);
    staffProfile.setStaffPhoneNumberList(staffNumberList);
    staffProfile.setBirthday(toTimestampNewProto(birthday));
    staffProfile.setWorkingStatus(workingStatus);
    staffProfile.setStartDate(toTimestampNewProto(startDate));
    staffProfile.setEndDate(toTimestampNewProto(endDate));
    staffProfile.setRemarks(remarks);

    staffReq.setStaff(staffProfile);

    return staffReq;
}

function convertCreateStaffPhoneNumberList(
    primaryPhoneNumber: string,
    secondaryPhoneNumber: string
) {
    const staffPhoneNumberList = [];
    if (primaryPhoneNumber) {
        const staffPrimaryPhoneNumber = new StaffPhoneNumber();
        staffPrimaryPhoneNumber.setPhoneNumber(primaryPhoneNumber);
        staffPrimaryPhoneNumber.setPhoneNumberType(StaffPhoneNumberType.STAFF_PRIMARY_PHONE_NUMBER);

        staffPhoneNumberList.push(staffPrimaryPhoneNumber);
    }

    if (secondaryPhoneNumber) {
        const staffSecondaryPhoneNumber = new StaffPhoneNumber();
        staffSecondaryPhoneNumber.setPhoneNumber(secondaryPhoneNumber);
        staffSecondaryPhoneNumber.setPhoneNumberType(
            StaffPhoneNumberType.STAFF_SECONDARY_PHONE_NUMBER
        );
        staffPhoneNumberList.push(staffSecondaryPhoneNumber);
    }

    return staffPhoneNumberList;
}

export function updateStaffReq(data: NsUsermgmtStaffModifierService.updateStaffReq) {
    const staffProfile = new UpdateStaffRequest.StaffProfile();
    const staffReq = new UpdateStaffRequest();

    const { staffId, name, email, userGroupIdsList, locationIdsList } = data;

    staffProfile.setStaffId(staffId);
    staffProfile.setName(name);
    staffProfile.setEmail(email);
    staffProfile.setUserGroupIdsList(userGroupIdsList);
    staffProfile.setLocationIdsList(locationIdsList);

    staffReq.setStaff(staffProfile);

    return staffReq;
}
