import { CreateStaffRequest, UpdateStaffRequest } from 'manabuf/usermgmt/v2/users_pb';

declare namespace NsUsermgmtStaffModifierService {
    export interface createStaffReq
        extends Omit<CreateStaffRequest.StaffProfile.AsObject, 'staffPhoneNumberList'> {
        primaryPhoneNumber: string;
        secondaryPhoneNumber: string;
    }

    export interface updateStaffReq extends UpdateStaffRequest.StaffProfile.AsObject {}
}

export default NsUsermgmtStaffModifierService;
