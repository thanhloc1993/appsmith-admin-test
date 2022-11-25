import { callGRPC } from '../grpc/grpc';
import { createStaffReq, updateStaffReq } from './request';
import NsUsermgmtStaffModifierService from './request-types';
import { IUsermgmtStaffModifierService } from './types';
import {
    CreateStaffRequest,
    CreateStaffResponse,
    UpdateStaffRequest,
    UpdateStaffResponse,
} from 'manabuf/usermgmt/v2/users_pb';

export class UsermgmtStaffModifierService implements IUsermgmtStaffModifierService {
    readonly serviceName = 'usermgmt.v2.StaffService';

    async createStaff(token: string, payload: NsUsermgmtStaffModifierService.createStaffReq) {
        const request = createStaffReq(payload);

        const response = await callGRPC<CreateStaffRequest, CreateStaffResponse>({
            serviceName: this.serviceName,
            methodName: 'CreateStaff',
            request,
            token,
            requestType: CreateStaffRequest,
            responseType: CreateStaffResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
    async updateStaff(token: string, payload: NsUsermgmtStaffModifierService.updateStaffReq) {
        const request = updateStaffReq(payload);

        const response = await callGRPC<UpdateStaffRequest, UpdateStaffResponse>({
            serviceName: this.serviceName,
            methodName: 'UpdateStaff',
            request,
            token,
            requestType: UpdateStaffRequest,
            responseType: UpdateStaffResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
}
