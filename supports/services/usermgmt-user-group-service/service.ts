import { callGRPC } from '../grpc/grpc';
import { createUserGroupReq, updateUserGroupReq } from './request';
import NsUsermgmtUserGroupModifierService from './request-types';
import { IUsermgmtUserGroupModifierService } from './types';
import {
    CreateUserGroupRequest,
    CreateUserGroupResponse,
    UpdateUserGroupRequest,
    UpdateUserGroupResponse,
} from 'manabuf/usermgmt/v2/user_groups_pb';

export class UsermgmtUserGroupModifierService implements IUsermgmtUserGroupModifierService {
    readonly serviceName = 'usermgmt.v2.UserGroupMgmtService';

    async createUserGroup(
        token: string,
        payload: NsUsermgmtUserGroupModifierService.createUserGroupReq
    ) {
        const request = createUserGroupReq(payload);

        const response = await callGRPC<CreateUserGroupRequest, CreateUserGroupResponse>({
            serviceName: this.serviceName,
            methodName: 'CreateUserGroup',
            request,
            token,
            requestType: CreateUserGroupRequest,
            responseType: CreateUserGroupResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
    async updateUserGroup(
        token: string,
        payload: NsUsermgmtUserGroupModifierService.updateUserGroupReq
    ) {
        const request = updateUserGroupReq(payload);

        const response = await callGRPC<UpdateUserGroupRequest, UpdateUserGroupResponse>({
            serviceName: this.serviceName,
            methodName: 'UpdateUserGroup',
            request,
            token,
            requestType: UpdateUserGroupRequest,
            responseType: UpdateUserGroupResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
}
