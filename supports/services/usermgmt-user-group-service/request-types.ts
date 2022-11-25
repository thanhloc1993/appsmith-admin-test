import { CreateUserGroupRequest, UpdateUserGroupRequest } from 'manabuf/usermgmt/v2/user_groups_pb';

declare namespace NsUsermgmtUserGroupModifierService {
    export interface createUserGroupReq extends CreateUserGroupRequest.AsObject {}

    export interface updateUserGroupReq extends UpdateUserGroupRequest.AsObject {}
}

export default NsUsermgmtUserGroupModifierService;
