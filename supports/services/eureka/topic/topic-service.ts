import { callGRPC } from '../../grpc/grpc';
import { createUpsertTopicRequest } from './request';
import NsTopicModifierServiceRequest from './request-types';
import { ITopicModifierServiceService } from './types';
import { UpsertTopicsRequest, UpsertTopicsResponse } from 'manabuf/eureka/v1/topic_modifier_pb';

export default class TopicModifierService implements ITopicModifierServiceService {
    serviceName = 'eureka.v1.TopicModifierService';

    async upsertTopics(
        token: string,
        topics: NsTopicModifierServiceRequest.UpsertTopics[]
    ): Promise<{
        request: UpsertTopicsRequest.AsObject;
        response?: UpsertTopicsResponse.AsObject | undefined;
    }> {
        const request = createUpsertTopicRequest(topics);
        const response = await callGRPC<UpsertTopicsRequest, UpsertTopicsResponse>({
            serviceName: this.serviceName,
            methodName: 'Upsert',
            request,
            token,
            requestType: UpsertTopicsRequest,
            responseType: UpsertTopicsResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
