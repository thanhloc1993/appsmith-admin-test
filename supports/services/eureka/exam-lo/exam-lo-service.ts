import ServiceBase from '../../base';
import { callGRPC } from '../../grpc/grpc';
import { createInsertExamLORequest } from './request';
import NsExamLOModifierServiceRequest from './request-types';
import { InsertExamLORequest, InsertExamLOResponse } from 'manabuf/syllabus/v1/exam_lo_service_pb';

class ExamLOModifierService extends ServiceBase {
    serviceName = 'syllabus.v1.ExamLO';

    async insertExamLO(
        token: string,
        examLO: NsExamLOModifierServiceRequest.InsertExamLO
    ): Promise<{
        request: InsertExamLORequest.AsObject;
        response: InsertExamLOResponse.AsObject | undefined;
    }> {
        const request = createInsertExamLORequest(examLO);
        const response = await callGRPC<InsertExamLORequest, InsertExamLOResponse>({
            serviceName: this.serviceName,
            methodName: 'InsertExamLO',
            request,
            token,
            requestType: InsertExamLORequest,
            responseType: InsertExamLOResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}

export default ExamLOModifierService;
