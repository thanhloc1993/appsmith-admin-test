import ServiceBase from '../../base';
import NsAssignmentModifierServiceRequest from './request-types';
import {
    UpsertAssignmentsRequest,
    UpsertAssignmentsResponse,
} from 'manabuf/eureka/v1/assignment_writer_pb';

export interface IAssignmentModifierService extends ServiceBase {
    /**
     * Create and update assignments using gRPC endpoint
     * @param {IAssignmentModifierServiceService.upsertAssignments} assignment list
     * @param {string} token User's token
     * @returns {Promise<{ request: UpsertAssignmentsRequest.AsObject, response?: UpsertAssignmentsResponse.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const {request, response} = await assignmentModifierService.upsertAssignments(token, assignments);
     */
    upsertAssignments(
        token: string,
        assignments: NsAssignmentModifierServiceRequest.UpsertAssignments[]
    ): Promise<{
        request: UpsertAssignmentsRequest.AsObject;
        response?: UpsertAssignmentsResponse.AsObject;
    }>;
}
