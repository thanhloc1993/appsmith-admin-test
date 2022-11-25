import ServiceBase from '../../base';
import { callGRPC } from '../../grpc/grpc';
import { createInsertFlashcardRequest } from './request';
import NsLearningObjectiveModifierServiceRequest from './request-types';
import {
    InsertFlashcardRequest,
    InsertFlashcardResponse,
} from 'manabuf/syllabus/v1/flashcard_service_pb';

class FlashcardModifierService extends ServiceBase {
    serviceName = 'syllabus.v1.Flashcard';

    async insertFlashcard(
        token: string,
        flashcard: NsLearningObjectiveModifierServiceRequest.InsertFlashcard
    ): Promise<{
        request: InsertFlashcardRequest.AsObject;
        response?: InsertFlashcardResponse.AsObject | undefined;
    }> {
        const request = createInsertFlashcardRequest(flashcard);
        const response = await callGRPC<InsertFlashcardRequest, InsertFlashcardResponse>({
            serviceName: this.serviceName,
            methodName: 'InsertFlashcard',
            request,
            token,
            requestType: InsertFlashcardRequest,
            responseType: InsertFlashcardResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}

export default FlashcardModifierService;
