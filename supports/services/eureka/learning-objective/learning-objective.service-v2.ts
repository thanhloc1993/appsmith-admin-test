import { callGRPC } from '../../grpc/grpc';
import { createInsertLORequest } from './request';
import NsLearningObjectiveModifierServiceRequest from './request-types';
import {
    InsertLearningObjectiveRequest,
    InsertLearningObjectiveResponse,
} from 'manabuf/syllabus/v1/learning_objective_service_pb';

class LearningObjectiveModifierService {
    serviceName = 'syllabus.v1.LearningObjective';

    async insertLearningObjective(
        token: string,
        learningObjective: NsLearningObjectiveModifierServiceRequest.InsertLearningObjective
    ): Promise<{
        request: InsertLearningObjectiveRequest.AsObject;
        response?: InsertLearningObjectiveResponse.AsObject | undefined;
    }> {
        const request = createInsertLORequest(learningObjective);
        const response = await callGRPC<
            InsertLearningObjectiveRequest,
            InsertLearningObjectiveResponse
        >({
            serviceName: this.serviceName,
            methodName: 'InsertLearningObjective',
            request,
            token,
            requestType: InsertLearningObjectiveRequest,
            responseType: InsertLearningObjectiveResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}

export default new LearningObjectiveModifierService();
