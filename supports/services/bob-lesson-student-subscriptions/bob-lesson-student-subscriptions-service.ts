import { callGRPC } from '../grpc/grpc';
import {
    RetrieveStudentSubscriptionFilter,
    RetrieveStudentSubscriptionRequest,
    RetrieveStudentSubscriptionResponse,
} from 'manabuf/bob/v1/lessons_pb';
import { Paging } from 'manabuf/common/v1/requests_pb';

export interface RetrieveStudentSubscriptionRequestData
    extends RetrieveStudentSubscriptionRequest.AsObject {}

export default class StudentSubscriptionsService {
    static serviceName = 'bob.v1.StudentSubscriptionService';
    static retrieveStudentSubscriptionMethodName = 'RetrieveStudentSubscription';

    static setRetrieveStudentSubscriptionRequestData = async (
        request: RetrieveStudentSubscriptionRequest,
        requestData: RetrieveStudentSubscriptionRequestData
    ) => {
        request.setKeyword(requestData.keyword);

        const filter = new RetrieveStudentSubscriptionFilter();
        const { courseIdList = [], gradeList = [] } = requestData.filter || {};

        filter.setGradeList(gradeList);
        filter.setCourseIdList(courseIdList);
        request.setFilter(filter);

        const paging = new Paging();
        const {
            limit = 10,
            offsetInteger = 0,
            offsetString = 'offsetString',
        } = requestData.paging || {};

        paging.setLimit(limit);
        paging.setOffsetInteger(offsetInteger);
        paging.setOffsetString(offsetString);
        request.setPaging(paging);
    };

    static async retrieveStudentSubscription(
        token: string,
        requestData: RetrieveStudentSubscriptionRequestData
    ): Promise<{
        request: RetrieveStudentSubscriptionRequestData;
        response: RetrieveStudentSubscriptionResponse.AsObject | undefined;
    }> {
        const request = new RetrieveStudentSubscriptionRequest();
        await this.setRetrieveStudentSubscriptionRequestData(request, requestData);
        const response = await callGRPC<
            RetrieveStudentSubscriptionRequest,
            RetrieveStudentSubscriptionResponse
        >({
            serviceName: this.serviceName,
            methodName: this.retrieveStudentSubscriptionMethodName,
            request,
            token,
            requestType: RetrieveStudentSubscriptionRequest,
            responseType: RetrieveStudentSubscriptionResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
