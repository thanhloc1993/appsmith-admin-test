import ServiceBase from '../../base';
import NsQuizModifierServiceRequest from './request-types';
import {
    UpsertQuizV2Request,
    UpsertQuizV2Response,
    UpsertSingleQuizResponse,
    UpsertSingleQuizRequest,
} from 'manabuf/eureka/v1/quiz_modifier_pb';

export interface IQuizModifierServiceService extends ServiceBase {
    /**
     * Create and update quizes using gRPC endpoint
     * @param {IQuizModifierServiceService.upsertQuizV2} quiz list
     * @param {string} token User's token
     * @returns {Promise<{ request: UpsertQuizV2Request.AsObject, response?: UpsertQuizV2Response.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const {request, response} = await quizModifierServiceService.upsertQuizV2(token, payload);
     */
    upsertQuizV2(
        token: string,
        payload: NsQuizModifierServiceRequest.UpsertQuizV2
    ): Promise<{
        request: UpsertQuizV2Request.AsObject;
        response?: UpsertQuizV2Response.AsObject;
    }>;

    /**
     * Create and update single quiz using gRPC endpoint
     * @param {IQuizModifierServiceService.upsertSingleQuiz} quiz list
     * @param {string} token User's token
     * @returns {Promise<{ request: UpsertSingleQuizRequest.AsObject, response?: UpsertSingleQuizResponse.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const {request, response} = await quizModifierServiceService.upsertSingleQuiz(token, payload);
     */
    upsertSingleQuiz(
        token: string,
        payload: NsQuizModifierServiceRequest.UpsertSingleQuiz
    ): Promise<{
        request: UpsertSingleQuizRequest.AsObject;
        response?: UpsertSingleQuizResponse.AsObject;
    }>;
}
