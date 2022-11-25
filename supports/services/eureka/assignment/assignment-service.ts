import { callGRPC } from '../../grpc/grpc';
import { createUpsertAssignmentsRequest } from './request';
import NsAssignmentModifierServiceRequest from './request-types';
import { IAssignmentModifierService } from './types';
import {
    UpsertAssignmentsRequest,
    UpsertAssignmentsResponse,
} from 'manabuf/eureka/v1/assignment_writer_pb';

export default class AssignmentModifierService implements IAssignmentModifierService {
    serviceName = 'eureka.v1.AssignmentModifierService';

    async upsertAssignments(
        token: string,
        assignments: NsAssignmentModifierServiceRequest.UpsertAssignments[]
    ): Promise<{
        request: UpsertAssignmentsRequest.AsObject;
        response?: UpsertAssignmentsResponse.AsObject | undefined;
    }> {
        const request = createUpsertAssignmentsRequest(assignments);
        const response = await callGRPC<UpsertAssignmentsRequest, UpsertAssignmentsResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertAssignments',
            request,
            token,
            requestType: UpsertAssignmentsRequest,
            responseType: UpsertAssignmentsResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
