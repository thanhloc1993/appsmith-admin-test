import { callGRPC } from '../grpc/grpc';
import { createUpsertCoursesRequest } from './request';
import NsYasuoCourseServiceRequest from './request-types';
import { IYasuoCourseService } from './types';
import { UpsertCoursesRequest, UpsertCoursesResponse } from 'manabie-yasuo/course_pb';

export default class YasuoCourseService implements IYasuoCourseService {
    readonly serviceName = 'manabie.yasuo.CourseService';

    async upsertCourses(
        token: string,
        courses: NsYasuoCourseServiceRequest.UpsertCourses[]
    ): Promise<{
        request: NsYasuoCourseServiceRequest.UpsertCourses[];
        response?: UpsertCoursesResponse.AsObject;
    }> {
        const request = createUpsertCoursesRequest(courses);

        const response = await callGRPC<UpsertCoursesRequest, UpsertCoursesResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertCourses',
            request,
            token,
            requestType: UpsertCoursesRequest,
            responseType: UpsertCoursesResponse,
        });

        return {
            request: request.toObject().coursesList,
            response: response.message?.toObject(),
        };
    }
}
