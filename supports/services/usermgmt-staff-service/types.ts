import ServiceBase from '../base';
import NsUsermgmtStaffModifierService from './request-types';
import {
    CreateStaffRequest,
    CreateStaffResponse,
    UpdateStaffRequest,
    UpdateStaffResponse,
} from 'manabuf/usermgmt/v2/users_pb';

export interface IUsermgmtStaffModifierService extends ServiceBase {
    /**
     * Creates staff using gRPC endpoint.
     * @param {string} token The user's token
     * @param {CreateStaffRequest.AsObject}  payload The staff profile to be created
     * @returns {Promise<{ request: CreateStaffRequest.AsObject, response?: CreateStaffResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    createStaff(
        token: string,
        payload: NsUsermgmtStaffModifierService.createStaffReq
    ): Promise<{
        request: CreateStaffRequest.AsObject;
        response?: CreateStaffResponse.AsObject;
    }>;

    /**
     * Creates staff using gRPC endpoint.
     * @param {string} token The user's token
     * @param {UpdateStaffRequest.AsObject} payload The staff profile to be updated
     * @returns {Promise<{ request: UpdateStaffRequest.AsObject, response?: UpdateStaffResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    updateStaff(
        token: string,
        payload: NsUsermgmtStaffModifierService.updateStaffReq
    ): Promise<{
        request: UpdateStaffRequest.AsObject;
        response?: UpdateStaffResponse.AsObject;
    }>;
}
