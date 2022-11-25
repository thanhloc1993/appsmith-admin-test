import ServiceBase from '../../base';
import NsCourseModifierServiceRequest from './request-types';
import { AddBooksResponse } from 'manabuf/eureka/v1/course_modifier_pb';

export interface ICourseModifierService extends ServiceBase {
    /**
     * Add books to course using gRPC endpoint
     * @param {Object} params Object with Course ID and book IDs
     * @param {string} params.courseId Course ID
     * @param {string[]} params.bookIdsList Book IDs
     * @param {string} token User's token
     * @returns {Promise<{ request: NsCourseModifierServiceRequest.AddBooks, response?: AddBooksResponse.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const { request, response } = await courseModifierService.addBooks(
     *          { courseId, bookIdsList },
     *          token
     *      );
     */
    addBooks(
        { courseId, bookIdsList }: NsCourseModifierServiceRequest.AddBooks,
        token: string
    ): Promise<{
        request: NsCourseModifierServiceRequest.AddBooks;
        response?: AddBooksResponse.AsObject;
    }>;
}
