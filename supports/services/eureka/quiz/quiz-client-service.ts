import { callGRPC } from '@supports/services/grpc/grpc';

import { createUpsertFlashcardContentRequest } from './request';
import NsQuizModifierServiceRequest from './request-types';
import {
    UpsertFlashcardContentRequest,
    UpsertFlashcardContentResponse,
} from 'manabuf/syllabus/v1/quiz_service_pb';
import ServiceBase from 'supports/services/base';

class QuizClientService implements ServiceBase {
    serviceName = 'syllabus.v1.Quiz';

    async upsertFlashcardContent(
        token: string,
        payload: NsQuizModifierServiceRequest.UpsertFlashcardContent
    ): Promise<{
        request: UpsertFlashcardContentRequest.AsObject;
        response: UpsertFlashcardContentResponse.AsObject;
    }> {
        const request = createUpsertFlashcardContentRequest(payload);

        const response = await callGRPC<
            UpsertFlashcardContentRequest,
            UpsertFlashcardContentResponse
        >({
            serviceName: this.serviceName,
            methodName: 'UpsertFlashcardContent',
            request,
            token,
            requestType: UpsertFlashcardContentRequest,
            responseType: UpsertFlashcardContentResponse,
        });

        return { request: request.toObject(), response: response.message!.toObject() };
    }
}

export default QuizClientService;
