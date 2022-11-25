import { callGRPC } from '../../grpc/grpc';
import { createUpsertLearningObjectiveRequest } from './request';
import NsLearningObjectiveModifierServiceRequest from './request-types';
import { ILearningObjectiveModifierServiceService } from './types';
import {
    UpsertLOsRequest,
    UpsertLOsResponse,
} from 'manabuf/eureka/v1/learning_objective_modifier_pb';

export default class LearningObjectiveModifierService
    implements ILearningObjectiveModifierServiceService
{
    serviceName = 'eureka.v1.LearningObjectiveModifierService';

    async upsertLearningObjectives(
        token: string,
        topics: NsLearningObjectiveModifierServiceRequest.UpsertLearningObjectives[]
    ): Promise<{
        request: UpsertLOsRequest.AsObject;
        response?: UpsertLOsResponse.AsObject | undefined;
    }> {
        const request = createUpsertLearningObjectiveRequest(topics);
        const response = await callGRPC<UpsertLOsRequest, UpsertLOsResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertLOs',
            request,
            token,
            requestType: UpsertLOsRequest,
            responseType: UpsertLOsResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
