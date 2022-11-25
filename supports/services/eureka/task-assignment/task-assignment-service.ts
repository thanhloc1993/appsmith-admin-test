import ServiceBase from '../../base';
import { callGRPC } from '../../grpc/grpc';
import { createInsertTaskAssignmentRequest } from './request';
import { NsTaskAssignmentModifierService } from './request-types';
import {
    InsertTaskAssignmentRequest,
    InsertTaskAssignmentResponse,
} from 'manabuf/syllabus/v1/task_assignment_service_pb';

class TaskAssignmentModifierService extends ServiceBase {
    serviceName = 'syllabus.v1.TaskAssignment';

    async insertTaskAssignment(
        token: string,
        payload: NsTaskAssignmentModifierService.InsertTaskAssignment
    ): Promise<{
        request: InsertTaskAssignmentRequest.AsObject;
        response?: InsertTaskAssignmentResponse.AsObject | undefined;
    }> {
        const request = createInsertTaskAssignmentRequest(payload);
        const response = await callGRPC<InsertTaskAssignmentRequest, InsertTaskAssignmentResponse>({
            serviceName: this.serviceName,
            methodName: 'InsertTaskAssignment',
            request,
            token,
            requestType: InsertTaskAssignmentRequest,
            responseType: InsertTaskAssignmentResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}

export default TaskAssignmentModifierService;
