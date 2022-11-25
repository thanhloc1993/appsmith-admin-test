import { genId } from '../../../step-definitions/utils';
import NsMasterCourseService from './request-types';
import { UpsertCoursesRequest } from 'manabuf/mastermgmt/v1/course_pb';

export const createUpsertCoursesRequest = (
    courses: NsMasterCourseService.UpsertCoursesRequest[]
) => {
    const request = new UpsertCoursesRequest();
    const requestCourses = courses.map((course) => {
        const requestCourse = new UpsertCoursesRequest.Course();

        requestCourse.setId(course.id || genId());
        requestCourse.setName(course.name);
        requestCourse.setDisplayOrder(course.displayOrder);
        requestCourse.setBookIdsList(course.bookIdsList);
        requestCourse.setIcon(course.icon);
        requestCourse.setSchoolId(course.schoolId);
        requestCourse.setLocationIdsList(course.locationIdsList || []);
        return requestCourse;
    });

    request.setCoursesList(requestCourses);

    return request;
};
