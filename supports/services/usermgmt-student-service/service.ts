import { callGRPC } from '../grpc/grpc';
import {
    createStudentReq,
    updateStudentReq,
    createParentReq,
    updateParentReq,
    upsertStudentCoursePackageReq,
    reissuePasswordReq,
} from './request';
import NsUsermgmtUserModifierService from './request-types';
import { IUsermgmtUserModifierService } from './types';
import {
    CreateStudentRequest,
    CreateStudentResponse,
    UpdateStudentRequest,
    UpdateStudentResponse,
    CreateParentsAndAssignToStudentRequest,
    CreateParentsAndAssignToStudentResponse,
    UpdateParentsAndFamilyRelationshipRequest,
    UpdateParentsAndFamilyRelationshipResponse,
    UpsertStudentCoursePackageRequest,
    UpsertStudentCoursePackageResponse,
    ReissueUserPasswordRequest,
    ReissueUserPasswordResponse,
} from 'manabuf/usermgmt/v2/users_pb';

export class UsermgmtUserModifierService implements IUsermgmtUserModifierService {
    readonly serviceName = 'usermgmt.v2.UserModifierService';

    async createStudent(
        token: string,
        payload: NsUsermgmtUserModifierService.CreateStudentReq
    ): Promise<{
        request: CreateStudentRequest.AsObject;
        response?: CreateStudentResponse.AsObject;
    }> {
        const request = createStudentReq(payload);
        const response = await callGRPC<CreateStudentRequest, CreateStudentResponse>({
            serviceName: this.serviceName,
            methodName: 'CreateStudent',
            request,
            token,
            requestType: CreateStudentRequest,
            responseType: CreateStudentResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async updateStudent(
        token: string,
        payload: UpdateStudentRequest.AsObject
    ): Promise<{
        request: UpdateStudentRequest.AsObject;
        response?: UpdateStudentResponse.AsObject;
    }> {
        const request = updateStudentReq(payload);
        const response = await callGRPC<UpdateStudentRequest, UpdateStudentResponse>({
            serviceName: this.serviceName,
            methodName: 'UpdateStudent',
            request,
            token,
            requestType: UpdateStudentRequest,
            responseType: UpdateStudentResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async createParentReq(
        token: string,
        payload: CreateParentsAndAssignToStudentRequest.AsObject
    ): Promise<{
        request: CreateParentsAndAssignToStudentRequest.AsObject;
        response?: CreateParentsAndAssignToStudentResponse.AsObject;
    }> {
        const request = createParentReq(payload);
        const response = await callGRPC<
            CreateParentsAndAssignToStudentRequest,
            CreateParentsAndAssignToStudentResponse
        >({
            serviceName: this.serviceName,
            methodName: 'CreateParentsAndAssignToStudent',
            request,
            token,
            requestType: CreateParentsAndAssignToStudentRequest,
            responseType: CreateParentsAndAssignToStudentResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async updateParentReq(
        token: string,
        payload: UpdateParentsAndFamilyRelationshipRequest.AsObject
    ): Promise<{
        request: UpdateParentsAndFamilyRelationshipRequest.AsObject;
        response?: UpdateParentsAndFamilyRelationshipResponse.AsObject;
    }> {
        const request = updateParentReq(payload);
        const response = await callGRPC<
            UpdateParentsAndFamilyRelationshipRequest,
            UpdateParentsAndFamilyRelationshipResponse
        >({
            serviceName: this.serviceName,
            methodName: 'UpdateParentsAndFamilyRelationship',
            request,
            token,
            requestType: UpdateParentsAndFamilyRelationshipRequest,
            responseType: UpdateParentsAndFamilyRelationshipResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async upsertStudentCoursePackageReq(
        token: string,
        payload: NsUsermgmtUserModifierService.UpsertStudentCoursePackagePayload
    ): Promise<{
        request: UpsertStudentCoursePackageRequest.AsObject;
        response?: UpsertStudentCoursePackageResponse.AsObject;
    }> {
        const request = upsertStudentCoursePackageReq(payload);
        const response = await callGRPC<
            UpsertStudentCoursePackageRequest,
            UpsertStudentCoursePackageResponse
        >({
            serviceName: this.serviceName,
            methodName: 'UpsertStudentCoursePackage',
            request,
            token,
            requestType: UpsertStudentCoursePackageRequest,
            responseType: UpsertStudentCoursePackageResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async reissuePassword(
        token: string,
        payload: ReissueUserPasswordRequest.AsObject
    ): Promise<{
        request: ReissueUserPasswordRequest.AsObject;
        response?: ReissueUserPasswordResponse.AsObject;
    }> {
        const request = reissuePasswordReq(payload);
        const response = await callGRPC<ReissueUserPasswordRequest, ReissueUserPasswordResponse>({
            serviceName: this.serviceName,
            methodName: 'ReissueUserPassword',
            request,
            token,
            requestType: ReissueUserPasswordRequest,
            responseType: ReissueUserPasswordResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
}
