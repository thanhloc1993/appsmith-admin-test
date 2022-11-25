import { callGRPC } from '../grpc/grpc';
import { createUpsertCoursesRequest } from './request';
import NsMasterCourseService from './request-types';
import { IMasterCourseService } from './type';
import { UpsertCoursesRequest, UpsertCoursesResponse } from 'manabuf/mastermgmt/v1/course_pb';

export default class MasterCourseService implements IMasterCourseService {
    readonly serviceName = 'mastermgmt.v1.MasterDataCourseService';

    async upsertCourses(
        token: string,
        courses: NsMasterCourseService.UpsertCoursesRequest[]
    ): Promise<{
        request: NsMasterCourseService.UpsertCoursesRequest[];
        response?: NsMasterCourseService.UpsertCoursesResponse;
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
