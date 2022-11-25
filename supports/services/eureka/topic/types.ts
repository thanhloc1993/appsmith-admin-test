import ServiceBase from '../../base';
import NsTopicModifierServiceRequest from './request-types';
import { UpsertTopicsRequest, UpsertTopicsResponse } from 'manabuf/eureka/v1/topic_modifier_pb';

export interface ITopicModifierServiceService extends ServiceBase {
    /**
     * Create and update topics using gRPC endpoint
     * @param {ITopicModifierServiceService.upsertTopics} topic list
     * @param {string} token User's token
     * @returns {Promise<{ request: UpsertTopicsRequest.AsObject, response?: UpsertTopicsResponse.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const {request, response} = await topicModifierService.upsertTopics(token, topics);
     */
    upsertTopics(
        token: string,
        topics: NsTopicModifierServiceRequest.UpsertTopics[]
    ): Promise<{
        request: UpsertTopicsRequest.AsObject;
        response?: UpsertTopicsResponse.AsObject;
    }>;
}
