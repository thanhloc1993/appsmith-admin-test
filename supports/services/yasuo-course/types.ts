import ServiceBase from '../base';
import NsYasuoCourseServiceRequest from './request-types';
import { UpsertCoursesResponse } from 'manabie-yasuo/course_pb';

export interface IYasuoCourseService extends ServiceBase {
    /**
     * Creates or updates courses using gRPC endpoint.
     * @param {string} token The user's token
     * @param {NsYasuoCourseServiceRequest.UpsertCourses[]} courses The courses to be created or updated
     * @returns Promise<{
     *           request: NsYasuoCourseServiceRequest.UpsertCourses[];
     *           response?: UpsertCoursesResponse.AsObject;
     *           }>- A Promise that will be fulfilled with the request and response
     * @example
     * const { iconUrl, schoolId } = await cms.getContentBasic();
     * const course = {
     *     id: genId(),
     *     name: `Course Name ${genId()}`,
     *     displayOrder: 1,
     *     chapterIdsList: [],
     *     bookIdsList: [],
     *     icon: iconUrl,
     *     schoolId,
     * };
     *
     * const {request, response} = await yasuoCourseService.upsertCourses(token, [course]);
     *
     * console.log("UpsertCourse's response: " + response.message?.toObject().successful);
     * console.log("UpsertCourse's request course name: " + request[0].name);
     */
    upsertCourses(
        token: string,
        courses: NsYasuoCourseServiceRequest.UpsertCourses[]
    ): Promise<{
        request: NsYasuoCourseServiceRequest.UpsertCourses[];
        response?: UpsertCoursesResponse.AsObject;
    }>;
}
