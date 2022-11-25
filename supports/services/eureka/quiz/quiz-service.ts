import { createQuizV2Request, createUpsertSingleQuizRequest } from '@supports/services/common/quiz';
import { callGRPC } from '@supports/services/grpc/grpc';

import NsQuizModifierServiceRequest from './request-types';
import { IQuizModifierServiceService } from './types';
import {
    UpsertQuizV2Request,
    UpsertQuizV2Response,
    UpsertSingleQuizRequest,
    UpsertSingleQuizResponse,
} from 'manabuf/eureka/v1/quiz_modifier_pb';

class QuizModifierService implements IQuizModifierServiceService {
    serviceName = 'eureka.v1.QuizModifierService';

    // upsertSingleQuiz does not support create PPL(Promise.all, etc...)
    async upsertSingleQuiz(token: string, payload: NsQuizModifierServiceRequest.UpsertSingleQuiz) {
        const request = createUpsertSingleQuizRequest(payload);

        const response = await callGRPC<UpsertSingleQuizRequest, UpsertSingleQuizResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertSingleQuiz',
            request,
            token,
            requestType: UpsertSingleQuizRequest,
            responseType: UpsertSingleQuizResponse,
        });

        return { request: request.toObject(), response: response.message!.toObject() };
    }

    async upsertQuizV2(
        token: string,
        payload: NsQuizModifierServiceRequest.UpsertQuizV2
    ): Promise<{
        request: UpsertQuizV2Request.AsObject;
        response: UpsertQuizV2Response.AsObject;
    }> {
        const request = createQuizV2Request(payload);

        const response = await callGRPC<UpsertQuizV2Request, UpsertQuizV2Response>({
            serviceName: this.serviceName,
            methodName: 'UpsertQuizV2',
            request,
            token,
            requestType: UpsertQuizV2Request,
            responseType: UpsertQuizV2Response,
        });

        return { request: request.toObject(), response: response.message!.toObject() };
    }
}

export default QuizModifierService;
