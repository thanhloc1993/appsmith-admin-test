import NsCourseModifierServiceRequest from './request-types';
import { AddBooksRequest } from 'manabuf/eureka/v1/course_modifier_pb';
import { toArr } from 'step-definitions/utils';

export function createAddBooksRequest({
    courseId,
    bookIdsList,
}: NsCourseModifierServiceRequest.AddBooks) {
    const request = new AddBooksRequest();
    const ids = toArr(bookIdsList);

    request.setCourseId(courseId);
    request.setBookIdsList(ids);

    return request;
}
