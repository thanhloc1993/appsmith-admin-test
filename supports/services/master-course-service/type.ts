import ServiceBase from '../base';
import NsMasterCourseService from './request-types';

export interface IMasterCourseService extends ServiceBase {
    upsertCourses(
        token: string,
        courses: NsMasterCourseService.UpsertCoursesRequest[]
    ): Promise<{
        request: NsMasterCourseService.UpsertCoursesRequest[];
        response?: NsMasterCourseService.UpsertCoursesResponse;
    }>;
}
