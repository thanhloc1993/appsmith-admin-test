import { callGRPC } from '../../grpc/grpc';
import { createInsertAssignmentRequest, createUpdateAssignmentRequest } from './request';
import NsAssignmentModifierServiceRequest from './request-types';
import {
    InsertAssignmentRequest,
    InsertAssignmentResponse,
    UpdateAssignmentRequest,
    UpdateAssignmentResponse,
} from 'manabuf/syllabus/v1/assignment_service_pb';

class AssignmentModifierService {
    serviceName = 'syllabus.v1.Assignment';

    async insertAssignment(
        token: string,
        assignment: NsAssignmentModifierServiceRequest.InsertAssignment
    ): Promise<{
        request: InsertAssignmentRequest.AsObject;
        response?: InsertAssignmentResponse.AsObject | undefined;
    }> {
        const request = createInsertAssignmentRequest(assignment);
        const response = await callGRPC<InsertAssignmentRequest, InsertAssignmentResponse>({
            serviceName: this.serviceName,
            methodName: 'InsertAssignment',
            request,
            token,
            requestType: InsertAssignmentRequest,
            responseType: InsertAssignmentResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }

    // Please restrict using this function, we can create data we want instead of update it after create
    async updateAssignment(
        token: string,
        assignment: NsAssignmentModifierServiceRequest.UpdateAssignment
    ): Promise<{
        request: UpdateAssignmentRequest.AsObject;
        response?: UpdateAssignmentResponse.AsObject | undefined;
    }> {
        const request = createUpdateAssignmentRequest(assignment);
        const response = await callGRPC<UpdateAssignmentRequest, UpdateAssignmentResponse>({
            serviceName: this.serviceName,
            methodName: 'UpdateAssignment',
            request,
            token,
            requestType: UpdateAssignmentRequest,
            responseType: UpdateAssignmentResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}

export default AssignmentModifierService;
