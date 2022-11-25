import { callGRPC } from '../grpc/grpc';
import {
    createUpsertMasterStudyPlanItemsRequest,
    createUpsertStudyPlanItemsRequest,
    createUpsertStudyPlanRequest,
} from './eureka-study-plan-modifier-request';
import { StudyPlanItemObject } from './types';
import {
    UpsertStudyPlanItemV2Request,
    UpsertStudyPlanItemV2Response,
    UpsertStudyPlanRequest,
    UpsertStudyPlanResponse,
} from 'manabuf/eureka/v1/study_plan_modifier_pb';
import {
    UpsertMasterInfoRequest,
    UpsertMasterInfoResponse,
} from 'manabuf/syllabus/v1/study_plan_service_pb';
import { STUDYPLAN_MODIFIER_UPSERT_RESOURCE } from 'step-definitions/endpoints/eureka-studyplan-modifier';

export class StudyPlanModifierService {
    readonly serviceName = 'eureka.v1.StudyPlanModifierService';

    async upsertStudyPlan(token: string, payload: UpsertStudyPlanRequest.AsObject) {
        const request = createUpsertStudyPlanRequest(payload);
        const response = await callGRPC<UpsertStudyPlanRequest, UpsertStudyPlanResponse>({
            token,
            request,
            serviceName: this.serviceName,
            methodName: STUDYPLAN_MODIFIER_UPSERT_RESOURCE,
            requestType: UpsertStudyPlanRequest,
            responseType: UpsertStudyPlanResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async upsertStudyPlanItems(token: string, payload: StudyPlanItemObject[], timezone: string) {
        const request = createUpsertStudyPlanItemsRequest(payload, timezone);

        const response = await callGRPC<
            UpsertStudyPlanItemV2Request,
            UpsertStudyPlanItemV2Response
        >({
            token,
            request,
            serviceName: this.serviceName,
            methodName: 'UpsertStudyPlanItemV2',
            requestType: UpsertStudyPlanItemV2Request,
            responseType: UpsertStudyPlanItemV2Response,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async upsertMasterStudyPlanItems(token: string, payload: any, timezone: string) {
        const request = createUpsertMasterStudyPlanItemsRequest(payload, timezone);

        const response = await callGRPC<UpsertMasterInfoRequest, UpsertMasterInfoResponse>({
            token,
            request,
            serviceName: this.serviceName,
            methodName: 'UpsertMasterInfo',
            requestType: UpsertMasterInfoRequest,
            responseType: UpsertMasterInfoResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
}
