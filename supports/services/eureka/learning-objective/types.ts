import ServiceBase from '../../base';
import NsLearningObjectiveModifierServiceRequest from './request-types';
import {
    UpsertLOsRequest,
    UpsertLOsResponse,
} from 'manabuf/eureka/v1/learning_objective_modifier_pb';

export interface ILearningObjectiveModifierServiceService extends ServiceBase {
    /**
     * Create and update learning objective using gRPC endpoint
     * @param {ILearningObjectiveModifierServiceService.upsertLearningObjectives} LO list
     * @param {string} token User's token
     * @returns {Promise<{ request: UpsertLOsRequest.AsObject, response?: UpsertLOsResponse.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const {request, response} = await learningObjectiveModifierService.upsertLearningObjectives(token, LOs);
     */
    upsertLearningObjectives(
        token: string,
        LOs: NsLearningObjectiveModifierServiceRequest.UpsertLearningObjectives[]
    ): Promise<{
        request: UpsertLOsRequest.AsObject;
        response?: UpsertLOsResponse.AsObject;
    }>;
}
