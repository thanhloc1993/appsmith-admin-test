import ServiceBase from '../base';
import NsUsermgmtUserModifierService from './request-types';
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
} from 'manabuf/usermgmt/v2/users_pb';

export interface IUsermgmtUserModifierService extends ServiceBase {
    /**
     * Creates student using gRPC endpoint.
     * @param {string} token The user's token
     * @param {CreateStudentRequest.AsObject}  payload The student profile to be created
     * @returns {Promise<{ request: CreateStudentRequest.AsObject, response?: CreateStudentResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    createStudent(
        token: string,
        payload: NsUsermgmtUserModifierService.CreateStudentReq
    ): Promise<{
        request: CreateStudentRequest.AsObject;
        response?: CreateStudentResponse.AsObject;
    }>;

    /**
     * Creates student using gRPC endpoint.
     * @param {string} token The user's token
     * @param {UpdateStudentRequest.AsObject} payload The student profile to be updated
     * @returns {Promise<{ request: UpdateStudentRequest.AsObject, response?: UpdateStudentResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    updateStudent(
        token: string,
        payload: UpdateStudentRequest.AsObject
    ): Promise<{
        request: UpdateStudentRequest.AsObject;
        response?: UpdateStudentResponse.AsObject;
    }>;

    /**
     * Creates student using gRPC endpoint.
     * @param {string} token The user's token
     * @param {CreateParentsAndAssignToStudentRequest.AsObject} payload The student profile to be updated
     * @returns {Promise<{ request: CreateParentsAndAssignToStudentRequest.AsObject, response?: CreateParentsAndAssignToStudentResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    createParentReq(
        token: string,
        payload: CreateParentsAndAssignToStudentRequest.AsObject
    ): Promise<{
        request: CreateParentsAndAssignToStudentRequest.AsObject;
        response?: CreateParentsAndAssignToStudentResponse.AsObject;
    }>;

    /**
     * Creates student using gRPC endpoint.
     * @param {string} token The user's token
     * @param {UpdateParentsAndFamilyRelationshipRequest.AsObject} payload The student profile to be updated
     * @returns {Promise<{ request: UpsertStudentCoursePackageRequest.AsObject, response?: UpsertStudentCoursePackageResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    updateParentReq(
        token: string,
        payload: UpdateParentsAndFamilyRelationshipRequest.AsObject
    ): Promise<{
        request: UpdateParentsAndFamilyRelationshipRequest.AsObject;
        response?: UpdateParentsAndFamilyRelationshipResponse.AsObject;
    }>;

    /**
     * Creates student using gRPC endpoint.
     * @param {string} token The user's token
     * @param {UpsertStudentCoursePackageRequest.AsObject} payload The student profile to be updated
     * @returns {Promise<{ request: UpdateStudentRequest.AsObject, response?: UpdateStudentResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    upsertStudentCoursePackageReq(
        token: string,
        payload: NsUsermgmtUserModifierService.UpsertStudentCoursePackagePayload
    ): Promise<{
        request: UpsertStudentCoursePackageRequest.AsObject;
        response?: UpsertStudentCoursePackageResponse.AsObject;
    }>;
}
