import { callGRPC } from '@supports/services/grpc/grpc';

import { createAddBooksRequest } from './request';
import NsCourseModifierServiceRequest from './request-types';
import { ICourseModifierService } from './types';
import { AddBooksRequest, AddBooksResponse } from 'manabuf/eureka/v1/course_modifier_pb';

export default class CourseModifierService implements ICourseModifierService {
    serviceName = 'eureka.v1.CourseModifierService';

    async addBooks(
        { courseId, bookIdsList }: NsCourseModifierServiceRequest.AddBooks,
        token: string
    ): Promise<{
        request: NsCourseModifierServiceRequest.AddBooks;
        response?: AddBooksResponse.AsObject;
    }> {
        const request = createAddBooksRequest({ courseId, bookIdsList });
        const response = await callGRPC<AddBooksRequest, AddBooksResponse>({
            serviceName: this.serviceName,
            methodName: 'AddBooks',
            request,
            token,
            requestType: AddBooksRequest,
            responseType: AddBooksResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
