import ServiceBase from '../base';
import NsUsermgmtUserGroupModifierService from './request-types';
import {
    CreateUserGroupRequest,
    CreateUserGroupResponse,
    UpdateUserGroupRequest,
    UpdateUserGroupResponse,
} from 'manabuf/usermgmt/v2/user_groups_pb';

export interface IUsermgmtUserGroupModifierService extends ServiceBase {
    /**
     * Creates UserGroup using gRPC endpoint.
     * @param {string} token The user's token
     * @param {CreateUserGroupRequest.AsObject}  payload The UserGroup payload to be created
     * @returns {Promise<{ request: CreateUserGroupRequest.AsObject, response?: CreateUserGroupResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    createUserGroup(
        token: string,
        payload: NsUsermgmtUserGroupModifierService.createUserGroupReq
    ): Promise<{
        request: CreateUserGroupRequest.AsObject;
        response?: CreateUserGroupResponse.AsObject;
    }>;

    /**
     * Creates UserGroup using gRPC endpoint.
     * @param {string} token The user's token
     * @param {UpdateUserGroupRequest.AsObject} payload The UserGroup payload to be updated
     * @returns {Promise<{ request: UpdateUserGroupRequest.AsObject, response?: UpdateUserGroupResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    updateUserGroup(
        token: string,
        payload: NsUsermgmtUserGroupModifierService.updateUserGroupReq
    ): Promise<{
        request: UpdateUserGroupRequest.AsObject;
        response?: UpdateUserGroupResponse.AsObject;
    }>;
}
